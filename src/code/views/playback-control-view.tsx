import * as React from "react";
import { observer } from "mobx-react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { simulationStore } from "../models/simulation";

export interface PlaybackControlViewProps {}
export interface PlaybackControlViewState {}

@observer
export class PlaybackControlView extends React.Component<
                                  PlaybackControlViewProps,
                                  PlaybackControlViewState> {

  render() {
    const simulation = simulationStore.selected;
    const isPlaying = !!(simulation.isPlaying);
    const playPauseIcon = isPlaying ? "icon-pause_circle_filled" : "icon-play_circle_filled";
    const playPauseAction = isPlaying ? simulation.stop : simulation.play;

    return(
      <div style={{marginBottom: "20px"}}>
          <FloatingActionButton
            iconClassName="icon-refresh"
            disabled={isPlaying}
            onTouchTap={simulation.rewind}
          />
          <FloatingActionButton
            iconClassName="icon-skip_previous"
            disabled={isPlaying}
            onTouchTap={simulation.stepBack}
          />
          <FloatingActionButton
            iconClassName={playPauseIcon}
            onTouchTap={playPauseAction}
          />
          <FloatingActionButton
            iconClassName="icon-skip_next"
            disabled={isPlaying}
            onTouchTap={simulation.stepForward}
          />
        </div>
    );
  }
}
