import * as React from "react";
import { observer } from 'mobx-react';
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { ComponentStyleMap } from "../component-style-map";
import { GridList } from "material-ui/GridList";
import { Card } from "material-ui/Card";
import { LeafletMapView } from "./leaflet-map-view";
import { MapConfig } from "../map-config";
import { dataStore } from "../data-store";

const _ = require('lodash');

export interface SetupMapState { }
export interface SetupMapProps { }

const styles:ComponentStyleMap= {
  config: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    width: "100%"
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
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
    width: '200px',
    height: '125px',
    margin: '4px',
    overflow: "hidden",
    boxShadow: '0px 0px 3px hsla(0, 0%, 50%, 0.5)'
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)'
  },
};

@observer
export class SetupMapView extends React.Component<SetupMapProps, SetupMapState> {
  constructor(props:SetupMapProps, ctx:any){
    super(props, ctx);
  }

  renderEditor() {
    const mapConfig = dataStore.mapConfig;
    if (mapConfig){
      return(
        <div style={styles.config}>
          <TextField
            value={mapConfig.name}
            style={styles.textField}
            floatingLabelText="name"
            onChange={(e,v) => { mapConfig.name = v; dataStore.saveMapConfig(); }}
          />
          <LeafletMapView mapConfig={dataStore.mapConfig} width={400} height={400}/>
          <div style={styles.buttonRow}>
            <RaisedButton
              label="done"
              primary={true}
              onTouchTap={ () => { dataStore.mapConfig = null }}
            />
            <RaisedButton
              label="delete"
              secondary={true}
              onTouchTap={ () => { dataStore.deleteMapConfig(mapConfig) }}>
            </RaisedButton>
          </div>
        </div>
      )
    }
  }

  renderAddButton() {
    if(dataStore.gridFormat) {
      return;
    }
    return(
      <div style={styles.buttonRow}>
        <FlatButton
          label="add Map"
          primary={true}
          onTouchTap={ () => dataStore.addMapConfig() }
        />
      </div>
    );
  }

  render() {
    const maps = dataStore.mapCondfigs;
    return (
      <div className="configDataView">
        <div style={styles.scrollContainer}>
          <GridList style={styles.gridList}>
            { _.map(maps, (map:MapConfig) =>
              <div style={styles.gridTile} key={map.id} onClick={(e) => dataStore.mapConfig=map}>
                <div>{map.name}</div>
                <LeafletMapView mapConfig={map} width={200} height={100}/>
              </div>
            )}
          </GridList>
        </div>
        { this.renderAddButton() }
        { this.renderEditor()    }
      </div>
    );
  }
}
