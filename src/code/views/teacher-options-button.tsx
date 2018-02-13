import * as React from 'react';
import IconButton from 'material-ui-next/IconButton';
import SvgIcon from 'material-ui-next/SvgIcon';
import Tooltip from 'material-ui-next/Tooltip';
import { TeacherOptionsDrawer } from './teacher-options-drawer';

export const MenuIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      {/* SVG from https://material.io/icons/#ic_menu */}
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </SvgIcon>
  );
};

interface TeacherOptionsButtonProps {
}

interface TeacherOptionsButtonState {
  isTooltipOpen: boolean;
  isDrawerOpen: boolean;
}

export class TeacherOptionsButton
  extends React.Component<TeacherOptionsButtonProps, TeacherOptionsButtonState> {

  isClosingDrawer: boolean;

  state = {
    isTooltipOpen: false,
    isDrawerOpen: false
  };

  handleOpenTooltip = () => {
    // prevent closing drawer from auto-opening the tooltip
    if (!this.isClosingDrawer) {
      this.setState({ isTooltipOpen: true });
    }
  }

  handleCloseTooltip = () => {
    this.setState({ isTooltipOpen: false });
  }

  handleOpenDrawer = () => {
    this.setState({ isTooltipOpen: false, isDrawerOpen: true });
  }

  handleCloseDrawer = () => {
    this.isClosingDrawer = true;
    this.setState({ isTooltipOpen: false, isDrawerOpen: false });
    setTimeout(() => this.isClosingDrawer = false, 250);
  }

  render() {
    const { isTooltipOpen, isDrawerOpen } = this.state,
          { handleOpenTooltip, handleCloseTooltip } = this;
    return (
      <div>
        <Tooltip id="tooltip-more-options" title="More Options" placement="left"
                  open={isTooltipOpen} onOpen={handleOpenTooltip} onClose={handleCloseTooltip} >
          <IconButton className="teacher-menu-button" aria-label="Menu"
                      aria-haspopup="true" onClick={this.handleOpenDrawer} >
            <MenuIcon />
          </IconButton>
        </Tooltip>
        <TeacherOptionsDrawer isOpen={isDrawerOpen} onClose={this.handleCloseDrawer} />
      </div>
    );
  }
}
