import { urlParams, StudentLaunchParams, TeacherReportParams, setStudentJwt, getStudentJwt } from "./url-params";
import { v4 as uuid } from "uuid";
import * as jwt from 'jsonwebtoken';
import { launchedFromLara, getLaraUserInfo } from "./lara";

interface PartialOfferingReport {
  clazz_id: number;
  clazz_info_url: string;
  id: number;
  activity: string;
}

interface PartialClassInfo {
  class_hash: string;
  name: string;
}

export const defaultSimulationName = uuid(),
             defaultDomain = defaultSimulationName.substr(0, 18),
             defaultClass = defaultSimulationName.substr(19, 4),
             defaultOffering = defaultSimulationName.substr(24);

function extractRawDomain(url:string) {
  const domainMatcher = /https?:\/\/[^\/]*/i;
  const matches = url.match(domainMatcher);
  return (matches && matches[0]) || null;
}

function extractDomain(url:string) {
  const domainMatcher = /https?:\/\/([^\/]*)/i;
  const matches = url.match(domainMatcher);
  if(matches && matches.length > 0) {
    return matches[1].replace(/\./g,"_");
  }
  return "no_domain";
}

function extractError(response: any, json?: any) {
  if (!response.ok) {
    const status = response.status,
          message = json && json.message || response.statusText || "",
          divider = response.statusText ? ": " : "",
          errorText = `${status}${divider}${message}`;
    throw new Error(errorText);
  }
}

interface IPortalJwtClaims {
  user_type: string;
  user_id: string;
  class_hash: string;
  offering_id?: number;
}

interface IPortalJwt {
  iat: number;
  exp: number;
  uid: string;
  domain: string;
  externalId: number;
  returnUrl: string;
  logging: boolean;
  domain_uid: number;
  class_info_url?: string;
  claims: IPortalJwtClaims;
}

export interface ActivityInfo {
  className?: string;
  activityName?: string;
  offeringId?: string;
}

export class PortalUrlUtility {
    domain: string;
    token: string;
    isTeacher: boolean;
    classId: string;
    offeringId: string;
    offeringUrl?: string;
    activityName?: string;
    activityUrl?: string;
    firebaseKey: string;
    firebaseJWT: string | null;
    classHash: string | null;
    activityInfo: ActivityInfo;

    constructor() {
      this.isTeacher = urlParams.isTeacher;
      this.domain = defaultDomain;
      this.classId = defaultClass;
      this.offeringId = defaultOffering;
      this.activityInfo = {};
    }

    async getFirebaseSettings(portalAppName: string):Promise<{key: string, jwt: string|null, activityInfo: ActivityInfo}> {
      if (!this.firebaseKey) {
        if (urlParams.isPortalTeacher) {
          await this.extractTeacherInfo(urlParams.params as TeacherReportParams, portalAppName);
        }
        else if (urlParams.isPortalStudent) {
          await this.extractStudentInfo(urlParams.params as StudentLaunchParams, portalAppName);
        }
        else if (launchedFromLara) {
          await this.extractLaraInfo(portalAppName);
        }
        if (this.firebaseJWT && this.classHash) {
          this.firebaseKey = `portal_${this.classHash}_${this.offeringId}`;
        }
        else {
          this.firebaseKey = `no-portal_${this.domain}-${this.classId}-${this.offeringId}`;
        }
      }
      return {key: this.firebaseKey, jwt: this.firebaseJWT, activityInfo: this.activityInfo};
    }

    async requestJWT(domain: string, bearerToken: string, portalAppName: string, classHash?: string) {
        // retrieve firebase jwt from portal
        let jwtUrl = `${domain}/api/v1/jwt/firebase?firebase_app=${portalAppName}`;
        if (classHash) {
          jwtUrl = `${jwtUrl}&class_hash=${classHash}`;
        }
        const authorizationHeader = `Bearer ${bearerToken}`;
        const headers = ({headers: {Authorization: authorizationHeader}});
        let validJsonResponse = true;
        const response = await fetch(jwtUrl, headers);
        const json = await response.json()
                            .catch(error => validJsonResponse = false);
        if (!response.ok) {
          throw extractError(response, validJsonResponse ? json : undefined);
        }
        return json.token;
    }

