import * as queryString from "query-string";

export const kDefaultDomain = 'default',
             kDefaultClass = 'simulation',
             kDefaultSimulationName = `${kDefaultDomain}-${kDefaultClass}`;

interface StudentLaunchParams {
  domain: string;
  class_info_url: string;
  domain_uid: string;
  externalId: string;
  logging: boolean;
  returnUrl: string;
}

interface TeacherReportParams {
  offering: string;
  token: string;
}

interface DebugParams {
  student?: boolean | null;
}

type UnionParams = StudentLaunchParams | TeacherReportParams | DebugParams;

function isStudentParams(params: UnionParams): params is StudentLaunchParams {
  return ((params as StudentLaunchParams).class_info_url != null);
}

function isTeacherParams(params: UnionParams): params is TeacherReportParams {
  return ((params as TeacherReportParams).offering != null);
}

function isStudentDebugParams(params: UnionParams): params is DebugParams {
  return ((params as DebugParams).student !== undefined);
}

function extractDomain(url:string) {
  const domainMatcher = /https?:\/\/([^\/]*)/i;
  const matches = url.match(domainMatcher);
  if(matches && matches.length > 0) {
    return matches[1].replace(/\./g,"_");
  }
  return kDefaultDomain;
}

export class PortalUrlUtility {
    params: UnionParams;
    domain: string;
    classId: string;
    isTeacher: boolean;
    isStudent: boolean;

    constructor() {
      const q = queryString;
      this.params = q.parse(window.location.search);
      // passing 'student' URL parameter indicates student -- primarily for debugging
      this.isStudent = isStudentParams(this.params) || isStudentDebugParams(this.params);
      // default to teacher unless student is specified
      this.isTeacher = isTeacherParams(this.params) || !this.isStudent;
      this.domain = kDefaultDomain;
      this.classId = kDefaultClass;
    }

    async getFirebaseKey():Promise<string> {
      if (isTeacherParams(this.params)) {
        await this.extractTeacherInfo(this.params as TeacherReportParams);
      }
      else if (isStudentParams(this.params)) {
        await this.extractStudentInfo(this.params as StudentLaunchParams);
      }
      return `${this.domain}-${this.classId}`;
    }

    async extractStudentInfo(params: StudentLaunchParams) {
      this.classId = params.class_info_url && params.class_info_url.split("/").pop() || "💀";
      this.domain = extractDomain(params.domain);
    }

    async extractTeacherInfo(params: TeacherReportParams) {
      const authorizationHeader = `Bearer ${params.token}`;
      const headers = ({headers: {Authorization: authorizationHeader}});
      const response = await fetch(params.offering, headers);
      const reportData = await response.json();
      this.classId = `${reportData[0].clazz_id}`;
      this.domain = extractDomain((this.params as TeacherReportParams).offering);
    }
}
