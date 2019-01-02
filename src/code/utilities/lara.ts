const iframePhone = require("iframe-phone");
import * as jwt from 'jsonwebtoken';

let inIframe = false;
try {
  inIframe = window.self !== window.top;
}
catch (e) {}

export const launchedFromLara = inIframe;

interface LaraUserInfo {
  classHash: string;
  offeringId: string;
  firebaseJWT: string;
  isTeacher: boolean;
}
export const getLaraUserInfo = (portalAppName: string) => {
  return new Promise<LaraUserInfo>((resolve, reject) => {
    if (!launchedFromLara) {
      reject("In iframe but not launched from LARA!");
      return;
    }

    const laraPhone = iframePhone.getIFrameEndpoint();
    laraPhone.addListener("initInteractive", (options: any) => {
      if (options.mode === "runtime") {
        laraPhone.addListener("firebaseJWT", (result: any) => {
          if (result && result.token) {
            const token: any = jwt.decode(result.token);
            if (token) {
              const {class_hash, offering_id, user_type} = token.claims;
              resolve({
                classHash: class_hash,
                offeringId: "" + offering_id,
                firebaseJWT: result.token,
                isTeacher: user_type === "teacher"
              });
            }
          }
          else {
            reject("Unable to get firebase JWT from portal");
          }
        });
        laraPhone.post("getFirebaseJWT", {firebase_app: portalAppName});
      }
    });
    laraPhone.addListener("getInteractiveState", () => {
      laraPhone.post("interactiveState", "nochange");
    });
    laraPhone.initialize();
  });
};

