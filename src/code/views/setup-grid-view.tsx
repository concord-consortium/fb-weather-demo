import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router";

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardTitle, CardText} from "material-ui/Card";
import { Tabs, Tab } from "material-ui/Tabs";

import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../models/simulation";
// const div = React.DOM.div;

import { GridView } from "./grid-view";

export interface SetupGridProps {}
export interface SetupGridState {
  rows: string;
  columns: string;
}

const styles:ComponentStyleMap = {
  row: {
    display: "flex",
    flexDirection: "row"
  },
  column: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "60px",
    height: "60px",
    border: "1px solid black"
  },
  controls: {}
};

@observer
export class SetupGridView extends React.Component<
  SetupGridProps,
  SetupGridState
> {
  constructor(props: SetupGridProps, ctx: any) {
    const grid = simulationStore.grid;
    super(props, ctx);
    if(grid) {
      this.state = {
        rows: grid.rows.toString(),
        columns: grid.columns.toString()
      };
    }
  }

  renderControls() {
    const grid = simulationStore.grid;
    if(grid) {
      const updateRows = (e:any, value:string) => {
        this.setState({rows: value});
        grid.setRows(parseInt(value,10));
      };
      const updateColumns = (e:any,value:string) => {
        this.setState({columns: value});
        grid.setColumns(parseInt(value,10));
      };
      const {rows, columns}  = this.state;

      return(
        <div style={styles.controls}>
          <TextField
            name="rows"
            hintText="7"
            floatingLabelText="number of rows"
            onChange={updateRows}
            value ={rows}/>
          <TextField
            name="columns"
            hintText="7"
            floatingLabelText="number of columns"
            onChange={updateColumns}
            value ={columns}/>
        </div>
      );
    }
    return "";
  }

  renderDone() {
    const simulationName = simulationStore.name;
    const path: string = `/simulations/${simulationName}`;
    return (
      <div>
        <RaisedButton
          primary={true}
          containerElement={<Link to={path}/>}>
            Done
        </RaisedButton>
      </div>
    );
  }

  render() {
    const grid = simulationStore.grid;
    const controls = this.renderControls();
    if(grid == null) { return <div/>; }
    return (
      <Card style={styles.card}>
      <Tabs>
        <Tab label="Room Size" value="Room Size">
          <CardTitle>Configure your room size</CardTitle>
          <CardText>
            <div>
              { controls }
              <GridView grid={grid} />
              { this.renderDone() }
            </div>
          </CardText>
        </Tab>
      </Tabs>
    </Card>
    );
  }
}
