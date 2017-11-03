import * as React from "react";
import { observer } from "mobx-react";

import { Card, CardTitle, CardText} from "material-ui/Card";
import { Tabs, Tab } from "material-ui/Tabs";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../stores/simulation-store";
import { IGridCell } from "../models/grid-cell";
import { GridView } from "./grid-view";

import * as _ from "lodash";

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
    const group = simulationStore.selectedGroup;
    const groupName = group && group.name;
    const presence = simulationStore.selectedPresence;
    const presences = simulationStore.presences && simulationStore.presences.presences.values();
    const occupiedStations = _.map(presences,  (value,key) => value.weatherStationID);
    const title = `${groupName}: Location`;
    const stationId = presence && presence.weatherStationID;
    const green = "green";
    const grey = "grey";
    const white = "white";
    const onClick = (cell:IGridCell) => {
      if(presence) {
        presence.setStation(cell.weatherStation);
      }
    };
    const colorFunc = (cell:IGridCell) => {
      if(cell.weatherStation.id === stationId) {
        return green;
      }
      if(simulationStore.presences &&
        _.includes(occupiedStations, cell.id)) {
        return grey;
      }
      return white;
    };

    const titleFunc = (cell:IGridCell) => {
      const id = cell.id;
      const foundPresence = _.find(presences, (p) =>  p.weatherStationID === id);
      if(foundPresence) {
        return <div style={{fontSize:"8pt"}}>{foundPresence.groupName} </div>;
      }
    };

    return (
      <Card style={styles.card}>
        <Tabs>
          <Tab label={title} value={title}>
            <CardTitle>{groupName}: choose your location on the grid</CardTitle>
            <CardText>
              <GridView grid={grid} colorFunc={colorFunc} titleFunc={titleFunc} onCellClick={onClick}/>
            </CardText>
          </Tab>
        </Tabs>
      </Card>
    );
  }
}
