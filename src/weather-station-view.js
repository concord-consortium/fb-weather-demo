import React, { PropTypes }  from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import WeatherStationConfigView from "./weather-station-config-view";
import GridView from "./grid-view";

const div = React.DOM.div;

export default class WeatherStationView extends React.Component {

  static propTypes = {
    frames: PropTypes.array,
    frame: PropTypes.number
  }

  constructor(props){
    super(props);
    this.state = {
      groupName: "",
      gridX: 0,
      gridY: 0,
      showConfig: false
    };
  }

  componentDidMount() {}

  showConfig() {
    this.setState({showConfig:true});
  }

  hideConfig() {
    this.setState({showConfig:false});
  }

  render() {
    const frameNumber = this.props.frame;
    const frames = this.props.frames;
    const mapData = frames ?  frames[frameNumber] : [ [0,0,0], [0,0,0], [0,0,0] ];
    const x = this.state.gridX;
    const y = this.state.gridY;
    const tempData = mapData[y][x];
    const name = this.state.groupName;
    const change = this.setState.bind(this);

    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.hideConfig.bind(this)}
      />
    ];

    return (
      <div className="WeatherStationView component">
        <GridView x={x} y={y} rows={3} cols={3} />
        <div className="id"> Weather Station {name} </div>
        <div className="frameNumber">Frame: {frameNumber}</div>
        <div className="temp"> Temperature = {tempData}°</div>
        <br/>
        <RaisedButton label="Set station" onTouchTap={this.showConfig.bind(this)} />
        <Dialog
          title="Configure weather station"
          actions={actions}
          modal={false}
          open={this.state.showConfig}
          onRequestClose={this.hideConfig}
        >
          <WeatherStationConfigView x={x} y={y} name={name} change={change} />
        </Dialog>
      </div>
    );
  }
}