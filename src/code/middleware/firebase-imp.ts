import * as firebase from "firebase";
import { gPortalUrlUtility } from "../utilities/portal-url-utility";

const DEFAULT_SIMULATION = "default";
const DEFAULT_VERSION_STRING = "1.4.0";

interface FirebaseListener {
  setState(state: any): void;
  setSessionPath(name: string): void;
  setSessionList(sessions: string[]): void;
}

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId?: string;
  storageBucket: string;
  messagingSenderId: string;
}
interface FirebaseConfigMap {
  dev: FirebaseConfig;
  staging: FirebaseConfig;
  production: FirebaseConfig;
}

interface AppLocation {
  hostname: string;
  pathname: string;
  search: string;
}

export interface FirebaseImpOptions {
  location: AppLocation;
  initFirebase: boolean;
  persistSession: boolean;
  logConfigChoice: boolean;
}

export class FirebaseImp {
  simulationID: string;
  user: firebase.User | null;
  version: string;
  listeners: FirebaseListener[];
  simulationMap: [{key:string, value:any}];
  config: FirebaseConfig;
  configs: FirebaseConfigMap;
  dataRef: firebase.database.Reference;
  simulationsRef: firebase.database.Reference;
  pendingCallbacks: Function[];
  postConnect: Promise<FirebaseImp>;
  isSignedOut: boolean;
  options: FirebaseImpOptions;

  constructor(options: FirebaseImpOptions) {
    this.options = options;
    this.simulationID = `${DEFAULT_SIMULATION}`;
    this.version = DEFAULT_VERSION_STRING;
    this.user = null;
    this.isSignedOut = false;
    this.pendingCallbacks = [];
    this.configs = {
      dev: {
        apiKey: "AIzaSyAlgebbG2k820uai5qZT6T8yMONvuSl-wI",
        authDomain: "weather-dev-eae1d.firebaseapp.com",
        databaseURL: "https://weather-dev-eae1d.firebaseio.com",
        projectId: "weather-dev-eae1d",
        storageBucket: "weather-dev-eae1d.appspot.com",
        messagingSenderId: "857031925472"
      },
      staging: {
        apiKey: "AIzaSyDRSQsaFvE6p5N6qHreRKpGMR2J04iKQDc",
        authDomain: "weather-staging-a85f9.firebaseapp.com",
        databaseURL: "https://weather-staging-a85f9.firebaseio.com",
        projectId: "weather-staging-a85f9",
        storageBucket: "weather-staging-a85f9.appspot.com",
        messagingSenderId: "1048466787110"
      },
      production: {
        apiKey: "AIzaSyAglPFMReyiX9r33RDLkWkBNAMGUKdY9os",
        authDomain: "weather-1892e.firebaseapp.com",
        databaseURL: "https://weather-1892e.firebaseio.com",
        projectId: "weather-1892e",
        storageBucket: "weather-1892e.appspot.com",
        messagingSenderId: "74648732809"
      }
    };

    const {hostname, pathname} = options.location;
    const isLocalhost = !!hostname.match(/localhost|127\.0\.0\.1/);
    const isBranchOrVersion = !!pathname.match(/branch|version/);

    this.config = isLocalhost ? this.configs.dev : (isBranchOrVersion ? this.configs.staging : this.configs.production);
    if (options.logConfigChoice) {
      console.log(`Using ${this.config.projectId} project`);
    }
    this.listeners = [];
    if (options.initFirebase) {
      this.initFirebase();
    }
  }

  get portalAppName() {
    const isDev = this.config === this.configs.dev;
    const isStaging = this.config === this.configs.staging;
    return `pc-weather${isDev ? "-dev" : (isStaging ? "-staging" : "")}`;
  }

  log(msg: string) {
    console.log(msg);
  }

  error(err: string) {
    console.error(err);
  }

