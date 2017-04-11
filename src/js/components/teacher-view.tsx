import * as React from "react";
import {observer} from 'mobx-react';
import { Card, CardMedia, CardActions, CardTitle } from "material-ui/Card";
import { Tab, Tabs } from "material-ui/Tabs";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { MapView } from "./map-view";
import { TeacherConfigView } from "./teacher-conifig-view";
import { TeacherSetupView } from "./teacher-setup-view";
import { Frame } from "../frame";
import { dataStore } from "../data-store";

export type TeacherViewTab =  "control" | "configure"

export interface TeacherViewProps {
}

export interface TeacherViewState {
  playing: boolean
  frameRate: number
  tab: TeacherViewTab
}

@observer
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

  play() {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval( () => dataStore.nextFrame(), 1000);
    this.setState({playing: true});
  }

  pause() {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({playing: false});
  }

  rewind() {
    dataStore.setFrame(0);
  }

  render() {
    const rewind = this.rewind.bind(this);
    const play   = this.play.bind(this);
    const pause  = this.pause.bind(this);
    const frame = dataStore.frame;
    const frames = dataStore.frames;
    const grid = dataStore.grid || [];
    const disablePlay = !! this.interval;
    const disablePause = ! disablePlay;
    const handleChangeTab = (value:TeacherViewTab) => {
      this.setState({
        tab: value,
      });
    };
    return(
      <Card>
         <Tabs value={this.state.tab} onChange={handleChangeTab}>
          <Tab label="Setup " value="setup">
            <TeacherSetupView  />
          </Tab>
          <Tab label="Configure" value="configure">
            <TeacherConfigView  />
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
                />
            </CardMedia>
            <CardActions>
              <FloatingActionButton
                iconClassName="icon-skip_previous"
                onTouchTap={rewind}/>
              <FloatingActionButton
                iconClassName="icon-play_circle_filled"
                disabled={disablePlay}
                onTouchTap={play}/>
              <FloatingActionButton
                iconClassName="icon-pause_circle_filled"
                disabled={disablePause}
                onTouchTap={pause}/>
            </CardActions>
          </Tab>
        </Tabs>
      </Card>

    );
  }
}
