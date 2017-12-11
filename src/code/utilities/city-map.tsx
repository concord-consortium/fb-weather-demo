import * as React from "react";

export const CityMap:any = {
  "A-6": "Glenburg",
  "C-3": "Bump City",
  "E-3": "PlainVille",
  "G-7": "Farmington"
};

export function cityAnotation(cellName:string) {
  const name =  CityMap[cellName];
  if (name) {
    return(
      <div style={
        {
          whiteSpace: 'nowrap',
          position: 'absolute',
          display: 'block',
          overflow:'visible',
          fontSize: '12pt',
          paddingLeft: '0.25em',
          paddingRight: '0.25em',
          backgroundColor: 'hsla(255, 0%, 100%, 0.7)',
          borderRadius: '0.5em'
          }}> ⌾ {name} </div>
    );
  }
}
