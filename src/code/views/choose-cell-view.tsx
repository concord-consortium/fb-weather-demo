import * as React from "react";
import { observer } from "mobx-react";

import { Card, CardTitle, CardText} from "material-ui/Card";
import { Tabs, Tab } from "material-ui/Tabs";


import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../stores/simulation-store";
import { IGridCell } from "../models/grid-cell";
import { GridView } from "./grid-view";

export interface ChooseCellProps {
}
export interface ChooseCellStsate {
  chosenCell: IGridCell | null;
}

const styles: ComponentStyleMap = {
  card: {
  },
  chooseButton: {
    color: "white",
    margin: "0.25em",
    fontWeight: "bold"
  }
};


@observer
export class ChooseCellView
  extends React.Component<ChooseCellProps, ChooseCellStsate> {
  constructor(props: ChooseCellProps, context: any) {
    super(props);
    this.state = {chosenCell: null};
  }

  setCell(cell:IGridCell) {
    this.setState({chosenCell: cell});
  }


  setStation() {

  }

  render() {
    const grid = simulationStore.selected ? simulationStore.selected.grid : null;
    return (
      <Card style={styles.card}>
        <Tabs>
          <Tab label="Location" value="Location">
            <CardTitle>Choose your location from the grid</CardTitle>
            <CardText>
              <GridView grid={grid} />
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
