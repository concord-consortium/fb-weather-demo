import * as React from "react";
import { PropTypes } from "react";
import * as _ from "lodash";
import { Card, CardText, CardMedia, CardActions, CardTitle } from "material-ui/Card";
import  MenuItem from "material-ui/MenuItem";
import  SelectField from "material-ui/SelectField";
import { Tab, Tabs } from "material-ui/Tabs";
import Toggle from "material-ui/Toggle";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { MapView } from "./map-view";
import { Frame } from "../frame";

export type TeacherViewTab =  "control" | "configure"

export interface TeacherViewProps {
    frame: number
    frames: Frame[]
    grid?: any[]
    gridNames: string[]
    gridName: string
    prefs: any,
    gridRoster: any,
    setFrame(frameNumber:number): void
    setFrames(frames:Frame[]): void
    setPrefs(prefs:any): void
}

export interface TeacherViewState {
  playing: boolean
  frameRate: number
  tab: TeacherViewTab
}

export class TeacherView extends React.Component<TeacherViewProps, TeacherViewState> {
  interval: any

  constructor(props:TeacherViewProps, ctxt:any){
    super(props, ctxt);
    this.state = {
      playing: false,
      frameRate: 2000,
      tab: "control"
    };
  }

  nextFrame(){
    const frameLength = this.props.frames.length;
    let frameNumber = (this.props.frame || 0) + 1;
    frameNumber = frameNumber % frameLength;
    this.props.setFrame(frameNumber);
  }

  play() {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval( () => this.nextFrame(), 1000);
    this.setState({playing: true});
  }

  pause() {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({playing: false});
  }

  rewind() {
    this.props.setFrame(0);
  }


  setGrid(e, index, value) {
    const update = this.props.prefs;
    update.gridName = value;
    this.props.setPrefs(update);
  }

  renderPrefButton(label, key) {
    const toggleStyle = {
      marginBottom: 16
    };

    const prefFactory = function(key) {
      const returnF = function(e,v) {
        const update = this.props.prefs;
        update[key] = v;
        this.props.setPrefs(update);
      };
      return returnF.bind(this);
    }.bind(this);

    return(
      <Toggle
        label={label}
        style={toggleStyle}
        onToggle={prefFactory(key)}
        defaultToggled={this.props.prefs[key]}
      />
    );
  }

  render() {
    const rewind = this.rewind.bind(this);
    const play   = this.play.bind(this);
    const pause  = this.pause.bind(this);
    const setGrid = this.setGrid.bind(this);

    const { frame, frames }  = this.props;
    const gridNames = ["default", "classGrid"];
    const gridName = this.props.prefs.gridName || "default";
    const grid = this.props.grid || [];
    const disablePlay = !! this.interval;
    const disablePause = ! disablePlay;

    const handleChangeTab = (value) => {
      this.setState({
        tab: value,
      });
    };
    
    const styles = {
      block: {
        maxWidth: 250,
      },
      thumbOff: {
        backgroundColor: "#ffcccc",
      },
      trackOff: {
        backgroundColor: "#ff9d9d",
      },
      thumbSwitched: {
        backgroundColor: "red",
      },
      trackSwitched: {
        backgroundColor: "#ff9d9d",
      },
      labelStyle: {
        color: "red",
      },
      textField: {},
      button: {}
    };
    return(
      <Card>
         <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Configure" value="configure">
            <CardText>
              <SelectField
                style={styles.textField}
                floatingLabelText="Use this grid:"
                value={gridName}
                autoWidth={true}
                onChange={setGrid}>
                  { gridNames.map( (name,index) => <MenuItem key={index} value={name} primaryText={name} /> ) }
              </SelectField>
              <div className="toggles" style={styles.block}>
                { this.renderPrefButton("Base map","showBaseMap") }
                { this.renderPrefButton("Grid lines","showGridLines") }
                { this.renderPrefButton("Temp values","showTempValues") }
                { this.renderPrefButton("Temp colors","showTempColors") }
                { this.renderPrefButton("Group names","showGroupNames") }
                { this.renderPrefButton("Show station temps","showStationTemps") }
                { this.renderPrefButton("Show station predictions","showStationPredictions") }
                { this.renderPrefButton("Enable prediction","enablePrediction") }
              </div>
            </CardText>
          </Tab>
          <Tab label="Control" value="control">
            <CardTitle>
              Time: {frame}
            </CardTitle>
            <CardMedia>
              <MapView
                grid={grid}
                width={400}
                height={400}
                prefs={this.props.prefs}
                />
            </CardMedia>
            <CardActions>
              <FloatingActionButton
                iconClassName="icon-skip_previous"
                style={styles.button}
                onTouchTap={rewind}/>
              <FloatingActionButton
                iconClassName="icon-play_circle_filled"
                disabled={disablePlay}
                style={styles.button}
                onTouchTap={play}/>
              <FloatingActionButton
                iconClassName="icon-pause_circle_filled"
                style={styles.button}
                disabled={disablePause}
                onTouchTap={pause}/>
            </CardActions>
          </Tab>
        </Tabs>
      </Card>

    );
  }
}
