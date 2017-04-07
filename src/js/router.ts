import { dataStore } from "./data-store";
import * as QueryString from "query-string";


class Router {
  constructor(){
    this.parseHash();
    window.addEventListener("hashchange", this.parseHash.bind(this));
  }

  parseHash() {
    const qparams = QueryString.parse(location.hash);
    const nowShowing = qparams.show    || "choose";
    const session    = qparams.session;
    dataStore.setNowShowing(nowShowing);
    dataStore.setSession(session);
  }

  updateHashParam(key:string, value:string) {
    const qparams = QueryString.parse(location.hash);
    qparams[key]=value;
    const stringified = QueryString.stringify(qparams);
    location.hash = stringified;
  }

  componentWillUnmount(){
    dataStore.unregisterFirebase();
  }

  showStudent() {
    this.updateHashParam("show","student");
  }

  showTeacher() {
    this.updateHashParam("show","teacher");
  }

  showClassroom() {
    this.updateHashParam("show", "classroom");
  }
}
export const router = new Router();