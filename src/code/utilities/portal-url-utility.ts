import * as queryString from "query-string";

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

function isTeacherParams(params: StudentLaunchParams | TeacherReportParams): params is TeacherReportParams {
  return ((params as TeacherReportParams).offering !==  undefined);
}


function extractDomain(url:string) {
  const domainMatcher = /https?:\/\/([^\/]*)/i;
  const matches = url.match(domainMatcher);
  if(matches && matches.length > 0) {
    return matches[1].replace(/\./g,"_");
  }
  return "fake_domain";
}

export class PortalUrlUtility {
    params: StudentLaunchParams | TeacherReportParams;
    domain: string;
    classId: string;
    isTeacher: boolean;

    constructor() {
      const q = queryString;
      this.params = q.parse(window.location.search);
      this.isTeacher = isTeacherParams(this.params);
    }

    async getFirebaseKey():Promise<string> {
      if (this.isTeacher) {
        await this.extractTeacherInfo(this.params as TeacherReportParams);
      }
      else {
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
      this.domain  = extractDomain((this.params as TeacherReportParams).offering);
    }

}
