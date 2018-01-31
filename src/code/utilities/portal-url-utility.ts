import { urlParams, StudentLaunchParams, TeacherReportParams } from "./url-params";
import { v4 as uuid } from "uuid";

export const defaultSimulationName = uuid(),
             defaultDomain = defaultSimulationName.substr(0, 18),
             defaultClass = defaultSimulationName.substr(19, 4),
             defaultOffering = defaultSimulationName.substr(24);

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
    offeringId: string;
    offeringUrl?: string;
    activityName?: string;
    activityUrl?: string;

    constructor() {
      this.domain = defaultDomain;
      this.classId = defaultClass;
      this.offeringId = defaultOffering;
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
      return `${this.domain}-${this.classId}-${this.offeringId}`;
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
