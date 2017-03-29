import * as React from "react";
import { PropTypes }  from "react";
const {table, tr, td} = React.DOM;

export interface GridViewProps {
  x: number,
  y: number,
  rows: number,
  cols: number
}
export interface GridViewState {}

export class GridView extends React.Component<GridViewProps,GridViewState> {
  constructor(props: GridViewProps, ctx: any){
    super(props);
  }

  render() {
    const result:JSX.Element[] = [];
    let rows:JSX.Element[] = [];
    for(let y = 0; y < this.props.rows; y++) {
      rows = [];
      for(let x = 0; x < this.props.cols; x++) {
        if(this.props.x == x && this.props.y == y) {
          rows.push(<td key={`${x}-${y}`} className="set"/>);
        }
        else {
          rows.push(<td key={`${x}-${y}`}className="blank"/>);
        }
      }
      result.push(<tr key={y}>{rows}</tr>);
    }
    return(<table className="GridView"><tbody>{result}</tbody></table>);
  }
}