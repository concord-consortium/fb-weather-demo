import * as React from "react";
import { observer } from "mobx-react";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import { ComponentStyleMap } from "../component-style-map";
import { IWeatherStation } from "../models/weather-station";
import { simulationStore } from "../stores/simulation-store";

const _ = require("lodash");
const div = React.DOM.div;

export interface WeatherStationConfigState {}
export interface WeatherStationConfigProps {
  change(key: any): void;
  x: number;
  y: number;
  name: string;
}

@observer
export class WeatherStationConfigView extends React.Component<
  WeatherStationConfigProps,
  WeatherStationConfigState
> {
  constructor(props: WeatherStationConfigProps, ctx: any) {
    super(props, ctx);
  }

  setStation = (evt: any, index: number, value: any) => {
    const presences = simulationStore.presences,
          stations = simulationStore.stations,
          station = (stations && stations.getStation(value)) || null;
    if (presences) { presences.setStation(station); }
  }

  renderStationList() {
    const simulationStations = simulationStore.stations;
    if (!simulationStations) { return null; }

    return simulationStations.stations.map((station: IWeatherStation) => {
      return <MenuItem key={station.callSign} value={station.callSign}
                        primaryText={`[${station.callSign}] ${station.name}`} />;
    });
  }

  render() {
    const weatherStation = simulationStore.presenceStation;
    const weatherStationId = weatherStation && weatherStation.callSign;

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
      }
    };

    return (
      <div style={styles.config}>
        <SelectField
          style={styles.textField}
          floatingLabelText="Choose your location"
          value={weatherStationId}
          autoWidth={true}
          onChange={this.setStation}
        >
          {this.renderStationList()}
        </SelectField>
      </div>
    );
  }
}
