import * as React from "react";
import { observer } from 'mobx-react';
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { ComponentStyleMap } from "../component-style-map";
import { GridList } from "material-ui/GridList";
import { Card } from "material-ui/Card";
import { GeoMap } from "../geo-map";
import { GridView } from "./grid-view";
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
    const geomap = dataStore.geoMap;
    if (geomap){
      return(
        <div style={styles.config}>
          <TextField
            value={geomap.name}
            style={styles.textField}
            floatingLabelText="name"
            onChange={(e,v) => { geomap.name = v; dataStore.saveGeoMap(); }}
          />
          <TextField
            value={geomap.imageUrl}
            style={styles.textField}
            floatingLabelText="url"
            onChange={(e,v) => {geomap.imageUrl = v; dataStore.saveGeoMap(); }}
          />
          <div style={styles.buttonRow}>
            <RaisedButton
              label="done"
              primary={true}
              onTouchTap={ () => { dataStore.geoMap = null }}
            />
            <RaisedButton
              label="delete"
              secondary={true}
              onTouchTap={ () => { dataStore.deleteGeoMap(geomap) }}>
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
          onTouchTap={ () => dataStore.addGeoMap() }
        />
      </div>
    );
  }

  render() {
    const maps = dataStore.geoMaps;
    return (
      <div className="configDataView">
        <div style={styles.scrollContainer}>
          <GridList style={styles.gridList}>
            { _.map(maps, (map:GeoMap) =>
              <div style={styles.gridTile} key={map.id} onClick={(e) => dataStore.geoMap=map}>
                <div>{map.name}</div>
                <img src={map.imageUrl} width="200"/>
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
