import React, { PropTypes }  from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import {Card, CardText, CardActions, CardMedia, CardTitle} from "material-ui/Card";

import WeatherStationConfigView from "./weather-station-config-view";
import GridView from "./grid-view";

const div = React.DOM.div;

export default class WeatherStationView extends React.Component {

  static propTypes = {
    frames: PropTypes.array,
    frame: PropTypes.number,
    updateUserData: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      name: "",
      gridX: 0,
      gridY: 0,
      showConfig: false
    };
  }

  componentDidMount() {}

  componentDidUpdate() {
    const props = this.props;
    const state = this.state;
    // Send user updates to Firebase after state has updated.
    const updateFunc = function() {
      props.updateUserData({
        name: state.name,
        gridX: state.gridX,
        gridY: state.gridY
      });
    };
    // TODO: Better debouncing?
    if(this.pending) { clearTimeout(this.pending); }
    this.pending = setTimeout(updateFunc,1000);
  }

  showConfig() {
    this.setState({showConfig:true});
  }

  hideConfig() {
    this.setState({showConfig:false});
  }

  setConfig(data) {
    this.setState(data);
  }

  render() {
    const frameNumber = this.props.frame;
    const frames = this.props.frames;
    const mapData = frames ?  frames[frameNumber] : [ [0,0,0], [0,0,0], [0,0,0] ];
    const x = this.state.gridX;
    const y = this.state.gridY;
    const tempData = mapData[y][x];
    const name = this.state.name;
    const change = this.setConfig.bind(this);
    const infoStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start"
    };

    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.hideConfig.bind(this)}
      />
    ];

    return (
      <Card>
        <CardText>
          <div style={infoStyle}>
            <div>
              <div className="name">{name || "(no name provided)"}</div>
            </div>
            <GridView x={x} y={y} rows={3} cols={3} />
          </div>
        </CardText>
        <CardMedia
          overlay={<CardTitle title={`Temperature ${tempData}°`} subtitle={`Time: ${frameNumber}`} />}
        >
          <img src="img/farm.jpg"/>
        </CardMedia>
        <CardActions>
          <RaisedButton label="Set station" onTouchTap={this.showConfig.bind(this)} />
        </CardActions>
        <Dialog
          title="Configure weather station"
          actions={actions}
          modal={false}
          open={this.state.showConfig}
          onRequestClose={this.hideConfig}
        >
          <WeatherStationConfigView x={x} y={y} name={name} change={change} />
        </Dialog>
      </Card>
    );
  }
}