import * as React from "react";
import { observer } from "mobx-react";
import { IGridCell } from "../models/grid-cell";

export interface GridCellProps {
  cell:IGridCell;
  size?: number ;
  color?: string;
  textColor?: string;
  cellClick?: (evt:any) => void;
  colorFunc?: (cell:IGridCell|null) => string;
  titleFunc?: (cell:IGridCell|null) => any;
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
    const { color, textColor, colorFunc, cell, cellClick  }  = this.props;
    const border = "1px solid black";
    const displayColor = colorFunc ? colorFunc(cell) : color;
    const cellStyle:React.CSSProperties = {
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: displayColor,
      color: textColor,
      alignItems: "center",
      fontSize: "24pt",
      fontWeight: "bold",
      width: `${this.props.size}px`,
      height: `${this.props.size}px`,
      border: border
    };

    const normalContent = this.props.titleFunc
      ? this.props.titleFunc(cell)
      : "";

    const hoverContent = cell.displayName;

    const content = this.state.hover
        ? hoverContent
        : normalContent;

    const clickHandler = cellClick ? (e:any) => cellClick(cell) : undefined;
    return (
      <div
        style={cellStyle}
        onMouseOut = { ()=>this.mouseOut()  }
        onMouseOver= { ()=>this.mouseOver() }
        onClick = { clickHandler }
        >
        {content}
      </div>
    );

  }
}
