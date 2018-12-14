import * as React from "react";
import { observer } from "mobx-react";
import { cellName, IGridCell } from "../models/grid-cell";
import { gWeatherScenarioSpec } from "../models/weather-scenario-spec";

export interface GridCellProps {
  cell: IGridCell;
  size?: number ;
  color?: string;
  textColor?: string;
  onCellClick?: (cell:IGridCell|null, evt:React.MouseEvent<HTMLElement>) => void;
  colorFunc?: (cell:IGridCell|null) => string;
  titleFunc?: (cell:IGridCell|null) => any;
  rollOverFunc?:(cell:IGridCell|null) => any;
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
    const { color, textColor, colorFunc, cell, onCellClick } = this.props;
    const border = "1px solid white";
    const displayColor = colorFunc ? colorFunc(cell) : color;
    const cellStyle:React.CSSProperties = {
      display: "flex",
      position: "relative",   // container for absolute positioning within cell
      alignContent: "center",
      justifyContent: "center",
      backgroundColor: displayColor,
      opacity: gWeatherScenarioSpec.mapConfig.geoMap ? 0.75 : 1.0,
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

    const hoverContent = this.props.rollOverFunc
      ? this.props.rollOverFunc(cell)
      : normalContent;

    const content = this.state.hover
        ? hoverContent
        : normalContent;

    const clickHandler = onCellClick ? (e:any) => onCellClick(cell, e) : undefined;
    const cellLabel = cellName(cell.row, cell.column);
    const cellLabelClass = `grid-cell-label-${cellLabel}`;
    return (
      <div
        className={`grid-cell-view ${cellLabelClass}`}
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
