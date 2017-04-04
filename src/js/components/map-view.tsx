import * as React from "react";

import { SimPrefs } from "../sim-prefs";
import { normalize} from "../normalize"
import { Grid } from "../grid"

export interface MapViewProps {
  width: number
  height: number
  grid?: Grid
  prefs: SimPrefs
}

export interface MapViewState { }
export  class MapView extends React.Component<MapViewProps, MapViewState> {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  drawLabel(ctx, x, y, width, text) {
    const halfSize = width/2;
    const color = "hsl(0,0%,100%)";
    ctx.fillStyle = color;
    ctx.font = "1em helvetica";
    ctx.textAlign="center";
    ctx.fillText(text, x + halfSize, y + halfSize);
  }

  drawRect(ctx, x, y, width, v) {
    const value = normalize(0,90,1,100, v);
    const size = width;
    const color = `hsla(0, 50%, ${value}%, 0.5)`;
    ctx.fillStyle = color;
    if(this.props.prefs.showTempColors) {
      ctx.fillRect(x*size, y*size, size, size);
    }
    if(this.props.prefs.showTempValues) {
      this.drawLabel(ctx, x*size, y*size, width,  v.toFixed(1));
    }
    if(this.props.prefs.showGridLines) {
      ctx.strokeRect(x*size, y*size, size, size);
      let chr = String.fromCharCode(97 + y);
      this.drawLabel(ctx, x*size, y*size, width, `${chr} ${x}`);
    }
  }

  updateCanvas() {
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d");
    const height = this.props.height;
    const width = this.props.width;
    const grid = this.props.grid || [];
    const numCols = grid.length;
    if(numCols <= 0) {
      return;
    }

    const numRows = grid[0].length;
    const gridWidth = Math.floor(width / numCols);
    const gridHeight = Math.floor(height / numRows);

    let x=0;
    let y=0;
    let predict = 0;

    if(ctx) {
      ctx.clearRect(0,0, width, height);
      for (y=0; y < numRows; y++) {
        for (x=0; x < numCols; x++) {
          predict = grid[y][x];
          this.drawRect(ctx, x, y, gridWidth, predict);
        }
      }
    }
  }

  renderBackground(stackedStyle) {
    if(this.props.prefs.showBaseMap){
      return(<img src="img/azores.jpg" style={stackedStyle} />);
    }
    return("");
  }

  render() {
    const height = this.props.height;
    const width = this.props.width;
    const stackedStyle = {
      position: "absolute",
      top: "0px",
      width: width,
      height: height
    };
    const containerStyle = {
      height: height,
    };
    return (
      <div className="NewMapView" style={containerStyle}>
        { this.renderBackground(stackedStyle) }
        <canvas ref="canvas" style={stackedStyle} width={width} height={height} className="test"/>
      </div>
    );
  }
}
