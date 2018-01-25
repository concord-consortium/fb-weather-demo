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
          {/* <FloatingActionButton
            iconClassName="icon-refresh"
            disabled={isPlaying}
            onClick={simulation.rewind}
          /> */}
          {/* <FloatingActionButton
            iconClassName="icon-skip_previous"
            disabled={isPlaying}
            onClick={simulation.stepBack}
          /> */}
          <FloatingActionButton
            iconClassName={playPauseIcon}
            onClick={playPauseAction}
          />
          {/* <FloatingActionButton
            iconClassName="icon-skip_next"
            disabled={isPlaying}
            onClick={simulation.stepForward}
          /> */}
        </div>
    );
  }
}
