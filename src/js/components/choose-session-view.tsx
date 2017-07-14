import * as React from "react";
import { observer } from "mobx-react";

import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import { Card } from "material-ui/Card";
import { List, ListItem } from "material-ui/List";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { dataStore } from "../data-store";

const _ = require("lodash");

interface routeParams {
  sessionName: string;
}

interface router {
  push: Function;
}

export interface ChooseSessionViewProps {
  params: routeParams;
  router: router;
}

enum DialogType {
  None = 0,
  Copy,
  Delete,
  Rename
}

export interface ChooseSessionViewState {
  nowShowing: DialogType;
  newSessionName: string;
  oldSessionName: string;
}

@observer
export class ChooseSessionView extends React.Component<
  ChooseSessionViewProps,
  ChooseSessionViewState
> {
  constructor(props: ChooseSessionViewProps, ctx: any) {
    super(props, ctx);
    this.state = {
      nowShowing: DialogType.None,
      newSessionName: "(untitled)",
      oldSessionName: "(untitled)"
    };
  }

  iconButton() {
    return (
      <IconButton touch={true} tooltip="edit" tooltipPosition="bottom-left">
        <MoreVertIcon color="hsl(0,0%,50%)" />
      </IconButton>
    );
  }

  rightIconMenu(sessionName: string) {
    const copy = function() {
      this.setState({
        nowShowing: DialogType.Copy,
        oldSessionName: sessionName,
        newSessionName: `copy of ${sessionName}`
      });
    }.bind(this);

    const rm = function() {
      this.setState({
        nowShowing: DialogType.Delete,
        oldSessionName: sessionName,
        newSessionName: sessionName
      });
    }.bind(this);

    const rename = function() {
      this.setState({
        nowShowing: DialogType.Rename,
        oldSessionName: sessionName,
        newSessionName: sessionName
      });
    }.bind(this);

    return (
      <IconMenu iconButtonElement={this.iconButton()} animated={false}>
        <MenuItem onTouchTap={copy}>Copy</MenuItem>
        <MenuItem onTouchTap={rename}>Rename</MenuItem>
        <MenuItem onTouchTap={rm}>Delete</MenuItem>
      </IconMenu>
    );
  }

  navigateTo(path: string) {
    this.props.router.push(path);
  }

  handleClose() {
    if (this.state.nowShowing === DialogType.Copy) {
      dataStore.copySession(
        this.state.oldSessionName,
        this.state.newSessionName
      );
    }
    if (this.state.nowShowing === DialogType.Rename) {
      dataStore.renameSession(this.state.newSessionName);
    }
    if (this.state.nowShowing === DialogType.Delete) {
      dataStore.deleteSession(this.state.newSessionName);
    }
    this.setState({ nowShowing: DialogType.None });
  }

  handleCancel() {
    this.setState({ nowShowing: DialogType.None });
  }

  render() {
    const names = dataStore.sessionList.sort();
    const visList = _.map(names, (name: string) => {
      const pathString: string = `sessions/${name}`;
      return (
        <ListItem
          key={name}
          primaryText={name}
          onTouchTap={() => this.navigateTo(pathString)}
          rightIconButton={this.rightIconMenu(name)}
        />
      );
    });

    const dialogActions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Cancel"
        keyboardFocused={true}
        onTouchTap={this.handleCancel.bind(this)}
      />
    ];
    const showingCopy = this.state.nowShowing === DialogType.Copy;
    const showingDelete = this.state.nowShowing === DialogType.Delete;
    const showingRename = this.state.nowShowing === DialogType.Rename;

    const handleClose = this.handleClose.bind(this);
    return (
      <Card>
        <Tabs>
          <Tab label="Choose Session">
            <List>
              {visList}
            </List>
          </Tab>
        </Tabs>

        <Dialog
          title="Copy Session"
          actions={dialogActions}
          modal={true}
          open={showingCopy}
          onRequestClose={handleClose}
        >
          <TextField
            id="copySessionName"
            ref="copySessionName"
            value={this.state.newSessionName}
            onChange={(event: any) =>
              this.setState({ newSessionName: event.target.value })}
          />
        </Dialog>

        <Dialog
          title="Rename Session"
          actions={dialogActions}
          modal={true}
          open={showingRename}
          onRequestClose={handleClose}
        >
          <TextField
            id="renameSessionName"
            ref="renameSessionName"
            value={this.state.newSessionName}
            onChange={(event: any) =>
              this.setState({ newSessionName: event.target.value })}
          />
        </Dialog>

        <Dialog
          title="Delete Session"
          actions={dialogActions}
          modal={true}
          open={showingDelete}
          onRequestClose={handleClose}
        >
          <div>
            Are you sure you want to delete "{this.state.newSessionName}"?
          </div>
        </Dialog>
      </Card>
    );
  }
}
