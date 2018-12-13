import * as React from "react";
import { observer } from "mobx-react";
import { cellName, IGridCell } from "../models/grid-cell";
import { ISimulation } from "../models/simulation";
import { IWeatherStation } from "../models/weather-station";
import RaisedButton from "material-ui/RaisedButton";

export interface TeacherCellPopoverProps {
  simulation: ISimulation | null;
  cell: IGridCell;
  group: string;
  station?: IWeatherStation | null;
}

@observer
export class TeacherCellPopover extends React.Component<TeacherCellPopoverProps> {

  constructor(props: TeacherCellPopoverProps) {
    super(props);
  }

  disconnectGroup = (group: string) => {
    const { simulation } = this.props,
          presences = simulation && simulation.presences,
          presence = presences && presences.getPresenceForGroup(group);
    if (simulation && presence) {
      simulation.deletePresence(presence.id);
    }
  }

  render() {
    const { simulation, cell, group, station  } = this.props,
          settings = simulation && simulation.settings,
          cellLabel = cellName(cell.row, cell.column),
          cellLabelClass = `cell-${cellLabel}`,
          temperature = station && station.temperature,
          formatTempOptions = { precision: 0, withUnit: true },
          strTemp = settings && (temperature != null)
                      ? temperature.format(formatTempOptions)
                      : "",
          strPrecip = station && station.strPrecipitation,
          disconnectGroup = () => this.disconnectGroup(group),
          kRedXChar = "\u274C",
          kSpace = "\u00A0",  // non-breaking space
          disconnectButton = group
                              ? <RaisedButton
                                  onClick={disconnectGroup}
                                  label={`${kRedXChar}${kSpace}${kSpace}Disconnect`}
                                  primary={true}
                                />
                              : null;
    return (
      <div className={`teacher-cell-popover-contents ${cellLabelClass}`}>
        <div className="station-id">{cellLabel}</div>
        <div className="temperature">{strTemp}</div>
        <div className="precipitation">{strPrecip}</div>
        <div className="group">{group}</div>
        {disconnectButton}
      </div>
    );
  }
}
