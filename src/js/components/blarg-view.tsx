import * as React from "react";

interface routeParams {
  blarg: string
}

export interface BlargViewProps {
  params: routeParams
}

export interface BlargViewState {}

export class BlargView extends React.Component<BlargViewProps, BlargViewState> {
  constructor(props:BlargViewProps,ctx:any){
    super(props);
  }

  render() {
    const blarg = this.props.params.blarg
    const style:React.CSSProperties = {
      backgroundColor: "blue",
      color: "white",
      fontWeight: "bold",
      fontSize: "14pt",
      display: "block"
    }

    return(
      <div style={style}>
        {blarg}
      </div>
    );
  }
}