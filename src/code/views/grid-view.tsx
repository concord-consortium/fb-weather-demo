import * as React from "react";
import { observer } from "mobx-react";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { IGrid } from "../models/grid";
import { IGridCell } from "../models/grid-cell";
import { rowName, colName} from "../models/grid-cell";
import { GridCellView } from "./grid-cell-view";
import { GridHeaderView } from "./grid-header-view";
import * as _ from "lodash";

export interface GridViewProps {
  grid: IGrid|null;
  onCellClick?: (cell:IGridCell|null) => void;
  colorFunc?: (cell:IGridCell|null) => string;
  titleFunc?: (cell:IGridCell|null) => any;
}

export interface GridViewState {}

const styles:ComponentStyleMap = {
  row: {
    display: "flex",
    flexDirection: "row"
  }
};

@observer
export class GridView extends React.Component<
  GridViewProps,
  GridViewState
> {
  constructor(props: GridViewProps, ctx: any) {
    super(props, ctx);
  }

  render() {
    const { grid } = this.props;
    const gridDivs = [];
    const size = 60;
    if(grid == null) { return <div/>; }
    else {
      gridDivs.push(
        <div style={styles.row}>
          <div style={{width:size, height:size}} />
          {
            _.range(grid.columns).map( (column:number) =>
              <GridHeaderView
                key={`${colName(column)}`}
                size={size}
                label={`${colName(column)}`}
              />)
          }
        </div>
      );
      for(let row = 0; row < grid.rows; row++) {
        let rowDivs = [];
        rowDivs.push(<GridHeaderView key={row} label={rowName(row)} />);
        for(let column = 0; column < grid.columns; column++) {
          const cell = grid.gridCellAt(row,column);
          const onCellClick = this.props.onCellClick;
          const clickHandler = onCellClick ? (e:any) => onCellClick(cell) :  undefined;
          if(cell) {
            rowDivs.push(
              <GridCellView
                cellClick={clickHandler}
                size={size}
                colorFunc={this.props.colorFunc}
                key={`${row}-${column}`}
                cell={cell}
                titleFunc={this.props.titleFunc}
              />);
          }
        }
        gridDivs.push(<div key={`${row}-div`} style={styles.row}>{rowDivs}</div>);
      }
    }
    return (
      <div style={{margin: "1em"}}>
        { gridDivs }
      </div>
    );
  }
}
