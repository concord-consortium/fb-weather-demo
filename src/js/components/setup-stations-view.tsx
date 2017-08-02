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
import { weatherStationStore, IWeatherStation, WeatherStation} from "../models/weather-station";

const _ = require("lodash");

const div = React.DOM.div;

export interface SetupStationState {}
export interface SetupStationProps {}

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

@observer
export class SetupStationsView extends React.Component<
  SetupStationProps,
  SetupStationState
> {
  constructor(props: SetupStationProps, ctx: any) {
    super(props, ctx);
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

  renderEditor() {
    const weatherStation = weatherStationStore.selected;
    if (weatherStation) {
      return (
        <div className="editBase" style={styles.config}>
          <TextField
            value={weatherStation.callsign}
            style={styles.textField}
            floatingLabelText="station call sign"
            onChange={(e, v) => {
              weatherStation.update({callsign:v});
            }}
          />
          <TextField
            value={weatherStation.name}
            style={styles.textField}
            floatingLabelText="station name"
            onChange={(e, v) => {
              weatherStation.update({name: v});
            }}
          />
          <TextField
            value={weatherStation.imageUrl}
            style={styles.textField}
            floatingLabelText="station image url"
            onChange={(e, v) => {
              weatherStation.update({imageUrl: v});
            }}
          />
          <TextField
            value={weatherStation.lat}
            style={styles.textField}
            type="number"
            floatingLabelText="station latitude "
            onChange={(e, v) => {
              weatherStation.update({lat: parseFloat(v)});
            }}
          />
          <TextField
            value={weatherStation.long}
            style={styles.textField}
            type="number"
            floatingLabelText="station longitude"
            onChange={(e, v) => {
              weatherStation.update({long: parseFloat(v)});
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
                  weatherStationStore.deselect();
                }
              }}
            />
            <RaisedButton
              label="delete"
              secondary={true}
              onTouchTap={() =>
                weatherStation.delete()
              }
            />
          </div>
        </div>
      );
    }
  }

  renderAddButton() {
    if (weatherStationStore.selected) {
      return;
    }
    return (
      <div style={styles.buttonRow}>
        <FlatButton
          label="Add weather station"
          primary={true}
          onTouchTap={() => weatherStationStore.addStation()}
        />
      </div>
    );
  }
  render() {
    const weatherStations = weatherStationStore.stations;
    const setStation = (selected:IWeatherStation ) => {
      weatherStationStore.select(selected);
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
                      {base.callsign}
                    </div>
                    <div className="foo">
                      {base.name}
                    </div>
                  </div>
                }
                onTouchTap={() => weatherStationStore.select(base)}
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
