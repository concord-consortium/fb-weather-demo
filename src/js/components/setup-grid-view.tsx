import * as React from "react";
import { observer } from 'mobx-react';
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { ComponentStyleMap } from "../component-style-map";
import { GridList } from "material-ui/GridList";
import { Card } from "material-ui/Card";
import { GridFormat } from "../grid";
import { GridView } from "./grid-view";
import { dataStore } from "../data-store";
const _ = require('lodash');

export interface SetupGridState { }
export interface SetupGridProps { }

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
export class SetupGridView extends React.Component<SetupGridProps, SetupGridState> {
  constructor(props:SetupGridProps, ctx:any){
    super(props, ctx);
  }

  renderEditor() {
    const gridFormat = dataStore.gridFormat;
    if (gridFormat){
      return(
        <div style={styles.config}>
          <TextField
            value={gridFormat.name}
            style={styles.textField}
            floatingLabelText="name"
            onChange={(e,v) => { gridFormat.name = v; dataStore.saveGridFormat(); }}
          />
          <TextField
            value={gridFormat.columns}
            style={styles.textField}
            type="number"
            floatingLabelText="column count"
            onChange={(e,v) => {gridFormat.columns = parseInt(v); dataStore.saveGridFormat(); }}
          />
          <TextField
            value={gridFormat.rows}
            style={styles.textField}
            type="number"
            floatingLabelText="row count"
            onChange={(e,v) => {gridFormat.rows = parseInt(v); dataStore.saveGridFormat();}}
          />
          <div style={styles.buttonRow}>
            <RaisedButton
              label="done"
              primary={true}
              onTouchTap={ () => { dataStore.gridFormat = null }}
            />
            <RaisedButton
              label="delete"
              secondary={true}
              onTouchTap={ () => { dataStore.deleteGridFormat(gridFormat) }}>
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
          label="add grid"
          primary={true}
          onTouchTap={ () => dataStore.addGridFormat() }
        />
      </div>
    );
  }

  render() {
    const gridFormats = dataStore.gridFormats;
    const setBasestation = (indicies:number[]) => {
      const selected = gridFormats[indicies[0]]
      if(selected) { dataStore.gridFormat = selected }
    }
    return (
      <div className="configDataView">
        <div style={styles.scrollContainer}>
          <GridList style={styles.gridList}>
            { _.map(gridFormats, (gridFormat:GridFormat) =>
              <div style={styles.gridTile} key={gridFormat.id} onClick={(e) => dataStore.gridFormat=gridFormat}>
                <div>{gridFormat.name}</div>
                <GridView cols={gridFormat.columns} rows={gridFormat.rows} x={0} y={0}/>
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