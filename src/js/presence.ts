export interface Presence {
  name:string
  online:boolean
  start:any
  gridX:number
  gridY:number
}
export interface PresenceMap {
  [key: string]: Presence
}
