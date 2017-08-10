import * as React from "react";
import { observer } from "mobx-react";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import * as Dropzone from "react-dropzone";
import { GridList, GridTile } from "material-ui/GridList";
import SelectField from "material-ui/SelectField";
import { ComponentStyleMap } from "../component-style-map";
import { IWeatherStation } from "../models/weather-station";
import { simulationStore } from "../stores/simulation-store";

const _ = require("lodash");

const div = React.DOM.div;

export interface SetupStationProps {}
export interface SetupStationState {
  weatherStation?: IWeatherStation;
  callSign?: string;
  name?: string;
  imageUrl?: string;
  lat?: string;
  long?: string;
}

const styles: ComponentStyleMap = {
  config: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    aligncontent: "center",
    width: "100%"
  },
  textField: {
    display: "block",
    margin: "1em"
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"
  },
  scrollContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  gridList: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto"
  },
  dropzone: {
    backgroundColor: "hsla(0, 10%, 90%, 0.5)",
    padding: "2em",
    borderRadious: "0.5em",
    border: "2px dashed hsla(0, 10%, 85%, 0.5)"
  },
  gridTile: {
    width: "200px"
  },
  titleStyle: {
    color: "rgb(0, 188, 212)"
  }
};

function stationToState(weatherStation?: IWeatherStation | null) {
  return weatherStation
          ? {
            weatherStation,
            callSign: weatherStation.callSign,
            name: weatherStation.name,
            imageUrl: weatherStation.imageUrl,
            lat: String(weatherStation.lat),
            long: String(weatherStation.long)
          }
          : {
            weatherStation: undefined,
            callSign: undefined,
            name: undefined,
            imageUrl: undefined,
            lat: undefined,
            long: undefined
          };
}

@observer
export class SetupStationsView extends React.Component<
  SetupStationProps,
  SetupStationState
> {
  constructor(props: SetupStationProps, ctx: any) {
    super(props, ctx);

    this.state = stationToState(simulationStore.selectedStation);
  }

  readData() {}
  onDrop(acceptedFiles: File[], rejectedFiles: File[]) {
    let reader = new FileReader();
    reader.addEventListener(
      "loadend",
      function(event: any) {
        // TODO: Parse data in weather stations: dataStore.addBasestationData(event.target.result);
      }.bind(this)
    );
    reader.readAsText(acceptedFiles[0]);
  }

  handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }

  updateWeatherStation(weatherStation?: IWeatherStation) {
    this.setState(stationToState(weatherStation));
  }

  updateStateValue = (prop: string, value: string) => {
    this.setState({ [prop]: value });
  }

  updateRemoteString = (prop: string, value: string) => {
    if (this.state.weatherStation) {
      this.state.weatherStation.update({ [prop]: value });
    }
  }

  updateRemoteFloat = (prop: string, value: string) => {
    const numValue = parseFloat(value);
    if (this.state.weatherStation && !isNaN(numValue)) {
      this.state.weatherStation.update({ [prop]: numValue });
    }
  }

  renderEditor() {
    const { weatherStation, callSign, name, imageUrl, lat, long } = this.state;

    if (!weatherStation) {
      return null;
    }

    return (
      <div className="editBase" style={styles.config}>
        <TextField
          value={callSign}
          style={styles.textField}
          floatingLabelText="station call sign"
          onChange={(e, v) => { this.updateStateValue('callSign', v); }}
          onKeyDown={ this.handleKeyDown }
          onBlur={(e) => {
            this.updateRemoteString('callSign', (e.target as HTMLTextAreaElement).value);
          }}
        />
        <TextField
          value={name}
          style={styles.textField}
          floatingLabelText="station name"
          onChange={(e, v) => { this.updateStateValue('name', v); }}
          onKeyDown={ this.handleKeyDown }
          onBlur={(e) => {
            this.updateRemoteString('name', (e.target as HTMLTextAreaElement).value);
          }}
        />
        <TextField
          value={imageUrl}
          style={styles.textField}
          floatingLabelText="station image url"
          onChange={(e, v) => { this.updateStateValue('imageUrl', v); }}
          onKeyDown={ this.handleKeyDown }
          onBlur={(e) => {
            this.updateRemoteString('imageUrl', (e.target as HTMLTextAreaElement).value);
          }}
        />
        <TextField
          value={lat}
          style={styles.textField}
          type="number"
          floatingLabelText="station latitude "
          onChange={(e, v) => { this.updateStateValue('lat', v); }}
          onKeyDown={ this.handleKeyDown }
          onBlur={(e) => {
            this.updateRemoteFloat('lat', (e.target as HTMLTextAreaElement).value);
          }}
        />
        <TextField
          value={long}
          style={styles.textField}
          type="number"
          floatingLabelText="station longitude"
          onChange={(e, v) => { this.updateStateValue('long', v); }}
          onKeyDown={ this.handleKeyDown }
          onBlur={(e) => {
            this.updateRemoteFloat('long', (e.target as HTMLTextAreaElement).value);
          }}
        />
        <Dropzone onDrop={this.onDrop} style={styles.dropzone}>
          <div>Add Data Files</div>
        </Dropzone>
        <div style={styles.buttonRow}>
          <RaisedButton
            label="done"
            primary={true}
            onTouchTap={() => {
              {
                this.updateWeatherStation();
                if (simulationStore.stations) {
                  simulationStore.stations.deselect();
                }
              }
            }}
          />
          <RaisedButton
            label="delete"
            secondary={true}
            onTouchTap={() => {
              this.updateWeatherStation();
              if (simulationStore.stations) {
                simulationStore.stations.deselect();
              }
              weatherStation.delete();
            }}
          />
        </div>
      </div>
    );
  }

  renderAddButton() {
    if (!simulationStore.selectedStation) { return null; }
    return (
      <div style={styles.buttonRow}>
        <FlatButton
          label="Add weather station"
          primary={true}
          onTouchTap={() => {
            {/* const simulationStations = simulationStore.stations,
                  station = simulationStations && simulationStations.addStation();
            this.updateWeatherStation(station); */}
          }}
        />
      </div>
    );
  }
  render() {
    const simulationStations = simulationStore.stations,
          weatherStations = simulationStations && simulationStations.stations;
    const setStation = (selected:IWeatherStation ) => {
      if (simulationStations) {
        simulationStations.select(selected);
      }
    };
    return (
      <div className="configDataView">
        <div style={styles.scrollContainer}>
          <GridList style={styles.gridList}>
            {_.map(weatherStations, (base: IWeatherStation) =>
              <GridTile
                style={styles.gridTile}
                cols={1}
                key={base.id}
                title={
                  <div style={{ width: "100%", height: "100%" }}>
                    <div>
                      {base.callSign}
                    </div>
                    <div className="foo">
                      {base.name}
                    </div>
                  </div>
                }
                onTouchTap={() => {
                  this.updateWeatherStation(base);
                  if (simulationStations) {
                    simulationStations.select(base);
                  }
                }}
                titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
              >
                <img src={base.imageUrl} />
              </GridTile>
            )}
          </GridList>
        </div>
        {this.renderAddButton()}
        {this.renderEditor()}
      </div>
    );
  }
}
