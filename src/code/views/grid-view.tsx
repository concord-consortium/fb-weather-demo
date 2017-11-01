import * as React from "react";
import { observer } from "mobx-react";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { IGrid } from "../models/grid";
import { rowName, colName} from "../models/grid-cell";
import { GridCellView } from "./grid-cell-view";
import { GridHeaderView } from "./grid-header-view";
import * as _ from "lodash";

export interface GridViewProps {
  grid: IGrid|null;
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
            _.range(grid.columns).map( (column:number) => <GridHeaderView size={size} label={`${colName(column)}`} />)
          }
        </div>
      );
      for(let row = 0; row < grid.rows; row++) {
        let rowDivs = [];
        rowDivs.push(<GridHeaderView label={rowName(row)} />);
        for(let column = 0; column < grid.columns; column++) {
          if (grid) {
            rowDivs.push(<GridCellView size={size} cell={grid.gridCellAt(row,column)} />);
          }
        }
        gridDivs.push(<div style={styles.row}>{rowDivs}</div>);
      }
    }
    return (
      <div style={{margin: "1em"}}>
        { gridDivs }
      </div>
    );
  }
}
