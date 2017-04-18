import * as React from "react";
import {observer} from 'mobx-react';
import { Card, CardText, CardTitle } from "material-ui/Card";
import  MenuItem from "material-ui/MenuItem";
import  SelectField from "material-ui/SelectField";
import Toggle from "material-ui/Toggle";
import { Frame } from "../frame";
import { MapConfig } from "../map-config";
import { dataStore } from "../data-store";

export type TeacherViewTab =  "control" | "configure"

export interface TeacherOptionsViewProps { }
export interface TeacherOptionsViewState { }

@observer
export class TeacherOptionsView extends React.Component<TeacherOptionsViewProps, TeacherOptionsViewState> {
  interval: any
  constructor(props:TeacherOptionsViewProps, ctxt:any){
    super(props, ctxt);
  }

  setGrid(e:any, index:number, name:string) {
    dataStore.setPref('gridName', name);
  }

  setMap(e:any, indexs:number, id:string) {
    dataStore.mapConfig = dataStore.mapConfigMap[id];
  }

  renderPrefButton(label:string, key:string) {
    const toggleStyle = {
      marginBottom: 16
    };

    const prefFactory = function(key:string) {
      const returnF = function(e:any, v:any) {
        dataStore.setPref(key, v);
      };
      return returnF.bind(this);
    }.bind(this);

    return(
      <Toggle
        label={label}
        style={toggleStyle}
        onToggle={prefFactory(key)}
        defaultToggled={(dataStore.prefs as any)[key]} // TODO?
      />
    );
  }

  render() {
    const setGrid = this.setGrid.bind(this);
    const setMap  = this.setMap.bind(this);
    const gridNames = ["default", "classGrid"];
    const gridName = dataStore.prefs.gridName || "default";
    const mapId = dataStore.mapConfig? dataStore.mapConfig.id : 0;
    const styles = {
      block: {
        maxWidth: 250,
      }
    };
    return(
      <CardText>
        {/*
        TODO:  We might want to re-enable grids later. TBD
        <SelectField
          floatingLabelText="Use this grid:"
          value={gridName}
          autoWidth={true}
          onChange={setGrid}>
            { gridNames.map( (name,index) => <MenuItem key={index} value={name} primaryText={name} /> ) }
        </SelectField>
        */}
        <SelectField
          floatingLabelText="Use this map:"
          value={mapId}
          autoWidth={true}
          onChange={setMap}>
            { dataStore.mapConfigs.map( (map:MapConfig) => <MenuItem key={map.id} value={map.id} primaryText={map.name} /> ) }
        </SelectField>
        <div className="toggles" style={styles.block}>
          {/*{ this.renderPrefButton("Base map","showBaseMap") }*/}
          {/*{ this.renderPrefButton("Grid lines","showGridLines") }*/}
          { this.renderPrefButton("Temp values","showTempValues") }
          {/*{ this.renderPrefButton("Temp colors","showTempColors") }*/}
          { this.renderPrefButton("Show station names","showGroupNames") }
          { this.renderPrefButton("Show station temps","showStationTemps") }
          { this.renderPrefButton("Show station predictions","showPredictions") }
          { this.renderPrefButton("Enable prediction","enablePrediction") }
        </div>
      </CardText>
    );
  }
}
