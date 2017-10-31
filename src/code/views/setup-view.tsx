import * as React from "react";
import { observer } from "mobx-react";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../stores/simulation-store";
// const div = React.DOM.div;
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from "react-router";
export interface SetupProps {}
export interface SetupState {
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
export class SetupView extends React.Component<
  SetupProps,
  SetupState
> {
  constructor(props: SetupProps, ctx: any) {
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
    const simulationName = simulationStore.selected ? simulationStore.selected.name : "choose";
    const path: string = `/simulations/${simulationName}`;
    return <div><RaisedButton containerElement={<Link to={path}/>}>Done</RaisedButton></div>;
  }

  render() {
    const grid = simulationStore.grid;
    const gridContainer = [];
    const controls = this.renderControls();
    if(grid == null) { return <div/>; }
    else {
      for(let row = 0; row < grid.rows; row++) {
        let rowDivs = [];
        for(let column = 0; column < grid.columns; column++) {
          if (grid) {
            const cell = grid.gridCellAt(row,column);
            if (cell) {
              const elem = <div style={styles.column}>{cell.displayName}</div>;
              rowDivs.push(elem);
            }
          }
        }
        gridContainer.push(<div style={styles.row}>{rowDivs}</div>);
      }
    }
    return (
      <div>
        { controls }
        { gridContainer }
        { this.renderDone() }
      </div>
    );
  }
}
