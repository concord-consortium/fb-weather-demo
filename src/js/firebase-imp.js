import firebase from "firebase";
import { v1 as uuid } from "uuid";

const DEFAULT_SESSION = "default";
const DEFAULT_VERSION_STRING = "1.0.0";
const DEFAULT_ACTIVITY = "default";

export class FirebaseImp {
  constructor(session) {
    this.user = null;
    this.token = null;
    this.session  = session || DEFAULT_SESSION;
    this.activity = DEFAULT_ACTIVITY;
    this.version  = DEFAULT_VERSION_STRING;

    this.config = {
      apiKey: "AIzaSyAlgebbG2k820uai5qZT6T8yMONvuSl-wI",
      authDomain: "weather-dev-eae1d.firebaseapp.com",
      databaseURL: "https://weather-dev-eae1d.firebaseio.com",
      storageBucket: "weather-dev-eae1d.appspot.com",
      messagingSenderId: "857031925472"
    };
    this.listeners = [];
    this.initFirebase();
  }

  log(msg){
    console.log(msg);
  }

  error(err) {
    console.error(err);
  }

  reqAuth() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider)
    .then(this.finishAuth.bind(this))
    .catch(this.failAuth.bind(this));
  }

  failAuth(error) {
    var errorMessage = error.message;
    const email = error.email;
    this.error(["could not authenticate", errorMessage, email].join(" "));
  }

  finishAuth(result) {
    this.user = result.user;
    this.setDataRef(this.refName);
    this.rebindFirebaseHandlers();
    this.log("logged in");
  }

  setDataRef() {
    this.refName = `${this.session}`;
    if(firebase.database()) {
      this.dataRef = firebase.database().ref(this.refName);
      this.rebindFirebaseHandlers();
      this.setupPresence();
    }
  }

  set session(sessionName) {
    this._session = sessionName;
    // this.setDataRef();
  }

  get session() {
    return this._session;
  }

  set activity(activityName) {
    this._activity = activityName;
    // this.setDataRef();
  }

  get activity() {
    return this._activity;
  }


  setupPresence() {
    // Remove old user listening:
    if(this.amOnline) { this.amOnline.off(); }
    if(this.userRef)  {
      this.userRef.off();
      this.userRef.remove();
    }

    this.amOnline = firebase.database().ref(".info/connected");
    this.uuid = localStorage.getItem("CCweatherSession") || uuid();
    localStorage.setItem("CCweatherSession", this.uuid);

    this.userRef = firebase.database().ref(`${this.refName}/presence/${this.uuid}`);

    const userRef = this.userRef;
    const log = this.log.bind(this);
    const updateUserData = this.saveUserData.bind(this);
    this.amOnline.on("value", function(snapshot) {
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
    ref.on("child_changed", function(data){ log("child_changed:" + data);});
    ref.on("child_added", function(data)  { log("child added: " + data); });
    ref.on("child_removed", function(data){ log("child removed: " + data);});
  }

  addListener(component) {
    this.listeners.push(component);
  }

  removeListener(component) {
    const oldListeners = this.listeners;
    this.listeners = oldListeners.filter((el) => el !== component);
  }

  saveToFirebase(data) {
    if(this.dataRef && this.dataRef.update){
      this.dataRef.update(data);
    }
  }

  saveUserData(data) {
    if(this.userRef && this.userRef.update){
      this.userRef.update(data);
    }
  }

  loadDataFromFirebase(data) {
    const dataV = data.val();
    console.log(dataV);
    for(let listener of this.listeners) {
      listener.setState(dataV);
    }
  }

  initFirebase() {
    firebase.initializeApp(this.config);
    const finishAuth = this.finishAuth.bind(this);
    const reqAuth    = this.reqAuth.bind(this);
    const log        = this.log.bind(this);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        log(user.displayName + " authenticated");
        finishAuth({result: {user: user}});
      } else {
        reqAuth();
      }
    });
  }

}