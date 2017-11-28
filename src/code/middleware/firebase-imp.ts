const firebase = require("firebase");
import { Promise } from "es6-promise";

const DEFAULT_SIMULATION = "default";
const DEFAULT_VERSION_STRING = "1.3.0-pre1";

interface FirebaseUser {
  displayName: string;
  uid: string;
}
interface FirebaseError {
  message: string;
  email: string;
}

interface FirebaseListener {
  setState(state: any): void;
  setSessionPath(name: string): void;
  setSessionList(sessions: string[]): void;
}

export interface FirebaseData {
  val(): any;
  key: any;
  forEach: Function;
}

interface FirebaseDisconnectSerivce {
  remove(onComplete?: ()=> void): void;
  update(values:any, anyonComplete?: ()=> void): void;
}

export interface FirebaseRef {
  off(event: string): void;
  off(): void;
  once(value: string): Promise<any>;
  push(value: any): void;
  on(event: string, callback: Function): void;
  onDisconnect(): FirebaseDisconnectSerivce;
  remove(): void;
  update(data: any): void;
  remove(key: string): void;
  child(path: string): FirebaseRef;
}

interface FireBaseConfig {
  [key: string]: string;
}

export class FirebaseImp {
  simulationID: string;
  user: FirebaseUser;
  version: string;
  listeners: FirebaseListener[];
  simulationMap: [{key:string, value:any}];
  config: FireBaseConfig;
  dataRef: FirebaseRef;
  simulationsRef: FirebaseRef;
  pendingCallbacks: Function[];
  postConnect: Promise<FirebaseImp>;

  constructor() {
    this.simulationID = `${DEFAULT_SIMULATION}`;
    this.version = DEFAULT_VERSION_STRING;
    this.pendingCallbacks = [];
    const configs = {
      old: {
        apiKey: "AIzaSyAlgebbG2k820uai5qZT6T8yMONvuSl-wI",
        authDomain: "weather-dev-eae1d.firebaseapp.com",
        databaseURL: "https://weather-dev-eae1d.firebaseio.com",
        storageBucket: "weather-dev-eae1d.appspot.com",
        messagingSenderId: "857031925472"
      },
      new: {
        apiKey: "AIzaSyAglPFMReyiX9r33RDLkWkBNAMGUKdY9os",
        authDomain: "weather-1892e.firebaseapp.com",
        databaseURL: "https://weather-1892e.firebaseio.com",
        projectId: "weather-1892e",
        storageBucket: "weather-1892e.appspot.com",
        messagingSenderId: "74648732809"
      }
    };
    this.config = configs.new;
    this.listeners = [];
    this.initFirebase();
  }

  log(msg: string) {
    console.log(msg);
  }

  error(err: string) {
    console.error(err);
  }

  initFirebase() {
    firebase.initializeApp(this.config);
    const finishAuth = this.finishAuth.bind(this);
    const reqAuth = this.reqAuth.bind(this);
    const log = this.log.bind(this);
    let auth = firebase.auth();
    const imp = this;
    this.postConnect = new Promise(function(resolve:Function, reject:Function) {
      auth.onAuthStateChanged(function(user: FirebaseUser) {
        if (user) {
          log(user.displayName + " authenticated");
          finishAuth({ user: user } );
          resolve(imp);
        } else {
          reqAuth();
        }
      });
    });
  }

  reqAuth() {
    // const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      //.signInWithRedirect(provider)
      .signInAnonymously()
      .then(this.finishAuth.bind(this))
      .catch(this.failAuth.bind(this));
  }

  failAuth(error: FirebaseError) {
    const errorMessage = error.message;
    const email = error.email;
    this.error(["could not authenticate", errorMessage, email].join(" "));
  }

  finishAuth(result: { user: FirebaseUser }) {
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
    return new Promise( (resolve, reject) => {
      this.postConnect.then( (imp) => {
        resolve(imp.dataRef.child(path));
      });
    });
  }

}

export const gFirebase = new FirebaseImp();
