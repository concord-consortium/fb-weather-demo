import * as queryString from "query-string";
import { clone } from "lodash";

const domainJwtItemName = 'jwtDomain',
      teacherJwtItemName = 'jwtTeacher',
      studentJwtItemName = 'jwtStudent';

export interface StudentLaunchParams {
  domain: string;
  domain_uid: string;
  token: string;
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

function isTestingLaunchUrl() {
  return ((window.location.hostname.indexOf('localhost') >= 0) ||
          (window.location.hostname.indexOf('learn.staging') >= 0));
}

function isPortalStudentParams(params: UnionParams): params is StudentLaunchParams {
  return ((params as StudentLaunchParams).domain != null) && !isPortalTeacherParams(params);
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

export function getTeacherJwt() {
  const domain = sessionStorage.getItem(domainJwtItemName),
        token = sessionStorage.getItem(teacherJwtItemName);
  return domain && token ? { domain, token } : null;
}

export function setTeacherJwt(domainJwt: string | null, teacherJwt: string | null) {
  if (domainJwt && teacherJwt) {
    sessionStorage.setItem(domainJwtItemName, domainJwt);
    sessionStorage.setItem(teacherJwtItemName, teacherJwt);
    // can't have both student and teacher
    sessionStorage.removeItem(studentJwtItemName);
  }
  else {
    sessionStorage.removeItem(domainJwtItemName);
    sessionStorage.removeItem(teacherJwtItemName);
  }
}

export function getStudentJwt() {
  const domain = sessionStorage.getItem(domainJwtItemName),
        token = sessionStorage.getItem(studentJwtItemName);
  return domain && token ? { domain, token } : null;
}

export function setStudentJwt(domainJwt: string | null, studentJwt: string | null) {
  if (domainJwt && studentJwt) {
    sessionStorage.setItem(domainJwtItemName, domainJwt);
    sessionStorage.setItem(studentJwtItemName, studentJwt);
    // can't have both student and teacher
    sessionStorage.removeItem(teacherJwtItemName);
  }
  else {
    sessionStorage.removeItem(domainJwtItemName);
    sessionStorage.removeItem(studentJwtItemName);
  }
}

const params = queryString.parse(window.location.search),
      isPortalTeacher = isPortalTeacherParams(params) || !!getTeacherJwt(),
      isPortalStudent = !isPortalTeacher && isPortalStudentParams(params) || !!getStudentJwt(),
      isStudent = isPortalStudent || hasStudentTestingParam(params),
      isTeacher = !isStudent,
      // if `test` URL parameter is present, or if we're not launched from portal,
      // then we're testing, i.e. writing to `-test` database rather than production.
      isTesting = isTestingLaunchUrl() || hasTestTestingParam(params) ||
                    (!isPortalTeacher && !isPortalStudent);

export const urlParams = {
  params, isPortalTeacher, isPortalStudent, isTeacher, isStudent, isTesting
};

// Returns a modified URL query/search string after removing the specified params
export function removeUrlParams(paramsToRemove: string[]) {
  const newParams = clone(urlParams.params);
  paramsToRemove.forEach((param) => {
    if (newParams[param] != null) {
      delete newParams[param];
    }
  });
  const newParamsStr = queryString.stringify(newParams);
  return newParamsStr ? '?' + newParamsStr : '';
}
