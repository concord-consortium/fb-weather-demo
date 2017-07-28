import * as React from "react";
import { observer } from "mobx-react";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import { ComponentStyleMap } from "../component-style-map";
import { weatherStationStore, WeatherStation} from "../models/weather-station";

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

  setBasestation(evt: any, index: number, station: any) {
    weatherStationStore.select(station);
  }

  renderBaseOptions() {
    const bases = weatherStationStore.stations;
    const results = [];
    let base = null;
    for (let i = 0; i < bases.length; i++) {
      base = bases[i];
      results.push(
        <MenuItem key={base.id} value={base.id} primaryText={base.name} />
      );
    }
    return results;
  }

  render() {
    const weatherStation = weatherStationStore.selected;
    const weatherStationId = weatherStation && weatherStation.id;

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
          onChange={this.setBasestation.bind(this)}
        >
          {this.renderBaseOptions()}
        </SelectField>
      </div>
    );
  }
}
