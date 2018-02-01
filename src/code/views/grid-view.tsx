import * as React from "react";
import { observer } from "mobx-react";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { IGrid } from "../models/grid";
import { IGridCell } from "../models/grid-cell";
import { rName, cName} from "../models/grid-cell";
import { GridCellView } from "./grid-cell-view";
import { GridHeaderView } from "./grid-header-view";
import * as _ from "lodash";

export interface GridViewProps {
  grid: IGrid|null;
  onCellClick?: (cell:IGridCell|null, evt:React.MouseEvent<HTMLElement>) => void;
  colorFunc?: (cell:IGridCell|null) => string;
  titleFunc?: (cell:IGridCell|null) => any;
  rollOverFunc?: (cell:IGridCell|null) => any;
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
    if(grid == null) { return <div key="grid-cell-view"/>; }
    else {
      gridDivs.push(
        <div  key="grid-cell-header" style={styles.row}>
          <div key="grid-cell-header-rows" style={{width:size, height:size}} />
          {
            _.range(grid.columns).map( (column:number) =>
              <GridHeaderView
                key={`${cName(column)}`}
                size={size}
                label={`${cName(column)}`}
              />)
          }
        </div>
      );
      for(let row = 0; row < grid.rows; row++) {
        let rowDivs = [];
        rowDivs.push(<GridHeaderView key={row} label={rName(row)} />);
        for(let column = 0; column < grid.columns; column++) {
          const cell = grid.gridCellAt(row, column);
          if(cell) {
            rowDivs.push(
              <GridCellView
                onCellClick={this.props.onCellClick}
                size={size}
                colorFunc={this.props.colorFunc}
                key={`${row}-${column}-grid-cell`}
                cell={cell}
                titleFunc={this.props.titleFunc}
                rollOverFunc={this.props.rollOverFunc}
              />);
          }
        }
        gridDivs.push(<div key={`${row}-div`} style={styles.row}>{rowDivs}</div>);
      }
    }
    return (
      <div key="grid-cell-view" style={{margin: "1em"}}>
        { gridDivs }
      </div>
    );
  }
}
