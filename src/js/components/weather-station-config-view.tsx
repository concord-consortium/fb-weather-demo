import * as React from "react";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import { Frame } from "../frame";
import { ComponentStyleMap } from "../component-style-map";

const div = React.DOM.div;

export interface WeatherStationConfigState { }
export interface WeatherStationConfigProps {
    change(any): void
    frames: Frame[]
    x: number
    y: number
    name: string
}
export class WeatherStationConfigView extends React.Component<WeatherStationConfigProps, WeatherStationConfigState> {

  static propTypes = {

  }

  constructor(props){
    super(props);
  }

  change(data) {
    this.props.change(data);
  }

  setX(evt, index, value) {
    this.change({gridX: value});
  }

  setY(evt, index, value) {
    this.change({gridY: value});
  }

  maxX(){
    const firstRow = this.props.frames[0].data[0];
    return firstRow.length;
  }

  maxY(){
    return  this.props.frames[0].data.length;
  }

  setName(evt) {
    this.change({name: evt.target.value});
  }

  renderOptions(max) {
    let results:JSX.Element[] = [];
    for(let i = 0; i < max; i++){
      results.push(
        <MenuItem key={i} value={i} primaryText={`${i}`} />
      );
    }
    return results;
  }

  render() {
    const setName = this.setName.bind(this);
    const setX    = this.setX.bind(this);
    const setY    = this.setY.bind(this);
    const y       = this.props.y;
    const x       = this.props.x;

    const maxX = 3;
    const maxY = 3;

    const styles:ComponentStyleMap= {
      config: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        aligncontent: "center",
        width: "100%"
      },
      textField: {
        display: "block",
        margin: "1em"
      }
    };

    return (
      <div className="component" style={styles.config}>
        <TextField
          style={styles.textField}
          value={this.props.name}
          onChange={setName}
          hintText="your group name"
        />

        <SelectField
          style={styles.textField}
          floatingLabelText="Station grid X:"
          value={x}
          autoWidth={true}
          onChange={setX}>
            {this.renderOptions(maxX)}
        </SelectField>

        <SelectField
          style={styles.textField}
          floatingLabelText="Station grid Y:"
          value={y}
          autoWidth={true}
          onChange={setY}>
          {this.renderOptions(maxY)}
        </SelectField>

      </div>
    );
  }
}