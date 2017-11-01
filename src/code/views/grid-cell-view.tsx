import * as React from "react";
import { observer } from "mobx-react";
import { IGridCell } from "../models/grid-cell";

export interface GridCellProps {
  cell:IGridCell;
  size?: number ;
  color?: string;
  textColor?: string;
}
export interface GridCellState {
  hover:boolean;
}


@observer
export class GridCellView extends React.Component<
  GridCellProps,
  GridCellState
> {
  public static defaultProps: Partial<GridCellProps> = {
    size: 60,
    color: "none",
    textColor: "black"
};

  constructor(props: GridCellProps, ctx: any) {
    super(props, ctx);
    this.state = {
      hover:false
    };
  }

  mouseOut() {
    this.setState({hover: false});
  }

  mouseOver() {
    this.setState({hover: true});
  }

  render() {
    const { color, textColor }  = this.props;
    const border = "1px solid black";
    const transparent = "hsla(0, 0%, 0%, 0.0)";
    const displayTextColor = this.state.hover ? textColor : transparent;
    const cellStyle:React.CSSProperties = {
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: displayTextColor,
      alignItems: "center",
      fontSize: "24pt",
      fontWeight: "bold",
      width: `${this.props.size}px`,
      height: `${this.props.size}px`,
      border: border
    };
    const {cell} = this.props;
    return (
      <div
        style={cellStyle}
        onMouseOut = { ()=>this.mouseOut()  }
        onMouseOver= { ()=>this.mouseOver() }
        >
        {cell.displayName}
      </div>
    );

  }
}
