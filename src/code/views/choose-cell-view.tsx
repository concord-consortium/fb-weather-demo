import * as React from "react";
import { observer } from "mobx-react";

import { CardTitle, CardText} from "material-ui/Card";
import { simulationStore } from "../models/simulation";
import { IGridCell } from "../models/grid-cell";
import { IPresence } from "../models/presence";
import { GridView } from "./grid-view";

import * as _ from "lodash";

export interface ChooseCellProps {
}
export interface ChooseCellStsate {
  chosenCell: IGridCell | null;
}


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
    const simulation = simulationStore.selected;
    const grid = simulation.grid;
    const group = simulation.selectedGroup;
    const groupName = group && group.name;
    const presence = simulation.selectedPresence;
    const presences = simulation.presences.presenceList;
    const occupiedStations = _.map(presences,  (value,key) => (value as IPresence).weatherStationID);

    const stationId = presence && presence.weatherStationID;
    const myTeamCellColor = "#D4EBB0";
    const teamCellColor = "#B7AEAE";
    const unoccupiedColor = "#D8D8D8";
    const onClick = (cell:IGridCell) => {
      if(presence) {
        if(!_.includes(occupiedStations,cell.id)) {
          presence.setStationId(cell.weatherStationId);
        }
      }
    };
    const colorFunc = (cell:IGridCell) => {
      if(cell.weatherStationId === stationId) {
        return myTeamCellColor;
      }
      if(simulationStore.selected.presences &&
        _.includes(occupiedStations, cell.id)) {
        return teamCellColor;
      }
      return unoccupiedColor;
    };

    const titleFunc = (cell:IGridCell) => {
      const id = cell.id;
      const foundPresence = _.find(presences, (p) =>  {
        const pId = p.weatherStationID;
        console.log(`${id} == ${pId}`);
        return pId === id;
      });

      if(foundPresence) {
        return <div style={{fontSize:"8pt"}}>{foundPresence.groupName} </div>;
      }
    };

    return (
      <div>
        <CardTitle>{groupName}: choose your location on the grid</CardTitle>
        <CardText>
          <GridView grid={grid}
            colorFunc={colorFunc}
            titleFunc={titleFunc}
            onCellClick={onClick}
            rollOverFunc={ (cell) => cell &&  cell.displayName}/>
        </CardText>
      </div>
    );
  }
}
