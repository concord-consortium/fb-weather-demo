import * as React from "react";
import { observer } from "mobx-react";

import { Tabs, Tab } from "material-ui/Tabs";
import { Card } from "material-ui/Card";
import { List, ListItem } from "material-ui/List";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { simulationListStore } from "../stores/simulation-store";
import { gWeatherScenarioSpec } from "../models/weather-scenario-spec";
import { Toolbar, ToolbarGroup } from "material-ui/Toolbar";
import * as _ from "lodash";

interface routeParams {
  simulationName: string;
}

interface router {
  push: Function;
}

export interface ChooseSimulationViewProps {
  params: routeParams;
  router: router;
}

enum DialogType {
  None = 0,
  Copy,
  Delete,
  Rename,
  New
}

export interface ChooseSimulationViewState {
  nowShowing: DialogType;
  newSimulationName: string;
  oldSimulationName: string;
}

@observer
export class ChooseSimulationView extends React.Component<
  ChooseSimulationViewProps,
  ChooseSimulationViewState
> {
  constructor(props: ChooseSimulationViewProps, ctx: any) {
    super(props, ctx);
    this.state = {
      nowShowing: DialogType.None,
      newSimulationName: "(untitled)",
      oldSimulationName: "(untitled)"
    };
  }

  iconButton() {
    return (
      <IconButton touch={true} tooltip="edit" tooltipPosition="bottom-left">
        <MoreVertIcon color="hsl(0,0%,50%)" />
      </IconButton>
    );
  }

  rightIconMenu(simulationName: string) {
    const copy = function() {
      this.setState({
        nowShowing: DialogType.Copy,
        oldSimulationName: simulationName,
        newSimulationName: `copy of ${simulationName}`
      });
    }.bind(this);

    const rm = function() {
      this.setState({
        nowShowing: DialogType.Delete,
        oldSimulationName: simulationName,
        newSimulationName: simulationName
      });
    }.bind(this);

    const rename = function() {
      this.setState({
        nowShowing: DialogType.Rename,
        oldSimulationName: simulationName,
        newSimulationName: simulationName
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
      simulationListStore.copySimulation(
        this.state.oldSimulationName,
        this.state.newSimulationName
      );
    }
    if (this.state.nowShowing === DialogType.Rename) {
      simulationListStore.renameSimulation(this.state.newSimulationName);
    }
    if (this.state.nowShowing === DialogType.Delete) {
      simulationListStore.deleteSimulation(this.state.newSimulationName);
    }
    if (this.state.nowShowing === DialogType.New) {
      simulationListStore.addSimulation(this.state.newSimulationName, gWeatherScenarioSpec);
    }
    this.setState({ nowShowing: DialogType.None });
  }

  handleCancel() {
    this.setState({ nowShowing: DialogType.None });
  }

  render() {
    const names = simulationListStore.simulationList;
    const visList = _.map(names, (name: string) => {
      const pathString: string = `simulations/${name}`;
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
    const showingNew = this.state.nowShowing === DialogType.New;


    const onNew = function() {
      this.setState({
        nowShowing: DialogType.New,
        newSimulationName: "untitlted"
      });
    }.bind(this);
    const handleClose = this.handleClose.bind(this);
    return (
      <Card>
        <Tabs>
          <Tab label="Choose Simulation">
            <List>
              {visList}
            </List>
            <Toolbar><ToolbarGroup>
              <FlatButton primary={true} onTouchTap={onNew}> Add Simulation </FlatButton>
            </ToolbarGroup></Toolbar>
          </Tab>
        </Tabs>
        <Dialog
          title="Copy Simulation"
          actions={dialogActions}
          modal={true}
          open={showingCopy}
          onRequestClose={handleClose}
        >
          <TextField
            id="copySessionName"
            ref="copySessionName"
            value={this.state.newSimulationName}
            onChange={(event: any) =>
              this.setState({ newSimulationName: event.target.value })}
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
            id="renameSimulation"
            ref="renameSimulation"
            value={this.state.newSimulationName}
            onChange={(event: any) =>
              this.setState({ newSimulationName: event.target.value })}
          />
        </Dialog>

        <Dialog
          title="Delete Simulation"
          actions={dialogActions}
          modal={true}
          open={showingDelete}
          onRequestClose={handleClose}
        >
          <div>
            Are you sure you want to delete "{this.state.newSimulationName}"?
          </div>
        </Dialog>
        <Dialog
          title="New Simulation"
          actions={dialogActions}
          modal={true}
          open={showingNew}
          onRequestClose={handleClose}
        >
          <TextField
            id="newSimulation"
            ref="newSimulation"
            value={this.state.newSimulationName}
            onChange={(event: any) =>
              this.setState({ newSimulationName: event.target.value })}
          />
        </Dialog>
      </Card>
    );
  }
}
