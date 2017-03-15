import React, {PropTypes} from "react";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";

const div = React.DOM.div;

export default class WeatherStationConfigView extends React.Component {

  static propTypes = {
    change: PropTypes.func,
    frames: PropTypes.array,
    x: PropTypes.number,
    y: PropTypes.number,
    name: PropTypes.string
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
    let results = [];
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

    return (
      <div className="WeatherStation config component">
        <TextField
          value={this.props.name}
          onChange={setName}
          hintText="your group name"
        />

        <SelectField
          floatingLabelText="Station grid X:"
          value={x}
          autoWidth={true}
          onChange={setX}>
            {this.renderOptions(maxX)}
        </SelectField>

        <SelectField
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