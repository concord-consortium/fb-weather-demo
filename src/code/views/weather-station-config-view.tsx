import * as React from "react";
import { observer } from "mobx-react";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { IWeatherStation } from "../models/weather-station";
import { simulationStore } from "../stores/simulation-store";

export interface WeatherStationConfigState {}
export interface WeatherStationConfigProps {
  station?: IWeatherStation | null;
  onChangeStation(station: IWeatherStation | null): void;
}

@observer
export class WeatherStationConfigView extends React.Component<
                                                WeatherStationConfigProps,
                                                WeatherStationConfigState> {
  constructor(props: WeatherStationConfigProps, ctx: any) {
    super(props, ctx);
  }

  setStation = (evt: any, index: number, value: any) => {
    const stations = simulationStore.stations,
          station = (stations && stations.getStation(value)) || null;
    if (this.props.onChangeStation) {
      this.props.onChangeStation(station);
    }
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
    const simulation = simulationStore.selected;
    const weatherStation = this.props.station || simulation.presenceStation;
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
