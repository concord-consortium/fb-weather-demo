import * as React from "react";
import { observer } from "mobx-react";

export interface GridHeaderProps {
  size?: number ;
  label?: string;
  textColor?: string;
}
export interface GridHeaderState {}


@observer
export class GridHeaderView extends React.Component<
  GridHeaderProps,
  GridHeaderState
> {
  public static defaultProps: Partial<GridHeaderProps> = {
    size: 60,
    label: "none",
    textColor: "none"
};

  constructor(props: GridHeaderProps, ctx: any) {
    super(props, ctx);
  }

  render() {
    const { label, textColor }  = this.props;
    const border = "none";
    const cellStyle:React.CSSProperties = {
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      color: textColor,
      alignItems: "center",
      width: `${this.props.size}px`,
      height: `${this.props.size}px`,
      border: border
    };
    return (
      <div style={cellStyle}>{label}</div>
    );

  }
}