    async requestClassInfo(url: string, bearerToken: string) {
      const authorizationHeader = `Bearer ${bearerToken}`;
      const headers = ({headers: {Authorization: authorizationHeader}});
      let validJsonResponse = true;
      const response = await fetch(url, headers);
      const json: PartialClassInfo = await response.json()
                          .catch(error => validJsonResponse = false);
      if (!validJsonResponse) {
        throw new Error("Unable to get class info");
      }
      return json;
    }

    async extractStudentInfo(params: StudentLaunchParams, portalAppName: string) {
      let domain = params.domain && extractRawDomain(params.domain),
          jwToken = null as (string | null);
      if (params.token && params.domain && domain) {
        // save firebase jwt in session storage
        jwToken = await this.requestJWT(domain, params.token, portalAppName);
        setStudentJwt(domain, jwToken);
      }
      else {
        // retrieve firebase jwt from session storage
        const jwtInfo = getStudentJwt();
        if (jwtInfo) {
          domain = jwtInfo.domain;
          jwToken = jwtInfo.token;
        }
      }
      this.firebaseJWT = jwToken;
      this.domain = extractDomain(domain || '');
      // decode firebase jwt
      const _authToken = jwToken ? jwt.decode(jwToken) : null;
      if (_authToken && (typeof _authToken === 'object')) {
        const authToken: IPortalJwt = _authToken as IPortalJwt;
        // this.isTeacher = authToken.claims.user_type === 'teacher';
        // extract class ID from firebase jwt
        if (authToken.class_info_url) {
          const match = /classes\/([^\/]*)/.exec(authToken.class_info_url);
          const classId = match && match[1];
          if (classId) {
            this.classId = classId;
          }
        }
        // extract offering ID from firebase jwt
        if (authToken.claims.offering_id) {
          this.offeringId = String(authToken.claims.offering_id);
        }
        this.classHash = authToken.claims.class_hash;
      }
      this.activityInfo.offeringId = this.offeringId;
    }

    async extractTeacherInfo(params: TeacherReportParams, portalAppName: string) {
      const authorizationHeader = `Bearer ${params.token}`;
      const headers = ({headers: {Authorization: authorizationHeader}});
      let validJsonResponse = true;
      const response = await fetch(params.offering, headers);
      const reportData = await response.json()
                          .catch(error => validJsonResponse = false);
      if (!response.ok) {
        throw extractError(response, validJsonResponse ? reportData : undefined);
      }
      // class reports return an array; offering reports return a single entry
      const reportEntry: PartialOfferingReport = Array.isArray(reportData) ? reportData[0] : reportData;
      const match = /offerings\/([^\/]*)/.exec(params.offering);
      this.classId = `${reportEntry.clazz_id}`;
      if (match && match[1]) {
        this.offeringId = match[1];
      }
      this.offeringUrl = params.offering;
      this.activityName = reportData.activity;
      this.activityUrl = reportData.activity_url;

      const classInfo = await this.requestClassInfo(reportEntry.clazz_info_url, params.token);
      this.classHash = classInfo.class_hash;
      const rawDomain = extractRawDomain(params.offering)!;
      this.firebaseJWT = await this.requestJWT(rawDomain, params.token, portalAppName, this.classHash);

      this.activityInfo = {
        className: classInfo.name,
        activityName: reportEntry.activity,
        offeringId: this.offeringId
      };

      this.domain = extractDomain(params.offering);
    }

    async extractLaraInfo(portalAppName: string) {
      const {classHash, offeringId, firebaseJWT, isTeacher} = await getLaraUserInfo(portalAppName);
      this.classHash = classHash;
      this.offeringId = offeringId;
      this.firebaseJWT = firebaseJWT;
      this.isTeacher = isTeacher;

      this.activityInfo.offeringId = offeringId;
    }
}

export const gPortalUrlUtility = new PortalUrlUtility();
