import React, { PropTypes } from "react";
import { Kriging } from "../kriging";


function normalize(minIn,maxIn,minOut,maxOut,input) {
  let d = maxIn  - minIn;
  let r = maxOut - minOut;
  return ((input - minIn) / d) * r + minOut;
}

function normalArray(arrIn,minOut,maxOut) {
  const minIn = Math.min.apply(null, arrIn);
  const maxIn = Math.max.apply(null, arrIn);
  return arrIn.map( (i) => normalize(minIn,maxIn,minOut,maxOut,i));
}

export default class NewMapView extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    gridCount: PropTypes.number,
    showTempValues: PropTypes.bool,
    showTempColors: PropTypes.bool,
    showGridLines: PropTypes.bool,
    showBaseMap: PropTypes.bool
  }

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
    const alpha = normalize(50,90,0,0.5, v);
    const size = width;
    const color = `hsla(0, 50%, 50%, ${alpha})`;
    ctx.fillStyle = color;
    if(this.props.showTempColors) {
      ctx.fillRect(x*size, y*size, size, size);
    }
    if(this.props.showTempValues) {
      this.drawLabel(ctx, x*size, y*size, width,  v.toFixed(1));
    }
    if(this.props.showGridLines) {
      ctx.strokeRect(x*size, y*size, size, size);
      if(x == 0) {
        this.drawLabel(ctx, x*size, y*size, width, y);
      }
      if(y == 0) {
        this.drawLabel(ctx, x*size, y*size, width, x);
      }
    }
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext("2d");
    const height = this.props.height;
    const width = this.props.width;
    const gridCount = this.props.gridCount || 10;
    const gridWidth = Math.floor(width / gridCount);
    const numRows = Math.floor(width / gridWidth);
    const data = {
      values: [70, 75, 60, 65],
      xs:     [301.1, 0.0, 100.0, 200.0],
      ys:     [0.0, 400.0, 100.0, 200.0]
    };
    const kriging = Kriging();
    const model = kriging.train(data.values, data.xs, data.ys, "gaussian", 0, 100);

    let x=0;
    let y=0;
    let predict = 0;

    ctx.clearRect(0,0, width, height);
    for (y=0; y < numRows; y++) {
      for (x=0; x < numRows; x++) {
        predict = kriging.predict(x*gridWidth, y*gridWidth, model);
        this.drawRect(ctx, x, y, gridWidth, predict);
      }
    }
  }

  renderBackground(stackedStyle) {
    if(this.props.showBaseMap){
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
      <div className="TestView" style={containerStyle}>
        { this.renderBackground(stackedStyle) }
        <canvas ref="canvas" style={stackedStyle} width={width} height={height} className="test"/>
      </div>
    );
  }
}
