export interface Presence {
  name: string;
  online: boolean;
  start: any;
  basestationId: string;
}
export interface PresenceMap {
  [key: string]: Presence;
}
