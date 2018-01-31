import * as queryString from "query-string";

export interface StudentLaunchParams {
  domain: string;
  class_info_url: string;
  domain_uid: string;
  externalId: string;
  logging: boolean;
  returnUrl: string;
}

export interface TeacherReportParams {
  offering: string;
  token: string;
}

interface TestingParams {
  student?: boolean | null;
  test?: boolean | null;
}

type UnionParams = StudentLaunchParams | TeacherReportParams | TestingParams;

function isPortalStudentParams(params: UnionParams): params is StudentLaunchParams {
  return ((params as StudentLaunchParams).class_info_url != null);
}

function isPortalTeacherParams(params: UnionParams): params is TeacherReportParams {
  return ((params as TeacherReportParams).offering != null);
}

// passing 'student' URL parameter indicates student -- for testing/debugging
function hasStudentTestingParam(params: UnionParams): params is TestingParams {
  return ((params as TestingParams).student !== undefined);
}

function hasTestTestingParam(params: UnionParams): params is TestingParams {
  return ((params as TestingParams).test !== undefined);
}

const params = queryString.parse(window.location.search),
      isPortalTeacher = isPortalTeacherParams(params),
      isPortalStudent = !isPortalTeacher && isPortalStudentParams(params),
      isStudent = isPortalStudent || hasStudentTestingParam(params),
      isTeacher = !isStudent,
      // if `test` URL parameter is present, or if we're not launched from portal,
      // then we're testing, i.e. writing to `-test` database rather than production.
      isTesting = hasTestTestingParam(params) || (!isPortalTeacher && !isPortalStudent);

export const urlParams = {
  params, isPortalTeacher, isPortalStudent, isTeacher, isStudent, isTesting
};

