import * as React from "react";
import { Card, CardText, CardTitle } from "material-ui/Card";
import  MenuItem from "material-ui/MenuItem";
import  SelectField from "material-ui/SelectField";
import Toggle from "material-ui/Toggle";
import { Frame } from "../frame";

export type TeacherViewTab =  "control" | "configure"

export interface TeacherConfigViewProps {
    prefs: any,
    setPrefs(prefs:any): void
}

export interface TeacherConfigViewState {
}

export class TeacherConfigView extends React.Component<TeacherConfigViewProps, TeacherConfigViewState> {
  interval: any
  constructor(props:TeacherConfigViewProps, ctxt:any){
    super(props, ctxt);
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
    const setGrid = this.setGrid.bind(this);
    const gridNames = ["default", "classGrid"];
    const gridName = this.props.prefs.gridName || "default";
    const styles = {
      block: {
        maxWidth: 250,
      }
    };
    return(
      <CardText>
        <SelectField
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
    );
  }
}
