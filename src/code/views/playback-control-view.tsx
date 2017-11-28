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
    const isPlaying = !!(simulationStore.isPlaying);
    const playPauseIcon = isPlaying ? "icon-pause_circle_filled" : "icon-play_circle_filled";
    const playPauseAction = isPlaying ? simulationStore.stop : simulationStore.play;

    return(
      <div>
          <FloatingActionButton
            iconClassName="icon-refresh"
            disabled={isPlaying}
            onTouchTap={simulationStore.rewind}
          />
          <FloatingActionButton
            iconClassName="icon-skip_previous"
            disabled={isPlaying}
            onTouchTap={simulationStore.stepBack}
          />
          <FloatingActionButton
            iconClassName={playPauseIcon}
            onTouchTap={playPauseAction}
          />
          <FloatingActionButton
            iconClassName="icon-skip_next"
            disabled={isPlaying}
            onTouchTap={simulationStore.stepForward}
          />
        </div>
    );
  }
}
