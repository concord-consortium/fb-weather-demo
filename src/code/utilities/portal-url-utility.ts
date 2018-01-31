import { urlParams, StudentLaunchParams, TeacherReportParams } from "./url-params";
import { v4 as uuid } from "uuid";

export const kDefaultSimulationName = uuid(),
             kDefaultDomain = kDefaultSimulationName.substr(0, 23),
             kDefaultClass = kDefaultSimulationName.substr(25);

function extractDomain(url:string) {
  const domainMatcher = /https?:\/\/([^\/]*)/i;
  const matches = url.match(domainMatcher);
  if(matches && matches.length > 0) {
    return matches[1].replace(/\./g,"_");
  }
  return "no_domain";
}

export class PortalUrlUtility {
    domain: string;
    classId: string;

    constructor() {
      this.domain = kDefaultDomain;
      this.classId = kDefaultClass;
    }

    get isTeacher() {
      return urlParams.isTeacher;
    }

    async getFirebaseKey():Promise<string> {
      if (urlParams.isPortalTeacher) {
        await this.extractTeacherInfo(urlParams.params as TeacherReportParams);
      }
      else if (urlParams.isPortalStudent) {
        await this.extractStudentInfo(urlParams.params as StudentLaunchParams);
      }
      return `${this.domain}-${this.classId}`;
    }

    async extractStudentInfo(params: StudentLaunchParams) {
      this.classId = params.class_info_url && params.class_info_url.split("/").pop() || "no_class";
      this.domain = extractDomain(params.domain);
    }

    async extractTeacherInfo(params: TeacherReportParams) {
      const authorizationHeader = `Bearer ${params.token}`;
      const headers = ({headers: {Authorization: authorizationHeader}});
      const response = await fetch(params.offering, headers);
      const reportData = await response.json();
      this.classId = `${reportData[0].clazz_id}`;
      this.domain = extractDomain((urlParams.params as TeacherReportParams).offering);
    }
}
