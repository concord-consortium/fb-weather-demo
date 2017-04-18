import * as React from "react";
import {observer} from 'mobx-react';
import { SimPrefs } from "../sim-prefs";
import { normalize} from "../normalize"
import { Grid } from "../grid"
import { dataStore } from "../data-store";
import { Prediction } from "../data-store";
const _ = require("lodash");

export interface MapViewProps {
  width: number
  height: number
  grid?: Grid
}

export interface MapViewState { }

@observer
export  class MapView extends React.Component<MapViewProps, MapViewState> {

  constructor(props:MapViewProps){
    super(props);
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  drawLabel(ctx:any, x:number, y:number, width:number, text:string) {
    const halfSize = width/2;
    const color = "hsl(0,0%,100%)";
    ctx.fillStyle = color;
    ctx.font = "1em helvetica";
    ctx.textAlign="center";
    ctx.fillText(text, x + halfSize, y + halfSize);
  }

  drawRect(ctx:any, x:number, y:number, width:number, _value:number) {
    const value = normalize(0,90,1,100, _value);
    const size = width;
    const color = `hsla(0, 50%, ${value}%, 0.5)`;
    const predictions = dataStore.filteredPredictions;

    ctx.fillStyle = color;
    if(dataStore.prefs.showTempColors) {
      ctx.fillRect(x*size, y*size, size, size);
    }
    if(dataStore.prefs.showTempValues) {
      this.drawLabel(ctx, x*size, y*size, width,  value.toFixed(1));
    }
    if(dataStore.prefs.showGridLines) {
      ctx.strokeRect(x*size, y*size, size, size);
      let chr = String.fromCharCode(97 + y);
      this.drawLabel(ctx, x*size, y*size, width, `${chr} ${x}`);
    }
    if(dataStore.prefs.showPredictions) {
      _.map(dataStore.filteredPredictions, (p:Prediction) => {
        if(x === p.gridX && y == p.gridY) {
          this.drawLabel(ctx, x*size, y*size, width,  (p.temp||0).toFixed(0));
        }
      });
    }
  }

 updateCanvas() {
    const ctx = (this.refs.canvas as HTMLCanvasElement).getContext("2d");
    const height = this.props.height;
    const width = this.props.width;
    const grid = this.props.grid;
    if(!grid) {
      return;
    }

    const numCols = grid.columnCount;
    const numRows = grid.rowCount;
    const gridWidth = Math.floor(width / numCols);
    const gridHeight = Math.floor(height / numRows);

    let x=0;
    let y=0;
    let temp = 0;

    if(ctx) {
      ctx.clearRect(0,0, width, height);
      for (y=0; y < numRows; y++) {
        for (x=0; x < numCols; x++) {
          temp = grid.get(x,y);
          this.drawRect(ctx, x, y, gridWidth, temp);
        }
      }
    }
  }

  renderBackground(stackedStyle:React.CSSProperties) {
    if(dataStore.prefs.showBaseMap){
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
