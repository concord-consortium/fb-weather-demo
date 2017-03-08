import React from "react";


export default class MapView extends React.Component {

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

  updateCanvas() {
    const ctx = this.refs.canvas.getContext("2d");
    const data = this.props.data || [ [0,10,0],[0,20,0],[0,30,0] ];
    let x=0;
    let y=0;
    ctx.clearRect(0,0, 300, 300);
    for (y=0; y < 3; y++) {
      for (x=0; x < 3; x++) {
        this.drawRect(ctx,x,y,data[y][x]);
      }
    }
  }

  render() {
    return (
      <canvas ref="canvas" width={300} height={300} className="map"/>
    );
  }
}