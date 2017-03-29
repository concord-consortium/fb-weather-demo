import { Grid } from "./grid";

export class Frame {
  time: number
  data: any
  grids: { [key: string]: Grid }
}