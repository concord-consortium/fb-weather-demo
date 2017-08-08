const firebase = require("firebase");
const _ = require("lodash");

import { v1 as uuid } from "uuid";

const DEFAULT_SESSION = "default";
const DEFAULT_VERSION_STRING = "1.2.wip2";
const DEFAULT_ACTIVITY = "default";

interface FirebaseUser {
  displayName: string;
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

interface FirebaseData {
  val(): any;
  key: any;
  forEach: Function;
}
interface FirebaseDisconnectSerivce {
  remove(): void;
}

interface FirebaseRef {
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
  _session: string;
  _activity: string;
  sessionID: string;
  user: FirebaseUser;
  version: string;
  listeners: FirebaseListener[];
  sessionNames: string[];
  config: FireBaseConfig;
  connectionStatus: FirebaseRef;
  baseRef: FirebaseRef;
  sessionsListRef: FirebaseRef;
  dataRef: FirebaseRef;
  pendingCallbacks: Function[];

  constructor() {
    this._session = `${DEFAULT_SESSION}`;
    this.activity = DEFAULT_ACTIVITY;
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

    this.initFirebase(() => {
      // TBD: notify that Firebase is ready
    });
  }

  log(msg: string) {
    console.log(msg);
  }

  error(err: string) {
    console.error(err);
  }

  initFirebase(callback: Function) {
    firebase.initializeApp(this.config);
    const finishAuth = this.finishAuth.bind(this);
    const reqAuth = this.reqAuth.bind(this);
    const log = this.log.bind(this);
    let auth = firebase.auth();
    auth.onAuthStateChanged(function(user: FirebaseUser) {
      if (user) {
        log(user.displayName + " authenticated");
        finishAuth({ result: { user: user } });
        callback();
      } else {
        reqAuth();
      }
    });
  }

  reqAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
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
    this.setSessionsListRef();
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

  get sessionsListPath() {
    return `${this.basePath}/session_list`;
  }

  getNamedSessionPath(name: string): string {
    const basePath = DEFAULT_VERSION_STRING.replace(/\./g, "_");
    return `/${this.basePath}/sessions/${name}`;
  }
  get sessionPath(): string {
    return this.getNamedSessionPath(this.session);
  }

  setSessionsListRef() {
    if (firebase.database()) {
      this.sessionsListRef = firebase.database().ref(this.sessionsListPath);
      this.sessionsListRef.on(
        "value",
        function(data: any) {
          this.sessionNames = _.map(data.val(), "name");
          for (let listener of this.listeners) {
            listener.setSessionList(this.sessionNames);
          }
        }.bind(this)
      );
    }
  }

  setDataRef() {
    const fn = function() {
      this.rebindFirebaseHandlers();
    };
    this.try(fn);
  }

  try(fn: Function) {
    if (firebase.database() && this.sessionsListRef) {
      fn.bind(this)();
    } else {
      this.pendingCallbacks.push(fn);
    }
  }

  set session(sessionName: string) {
    const fn = function() {
      const self: FirebaseImp = this;
      this.sessionsListRef.once("value").then(function(data: FirebaseData) {
        const sessionNames = _.map(data.val(), "name");
        if (!_.includes(sessionNames, sessionName)) {
          self.sessionsListRef.push({ name: sessionName });
        }
        self._session = sessionName;
        self.setDataRef();
        for (let listener of self.listeners) {
          listener.setSessionPath(self._session);
        }
        self.log(`
          =========================================
          CHANGED SESSION TO :  ${sessionName}
          =========================================
        `);
      });
    };
    fn.bind(this);
    this.try(fn);
  }

  get session() {
    return this._session;
  }

  get database() {
    return firebase.database();
  }

  set activity(activityName: string) {
    this._activity = activityName;
  }

  get activity() {
    return this._activity;
  }

  load() {
    this.dataRef.once("value").then(this.loadDataFromFirebase.bind(this));
  }

  rebindFirebaseHandlers() {
    this.log("registering listeners");
    // Unbind old listening:
    if (this.dataRef) {
      try {
        this.dataRef.off();
      } catch (e) {
        this.log("couldn't disable previous data handler");
      }
    }
    this.dataRef = firebase.database().ref(this.sessionPath);
    // this.load();
    const setData = this.loadDataFromFirebase.bind(this);
    const log = this.log.bind(this);
    this.dataRef.on("value", setData);

    // TBD: Best way to listen to events with better granularity.
    this.dataRef.on("child_changed", function(data: any) {
      log("child_changed:" + data);
    });
    this.dataRef.on("child_added", function(data: any) {
      log("child added: " + data);
    });
    this.dataRef.on("child_removed", function(data: any) {
      log("child removed: " + data);
    });
  }

  addListener(listener: FirebaseListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: FirebaseListener) {
    const oldListeners = this.listeners;
    this.listeners = oldListeners.filter(el => el !== listener);
  }

  saveToFirebase(data: any) {
    if (this.dataRef && this.dataRef.update) {
      this.dataRef.update(data);
    }
  }

  refForPath(path:string) {
    if (this.dataRef && this.dataRef.child) {
      return this.dataRef.child(path);
    }
    return null;
  }

  saveToRelativePath(data:any, path:string) {
    const ref = this.refForPath(path);
    if(ref) {
       ref.update(data);
    }
  }

  loadDataFromFirebase(data: FirebaseData) {
    const dataV = data.val();
    if (dataV) {
      this.log(dataV);
      for (let listener of this.listeners) {
        listener.setState(dataV);
      }
     }
  }

  copySession(oldName: string, newName: string) {
    const oldRef = firebase.database().ref(this.getNamedSessionPath(oldName));
    const newRef = firebase.database().ref(this.getNamedSessionPath(newName));
    oldRef.once("value").then(function(snap: FirebaseData) {
      const value = snap.val();
      value.presence = {}; // ugly but we need to remove presense data...
      newRef.set(value);
    });
    this.sessionsListRef.push({ name: newName });
  }

  removeSession(oldName: string) {
    const oldRef = firebase.database().ref(oldName);
    const sessionsListRef = this.sessionsListRef;
    sessionsListRef.once("value").then(function(snap: FirebaseData) {
      const sessionNames = snap.val();
      snap.forEach(function(childSnap: FirebaseData) {
        const key = childSnap.key;
        const name = childSnap.val().name;
        if (name === oldName) {
          sessionsListRef.child(key).remove();
          oldRef.remove();
        }
      });
    });
  }
}

export const gFirebase = new FirebaseImp();
