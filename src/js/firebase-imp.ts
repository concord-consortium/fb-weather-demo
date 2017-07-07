const firebase = require("firebase");
import { v1 as uuid } from "uuid";
import { Presence } from "./presence"
const DEFAULT_SESSION = "default";
const DEFAULT_VERSION_STRING = "1.1.0";
const DEFAULT_ACTIVITY = "default";

interface FirebaseUser {
  displayName:string
}
interface FirebaseError {
  message: string
  email: string
}

interface FirebaseLinstener {
  setState(state:any):void
}

interface FirebaseData {
  val():any
}
interface FirebaseDisconnectSerivce {
  remove():void
}

interface FirebaseRef {
  off(event:string):void
  off():void
  once(value:string):Promise<any>
  on(event:string, callback:Function):void
  onDisconnect():FirebaseDisconnectSerivce
  remove():void
  update(data:any):void
}

interface FireBaseConfig {
  [key:string]: string
}

export class FirebaseImp {
  _session:string
  _activity:string
  sessionID: string
  user: FirebaseUser
  version: string
  listeners:FirebaseLinstener[]
  config: FireBaseConfig
  connectionStatus: FirebaseRef
  baseRef: FirebaseRef
  sessionsRef: FirebaseRef
  dataRef: FirebaseRef
  userRef: FirebaseRef

  constructor() {
    this._session = `${DEFAULT_SESSION}`;
    this.activity = DEFAULT_ACTIVITY;
    this.version  = DEFAULT_VERSION_STRING;

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
    }
    this.config = configs.new;
    this.listeners = [];
    this.sessionID = localStorage.getItem("CCweatherSession") || uuid();
    localStorage.setItem("CCweatherSession", this.sessionID);
  }

  log(msg:string){
    console.log(msg);
  }

  error(err:string) {
    console.error(err);
  }

  initFirebase(callback:Function) {
    firebase.initializeApp(this.config);
    const finishAuth = this.finishAuth.bind(this);
    const reqAuth    = this.reqAuth.bind(this);
    const log        = this.log.bind(this);
    let auth = firebase.auth();
    auth.onAuthStateChanged(function(user:FirebaseUser) {
      if (user) {
        log(user.displayName + " authenticated");
        finishAuth({result: {user: user}});
        callback();
      } else {
        reqAuth();
      }
    });
  }

  reqAuth() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider)
    .then(this.finishAuth.bind(this))
    .catch(this.failAuth.bind(this));
  }

  failAuth(error:FirebaseError) {
    var errorMessage = error.message;
    const email = error.email;
    this.error(["could not authenticate", errorMessage, email].join(" "));
  }

  finishAuth(result:{user:FirebaseUser}) {
    this.user = result.user;
    this.setDataRef();
    this.log("logged in");
  }

  get sessionPath() {
    const basePath = DEFAULT_VERSION_STRING.replace(/\./g, "_");
    return `/${basePath}/sessions/${this.session}`;
  }

  setDataRef() {
    if(firebase.database()) {
      this.dataRef = firebase.database().ref(this.sessionPath);
      this.rebindFirebaseHandlers();
      this.setupPresence();
    }
  }

  set session(sessionName:string) {
    this._session = sessionName;
    this.setDataRef();
    debugger
  }

  get session() {
    return this._session;
  }

  get database() {
    return firebase.database()
  }

  set activity(activityName:string) {
    this._activity = activityName;
  }

  get activity() {
    return this._activity;
  }

  setupPresence() {
    // Remove old user listening:
    if(this.connectionStatus) { this.connectionStatus.off(); }
    if(this.userRef)  {
      this.userRef.off();
      this.userRef.remove();
    }

    this.connectionStatus = firebase.database().ref(".info/connected");
    this.userRef = firebase.database().ref(`${this.session}/presence/${this.sessionID}`);

    const userRef = this.userRef;
    const log = this.log.bind(this);
    const updateUserData = this.saveUserData.bind(this);
    this.connectionStatus.on("value", function(snapshot:any) {
      log("online -- ");
      updateUserData({
        oneline: true,
        start: new Date(),
        name: "(no name)"
      });
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
      }
    });
  }

  load() {
    this.dataRef.once("value").then(this.loadDataFromFirebase.bind(this))
  }
  rebindFirebaseHandlers () {
    this.log("registering listeners");
    const ref = this.dataRef;
    // Unbind old listening:
    if(ref) {
      try {
        ref.off();
      }
      catch(e) {
        this.log("couldn't disable previous data handler");
      }
    }

    const setData = this.loadDataFromFirebase.bind(this);
    const log = this.log.bind(this);
    ref.on("value", setData);

    // TBD: Best way to listen to events with better granularity.
    ref.on("child_changed", function(data:any){ log("child_changed:" + data);});
    ref.on("child_added", function(data:any)  { log("child added: " + data); });
    ref.on("child_removed", function(data:any){ log("child removed: " + data);});
  }

  addListener(listener:FirebaseLinstener) {
    this.listeners.push(listener);
  }

  removeListener(listener:FirebaseLinstener) {
    const oldListeners = this.listeners;
    this.listeners = oldListeners.filter((el) => el !== listener);
  }

  saveToFirebase(data:any) {
    if(this.dataRef && this.dataRef.update){
      this.dataRef.update(data);
    }
  }

  saveUserData(data:Presence) {
    if(this.userRef && this.userRef.update){
      this.userRef.update(data);
    }
  }

  loadDataFromFirebase(data:FirebaseData) {
    const dataV = data.val();
    console.log(dataV);
    for(let listener of this.listeners) {
      listener.setState(dataV);
    }
  }



}