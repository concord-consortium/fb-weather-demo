export interface Presence {
  name:string
  online:boolean
  start:any
  baseStationId:string
}
export interface PresenceMap {
  [key: string]: Presence
}
