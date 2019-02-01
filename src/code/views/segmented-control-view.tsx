import * as React from "react";
import { observer } from "mobx-react";
import { MuiThemeProvider } from 'material-ui-next/styles';
import Button from "material-ui-next/Button";
import Icon from "material-ui-next/Icon";
import RadioButton from 'material-ui/RadioButton';
import RadioGroup from 'material-ui/RadioButton/RadioButtonGroup';
import theme from "../utilities/mui-default-theme";
import { ComponentStyleMap } from "../utilities/component-style-map";
import { simulationStore } from "../models/simulation";

// uncomment if enabling renderChangeUpdateIntervalAsSelect()
// import SelectField from 'material-ui/SelectField';
// import MenuItem from 'material-ui/MenuItem';

import { TimelineView} from "./timeline-view";

export interface SegmentedControlViewProps {}
export interface SegmentedControlViewState {
  splitTime?: number|null;
}

@observer
export class SegmentedControlView extends React.Component<
                                  SegmentedControlViewProps,
                                  SegmentedControlViewState> {

  /*

  keeping in case we want to change from radio buttons to select

  renderChangeUpdateIntervalAsSelect() {
    const simulationControl = simulationStore.selected && simulationStore.selected.control;
    if (simulationControl) {
      const updateIntervalMap:{[key: string]: number} = {
        '1x': 3,
        '2x': 6,
        '3x': 9,
      };
      const options = Object.keys(updateIntervalMap).map((key) => <MenuItem key={key} value={updateIntervalMap[key]} primaryText={key} />);
      const changeUpdateInterval = (e:any, i: number, newInterval:number) => {
        simulationControl.stop();
        simulationControl.setUpdateInterval(newInterval);
      };
      const selectedInterval = Object.keys(updateIntervalMap).find((key) => updateIntervalMap[key] === simulationControl.updateInterval) || '1x';
      const value = updateIntervalMap[selectedInterval];

      return (
        <SelectField
          value={value}
          onChange={ (e,i,v) => changeUpdateInterval(e,i,v) }
          style={{width: 100}}
          floatingLabelText="Speed"
        >
          { options }
        </SelectField>
      );
    }
  }
  */

  renderChangeUpdateIntervalAsRadioButtons() {
    const simulation = simulationStore.selected;
    if (simulation) {
      const updateIntervalMap:{[key: string]: number} = {
        '1x': 0.3333333333,
        '2x': 0.1666666666,
        '3x': 0.1111111111,
      };
      const lastIndex = Object.keys(updateIntervalMap).length - 1;
      const options = Object.keys(updateIntervalMap).map((key, index) => {
        const style = index !== lastIndex ? {marginRight: 20} : {};
        return <RadioButton key={key} value={updateIntervalMap[key]} label={key} style={style} />;
      });
      const changeUpdateInterval = (e:any, newInterval: any) => {
        simulation.stop();
        simulation.setUpdateInterval(newInterval);
      };
      const updateInterval = simulation.updateInterval;
      const selectedInterval = Object.keys(updateIntervalMap).find((key) => updateIntervalMap[key] === updateInterval) || '1x';
      const value = updateIntervalMap[selectedInterval];

      return (
        <RadioGroup name="speed" onChange={changeUpdateInterval} valueSelected={value} style={{ display: 'flex' }}>
          { options }
        </RadioGroup>
      );
    }
  }

  render() {
    const simulation = simulationStore.selected;
    const isPlaying = !!(simulation && simulation.isPlaying);
    const reset = () => simulation && simulation.rewind();
    const play = () => simulation && simulation.play();
    const stop = () => simulation && simulation.stop();
    const setTime = (time: Date) => simulation && simulation.setTime(time);

    const startTime = simulation && simulation.startTime;
    const endTime = simulation && simulation.endTime;
    const breakTime = simulation && simulation.breakTime;
    const currentTime = simulation && simulation.time;
    const isAtBeginning = currentTime && startTime && currentTime <= startTime;
    const isAtEnd = currentTime && endTime ? currentTime >= endTime : false;
    const playPauseIcon = isPlaying ? "icon-pause" : "icon-play_arrow";
    const playPauseAction = isPlaying ? stop : play;
    const skipToTime = currentTime && breakTime && currentTime < breakTime ? breakTime : endTime;
    const skipAction = () => { if (skipToTime) { setTime(skipToTime); } };
    const style:ComponentStyleMap = {
      container: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 500,
        height: 150,
        alignItems: "center"
      },
      buttonStyle: {
        marginLeft: 4
      },
      iconStyle: {
        color: "#FFF",
        fontSize: 24
      }
    };
    return(
      <MuiThemeProvider theme={theme}>
        <div style={style.container} >
          <div style={{marginBottom: 10}}>
            {this.renderChangeUpdateIntervalAsRadioButtons()}
          </div>
          <div>
            <Button variant="raised"
              style={style.buttonStyle}
              disabled={!simulation || isAtBeginning || isPlaying}
              onClick={reset}
              color="primary"
            >
              <Icon className="icon-refresh" style={style.iconStyle}/>
              Reset
            </Button>
            <Button variant="raised"
              style={style.buttonStyle}
              disabled={!simulation || isAtEnd}
              onClick={playPauseAction}
              color="primary"
            >
              <Icon className={playPauseIcon} style={style.iconStyle}/>
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="raised"
              style={style.buttonStyle}
              disabled={!simulation || isPlaying || isAtEnd}
              onClick={skipAction}
              color="primary"
            >
              <Icon className="icon-skip_next" style={style.iconStyle}/>
              Skip
            </Button>
          </div>
          <TimelineView
            startTime={startTime}
            breakTime={breakTime}
            currentTime={currentTime}
            endTime={endTime}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
