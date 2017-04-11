import * as React from "react";
import { observer } from 'mobx-react';
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import {GridList, GridTile} from 'material-ui/GridList';
import SelectField from "material-ui/SelectField";
import { Frame } from "../frame";
import { ComponentStyleMap } from "../component-style-map";
import { dataStore, Basestation } from "../data-store";
const _ = require('lodash');

const div = React.DOM.div;

export interface TeacherSetupStationState { }
export interface TeacherSetupStationProps { }


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
  },
  scrollContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto'
  },
  gridTile: {
    width: '200px'
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)'
  },
};

@observer
export class TeacherSetupStationsView extends React.Component<TeacherSetupStationProps, TeacherSetupStationState> {
  constructor(props:TeacherSetupStationProps, ctx:any){
    super(props, ctx);
  }

  renderEditor() {
    const basestation = dataStore.basestation;
    if (basestation){
      return(
        <div className="editBase" style={styles.config}>
          <TextField
            value={basestation.callsign}
            style={styles.textField}
            hintText="weather station call sign"
            onChange={(e,v) => { basestation.callsign = v; dataStore.saveBasestation(); }}
          />

          <TextField
            value={basestation.name}
            style={styles.textField}
            hintText="weather station name"
            onChange={(e,v) => { basestation.name = v; dataStore.saveBasestation(); }}
          />
          <TextField
            value={basestation.imageUrl}
            style={styles.textField}
            hintText="weather station name"
            onChange={(e,v) => { basestation.imageUrl = v; dataStore.saveBasestation();}}
          />
          <TextField
            value={basestation.lat}
            style={styles.textField}
            type="number"
            hintText="weather station latitude"
            onChange={(e,v) => { basestation.lat = parseFloat(v); dataStore.saveBasestation();}}
          />
          <TextField
            value={basestation.long}
            style={styles.textField}
            type="number"
            hintText="weather station longitude"
            onChange={(e,v) => { basestation.long = parseFloat(v);  dataStore.saveBasestation();}}
          />
          <RaisedButton
            label="done"
            onTouchTap={ () => { dataStore.basestation = null }}
          />
        </div>
      )
    }
  }

  render() {
    const baseStations = dataStore.basestations;
    const setBasestation = (indicies:number[]) => {
      const selected = baseStations[indicies[0]]
      if(selected) { dataStore.basestation = selected }
    }
    return (
      <div className="configDataView">
        <div style={styles.scrollContainer}>
          <GridList style={styles.gridList}>
            { _.map(baseStations, (base:Basestation) =>

              <GridTile
                style={styles.gridTile}
                cols={1}
                key={base.id}
                title={
                  <div style={{width:"100%", height:"100%"}} >
                    <div>
                    {base.callsign}
                    </div>
                    <div className="foo">
                      {base.name}
                    </div>
                  </div>
                }
                titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
              >
                <img src={base.imageUrl} onClick={ () => dataStore.basestation=base } />
              </GridTile>
            )}
          </GridList>
        </div>
        <RaisedButton
          label="add"
          primary={true}
          onTouchTap={ () => dataStore.addBasestation() } />
        { this.renderEditor() }
      </div>
    );
  }
}