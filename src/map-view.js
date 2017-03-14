import React, { PropTypes } from "react";

export default class MapView extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    gridRoster: PropTypes.object
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

  drawRect(ctx,x,y,v) {
    const size = 100;
    const color = `hsl(0,50%,${v}%)`;
    ctx.fillStyle = color;
    ctx.fillRect(x*size,y*size,size,size);
  }

  drawLabel(ctx, x, y, text) {
    const size = 100;
    const halfSize = size/2;
    const color = "hsl(0,50%,100%)";
    ctx.fillStyle = color;
    ctx.font = "8px sans-serif";
    ctx.textAlign="center";
    ctx.fillText(text, x*size + halfSize, y*size + halfSize);
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext("2d");
    const data = this.props.data || [ [0,10,0],[0,20,0],[0,30,0] ];
    const gridRoster = this.props.gridRoster;
    let x=0;
    let y=0;
    let name=undefined;
    ctx.clearRect(0,0, 300, 300);
    for (y=0; y < 3; y++) {
      for (x=0; x < 3; x++) {
        this.drawRect(ctx,x,y,data[y][x]);
        if((gridRoster[x] != undefined) && (gridRoster[x][y] != undefined)) {
          name = gridRoster[x][y];
          this.drawLabel(ctx, x, y, name || "?");
        }
      }
    }
  }

  render() {
    return (
      <div className="MapView">
        <canvas ref="canvas" width={300} height={300} className="map"/>
      </div>
    );
  }
}
