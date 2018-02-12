import { urlParams, StudentLaunchParams, TeacherReportParams } from "./url-params";
import { v4 as uuid } from "uuid";
import * as jwt from 'jsonwebtoken';

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

export class PortalUrlUtility {
    domain: string;
    token: string;
    isTeacher: boolean;
    classId: string;
    offeringId: string;
    offeringUrl?: string;
    activityName?: string;
    activityUrl?: string;

    constructor() {
      this.isTeacher = urlParams.isTeacher;
      this.domain = defaultDomain;
      this.classId = defaultClass;
      this.offeringId = defaultOffering;
    }

    async getFirebaseKey():Promise<string> {
      if (urlParams.isPortalTeacher) {
        await this.extractTeacherInfo(urlParams.params as TeacherReportParams);
      }
      else if (urlParams.isPortalStudent) {
        await this.extractStudentInfo(urlParams.params as StudentLaunchParams);
      }
      return `${this.domain}-${this.classId}-${this.offeringId}`;
    }

    async extractStudentInfo(params: StudentLaunchParams) {
      const domain = params.domain && extractRawDomain(params.domain);
      if (!params.domain || !domain) { return; }
      this.domain = extractDomain(params.domain) || '';
      const jwtUrl = `${domain}/api/v1/jwt/firebase?firebase_app=pc-weather`;
      const authorizationHeader = `Bearer ${params.token}`;
      const headers = ({headers: {Authorization: authorizationHeader}});
      let validJsonResponse = true;
      const response = await fetch(jwtUrl, headers);
      const json = await response.json()
                          .catch(error => validJsonResponse = false);
      if (!response.ok) {
        throw extractError(response, validJsonResponse ? json : undefined);
      }
      const _authToken = jwt.decode(json.token);
      if (_authToken && (typeof _authToken === 'object')) {
        const authToken: IPortalJwt = _authToken as IPortalJwt;
        // this.isTeacher = authToken.claims.user_type === 'teacher';
        if (authToken.class_info_url) {
          const match = /classes\/([^\/]*)/.exec(authToken.class_info_url);
          const classId = match && match[1];
          if (classId) {
            this.classId = classId;
          }
        }
        if (authToken.claims.offering_id) {
          this.offeringId = String(authToken.claims.offering_id);
        }
      }
    }

    async extractTeacherInfo(params: TeacherReportParams) {
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
      const reportEntry = Array.isArray(reportData) ? reportData[0] : reportData;
      const match = /offerings\/([^\/]*)/.exec(params.offering);
      this.classId = `${reportEntry.clazz_id}`;
      if (match && match[1]) {
        this.offeringId = match[1];
      }
      this.offeringUrl = params.offering;
      this.activityName = reportData.activity;
      this.activityUrl = reportData.activity_url;

      this.domain = extractDomain((urlParams.params as TeacherReportParams).offering);
    }
}
