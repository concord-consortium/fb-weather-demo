import * as React from 'react';
import SvgIcon from 'material-ui-next/SvgIcon';
import Drawer from 'material-ui-next/Drawer';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui-next/List';
import { simulationStore } from "../models/simulation";

export const DeleteSweepIcon = (props: any) => {
  // SVG from https://material.io/icons/#ic_delete_sweep
  // tslint:disable-next-line:max-line-length
  const svgPath = "M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z";
  return (
    <SvgIcon {...props}>
      <path d={svgPath}/>
    </SvgIcon>
  );
};

interface TeacherOptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TeacherOptionsDrawerState {
}

export class TeacherOptionsDrawer
  extends React.Component<TeacherOptionsDrawerProps, TeacherOptionsDrawerState> {

  handleDisconnectAll = () => {
    const simulation = simulationStore.selected;
    if (simulation) {
      simulation.deleteAllOtherPresences();
    }
  }

  render() {
    return (
      <Drawer anchor="right" open={this.props.isOpen} onClose={this.props.onClose}>
        <div tabIndex={0} role="button"
            onClick={this.props.onClose} onKeyDown={this.props.onClose} >
          <ListItem button onClick={this.handleDisconnectAll}>
            <ListItemIcon>
              <DeleteSweepIcon />
            </ListItemIcon>
            <ListItemText primary="Disconnect All" />
          </ListItem>
        </div>
      </Drawer>
    );
  }
}
