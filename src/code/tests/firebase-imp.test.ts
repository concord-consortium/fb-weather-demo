// mock sessionStorage for url-params used by firebase-imp
(window as any).sessionStorage = {
  getItem: (key: string) => undefined,
  setItem: (key: string, value: string) => undefined,
  removeItem: (key: string) => undefined,
};

// set options to pass to singleton created at bottom of firebase-imp
(window as any).jestOptions = {
  initFirebase: false,
  persistSession: false,
  logConfigChoice: false
};

import { FirebaseImp, FirebaseImpOptions } from "../middleware/firebase-imp";

describe("Firebase implementation", () => {
  let options: FirebaseImpOptions;
  let fbImp: FirebaseImp;

  beforeEach(() => {
    options = {
      location: {hostname: "overridden", pathname: "overridden"},
      initFirebase: false,
      persistSession: false,
      logConfigChoice: false
    };
  });

  test("should use dev config for localhost", () => {
    options.location = {hostname: "localhost", pathname: "/"};
    fbImp = new FirebaseImp(options);
    expect(fbImp.config).toBe(fbImp.configs.dev);
  });

  test("should use dev config for 127.0.0.1", () => {
    options.location = {hostname: "127.0.0.1", pathname: "/"};
    fbImp = new FirebaseImp(options);
    expect(fbImp.config).toBe(fbImp.configs.dev);
  });

  test("should use staging config for published branches", () => {
    options.location = {hostname: "weather.concord.org", pathname: "/branch/foo"};
    fbImp = new FirebaseImp(options);
    expect(fbImp.config).toBe(fbImp.configs.staging);
  });

  test("should use staging config for published versions", () => {
    options.location = {hostname: "weather.concord.org", pathname: "/version/1.2.3"};
    fbImp = new FirebaseImp(options);
    expect(fbImp.config).toBe(fbImp.configs.staging);
  });

  test("should use production config for production version", () => {
    options.location = {hostname: "weather.concord.org", pathname: "/"};
    fbImp = new FirebaseImp(options);
    expect(fbImp.config).toBe(fbImp.configs.production);
  });

});