  initFirebase() {
    firebase.initializeApp(this.config);
    let auth = firebase.auth();
    const imp = this;
    this.postConnect = new Promise((resolve, reject) => {
      auth.signOut()
        .then(() => {
          auth.onAuthStateChanged((user: firebase.User | null) => {
            if (this.isSignedOut) {
              this.user = null;
              this.dataRef.off();
            }
            else if (user) {
              this.log(user.displayName + " authenticated");
              this.finishAuth({ user: user } );
              resolve(imp);
            }
            else {
              this.reqAuth(reject);
            }
          });
        })
        .catch(reject);
    });
  }

  reqAuth(reject: (reason: any) => void) {
    const auth = firebase.auth();
    const signin = () => {
      gPortalUrlUtility.getFirebaseSettings(this.portalAppName).then(({jwt}) => {
        if (jwt) {
          auth
          .signInWithCustomToken(jwt)
          .then(this.finishAuth)
          .catch(this.failAuth(reject));
        }
        else {
          auth
          .signInAnonymously()
          .then(this.finishAuth)
          .catch(this.failAuth(reject));
        }
      })
      .catch(reject);
    };

    // Use Firebase's session persistence so that if a student launches multiple tabs,
    // they will operate independently rather than interfering with each other.
    // cf. https://firebase.google.com/docs/auth/web/auth-state-persistence
    if (this.options.persistSession) {
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(signin);
    }
    else {
      signin();
    }
  }

  failAuth = (reject: (reason: any) => void) => {
    return (error: firebase.auth.Error) => {
      const errorMessage = error.message;
      const email = (error as any).email || ""; // only some errors have email
      this.error(["could not authenticate", errorMessage, email].join(" "));
      reject(errorMessage);
    };
  }

  finishAuth = (result: { user: firebase.User }) => {
    this.user = result.user;
    this.setDataRef();
    this.log("logged in");
    let callback: Function;
    const context = this;
    for (callback of this.pendingCallbacks) {
      callback.bind(context)();
    }
    this.pendingCallbacks=[];
  }

  signOut() {
    if (!this.isSignedOut || this.user) {
      this.isSignedOut = true;
      // sign out the current user (de-authenticate)
      firebase.auth().signOut();
      // disconnect from the firebase server (and prevent automatic reconnect)
      firebase.database().goOffline();
    }
  }

  get basePath() {
    return DEFAULT_VERSION_STRING.replace(/\./g, "_");
  }

  setDataRef() {
    const fn = function() {
      this.rebindFirebaseHandlers();
    };
    this.try(fn);
  }

  rebindFirebaseHandlers() {
    this.log("registering listeners");
    if (this.dataRef) {
      try {
        this.dataRef.off();
      } catch (e) {
        this.log("couldn't disable previous data handler");
      }
    }
    this.dataRef = firebase.database().ref(this.basePath);
  }

  try(fn: Function) {
    if (firebase.database()) {
      fn.bind(this)();
    } else {
      this.pendingCallbacks.push(fn);
    }
  }

  get database() {
    return firebase.database();
  }

  refForPath(path:string) {
    return new Promise<firebase.database.Reference>( (resolve, reject) => {
      this.postConnect.then( (imp) => {
        resolve(imp.dataRef.child(path.replace(/_/g, "/")));
      });
    });
  }

  waitForPathToExist(path: string, callback: (snapshot: any) => void) {
    gFirebase.refForPath(path)
      .then((ref:firebase.database.Reference) => {
        const handleSnapshot = (snapshot: firebase.database.DataSnapshot | null) => {
          if (snapshot && snapshot.val()) {
            // remove handler once path exists
            ref.off('value', handleSnapshot);
            // let caller know that the path exists
            callback(snapshot.val());
          }
        };
        // attach handler for detecting path existence
        ref.on('value', handleSnapshot);
      });
  }
}

// check for options when running tests
const jestOptions = (window as any).jestOptions;
const initFirebase = !jestOptions || jestOptions.initFirebase;
const persistSession = !jestOptions || jestOptions.persistSession;
const logConfigChoice = !jestOptions || jestOptions.logConfigChoice;

export const gFirebase = new FirebaseImp({location: window.location, initFirebase, persistSession, logConfigChoice});
