import * as firebase from "firebase";

const DEFAULT_SIMULATION = "default";
const DEFAULT_VERSION_STRING = "1.3.0-pre5";

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

export class FirebaseImp {
  simulationID: string;
  user: firebase.User;
  version: string;
  listeners: FirebaseListener[];
  simulationMap: [{key:string, value:any}];
  config: FirebaseConfig;
  dataRef: firebase.database.Reference;
  simulationsRef: firebase.database.Reference;
  pendingCallbacks: Function[];
  postConnect: Promise<FirebaseImp>;

  constructor() {
    this.simulationID = `${DEFAULT_SIMULATION}`;
    this.version = DEFAULT_VERSION_STRING;
    this.pendingCallbacks = [];
    const configs: { [index: string]: FirebaseConfig } = {
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
      auth.onAuthStateChanged(function(user: firebase.User | null) {
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

  failAuth(error: firebase.auth.Error) {
    const errorMessage = error.message;
    const email = (error as any).email || ""; // only some errors have email
    this.error(["could not authenticate", errorMessage, email].join(" "));
  }

  finishAuth(result: { user: firebase.User }) {
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
