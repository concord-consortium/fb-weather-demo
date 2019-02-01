import * as React from "react";

export class RefreshButton extends React.Component<{}, {}> {
  render() {
    const refresh = () => {window.location.reload();};
    const buttonStyle:React.CSSProperties = {
      fontWeight: "bold"
    };
    return(
      <div>
        Simulation has disconnected. Refresh to continue.
          <button type="button"
                  style={buttonStyle}
                  onClick={refresh}>
            Refresh
          </button>
      </div>
    );
  }
}
