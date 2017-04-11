import * as React from "react";
import {observer} from 'mobx-react';
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import { Frame } from "../frame";
import { ComponentStyleMap } from "../component-style-map";
import { dataStore, Basestation } from "../data-store";

const _ = require("lodash");
const div = React.DOM.div;

export interface WeatherStationConfigState { }
export interface WeatherStationConfigProps {
    change(any:any): void
    frames: Frame[]
    x: number
    y: number
    name: string
}

@observer
export class WeatherStationConfigView extends React.Component<WeatherStationConfigProps, WeatherStationConfigState> {
  constructor(props:WeatherStationConfigProps, ctx:any){
    super(props, ctx);
  }

  setBasestation(evt:any, index:number, id:string) {
    dataStore.basestation = dataStore.basestationMap[id];
  }

  renderBaseOptions() {
    const bases=dataStore.basestations;
    const results = [];
    let base = null;
    for(let i = 0; i < bases.length; i++){
      base = bases[i];
      results.push(
        <MenuItem key={base.id} value={base.id} primaryText={base.name} />
      );
    }
    return results;
  }

  render() {
    const baseId = dataStore.basestation ? dataStore.basestation.id : null;

    const styles:ComponentStyleMap= {
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
      <div className="component" style={styles.config}>
        <SelectField
          style={styles.textField}
          floatingLabelText="Choose your location"
          value={baseId}
          autoWidth={true}
          onChange={this.setBasestation.bind(this)}
          >
          {this.renderBaseOptions()}

        </SelectField>

      </div>
    );
  }
}