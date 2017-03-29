import React, { PropTypes }  from "react";
import {Card, CardText, CardMedia, CardTitle} from "material-ui/Card";
import {Tab, Tabs} from "material-ui/Tabs";
import dateFormat from "dateformat";
import WeatherStationConfigView from "./weather-station-config-view";
import GridView from "./grid-view";
import PredictionView from "./prediction-view";

const div = React.DOM.div;

export default class WeatherStationView extends React.Component {

  static propTypes = {
    frames: PropTypes.array,
    frame: PropTypes.number,
    prefs: PropTypes.object,
    updateUserData: PropTypes.func
  }

  constructor(props){
    super(props);
    this.state = {
      name: "",
      gridX: 0,
      gridY: 0,
      tab: "weather",
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
    let mapData;
    let time = frameNumber;
    if (frames && frames.length > 0 && frames[frameNumber]) {
      const frame = frames[frameNumber];
      const grids = frame.grids;
      time =  frame.time ? dateFormat(new Date(frame.time)) : time;
      if (grids) {
        const classGrid = grids.classGrid;
        mapData = classGrid;
      }
    }
    mapData = mapData || [ [0,0,0], [0,0,0], [0,0,0] ];
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
    const tempStyle = {
      fontSize: "4rem",
      color: "hsla(0, 0%, 100%, 0.9)"
    };
    const timeStyle = {
      color: "hsla(0, 0%, 80%, 0.9)"
    };
    const handleChangeTab = (value) => {
      this.setState({
        tab: value,
      });
    };

    return (
      <Card>
        <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Configure" value="configure">
            <WeatherStationConfigView x={x} y={y} name={name} change={change} />
          </Tab>
          <Tab label="Weather" value="weather">
            <CardText>
              <div style={infoStyle}>
                <div>
                  <div className="name">{name || "(no name provided)"}</div>
                </div>
                <GridView x={x} y={y} rows={3} cols={3} />
              </div>
            </CardText>
            <CardMedia
              overlay={
                <div>
                  <CardTitle titleStyle={tempStyle} title={`Temp: ${tempData.toFixed(1)}°`} />
                  <CardText style={timeStyle} >
                    {`${time} | frame(${frameNumber})`}
                  </CardText>
                </div>
              }>
              <img src="img/farm.jpg"/>
            </CardMedia>
          </Tab>
          <Tab label="Predict" value="predict">
            <CardText>
              <PredictionView enabled={this.props.prefs.enablePrediction} />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}