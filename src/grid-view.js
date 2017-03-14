import React, { PropTypes }  from "react";
const {table, tr, td} = React.DOM;

export default class GridView extends React.Component {

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    rows: PropTypes.number,
    cols: PropTypes.number,
  }

  constructor(props){
    super(props);
  }

  render() {
    const result = [];
    let rows = [];
    for(let y = 0; y < this.props.rows; y++) {
      rows = [];
      for(let x = 0; x < this.props.cols; x++) {
        if(this.props.x == x && this.props.y == y) {
          rows.push(<td key={`${x}-${y}`} className="set"/>);
        }
        else {
          rows.push(<td key={`${x}-${y}`}className="blank"/>);
        }
      }
      result.push(<tr key={y}>{rows}</tr>);
    }
    return(<table className="GridView"><tbody>{result}</tbody></table>);
  }
}