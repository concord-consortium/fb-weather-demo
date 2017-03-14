import firebase from "firebase";

export default class FirebaseImp {
  constructor(firebaseKey) {
    this.user = null;
    this.token = null;
    this.refName = firebaseKey;
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
    this.setupPresence();
    this.registerFirebaseHandlers();
    this.log("logged in");
  }

  setDataRef(refString) {
    this.refName = refString;
    this.dataRef = firebase.database().ref(this.refName);
  }

  setupPresence() {
    this.amOnline = firebase.database().ref(".info/connected");
    this.uuid = Math.floor(Math.random() * 10000);
    this.userRef = firebase.database().ref(`${this.refName}/presence/${this.uuid}`);
    const userRef = this.userRef;
    const log = this.log.bind(this);
    const uuid = this.uuid;
    const updateUserData = this.updateUserData.bind(this);
    this.amOnline.on("value", function(snapshot) {
      log("online -- ");
      updateUserData({
        oneline: true,
        uuid: uuid,
        name: "testing"
      });
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
      }
    });
  }

  updateUserData(data) {
    this.userRef.update(data);
  }

  registerFirebaseHandlers () {
    this.log("registering listeners");
    const ref = this.dataRef;
    const setData = this.setData.bind(this);
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

  // TBD: For now we expect to set the entire state.
  update(data) {
    console.log(data);
    if(this.dataRef && this.dataRef.update){
      this.dataRef.update(data);
    }
  }

  // tell our listening componets about the state of the world
  setData(data) {
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