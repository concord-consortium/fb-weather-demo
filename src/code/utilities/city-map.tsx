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
          padding: '0.3em',
          paddingLeft: '0.5em',
          paddingRight: '0.5em',
          // backgroundColor: 'hsla(255, 0%, 100%, 0.5)',
          borderRadius: '1em',
          fontWeight: 400,
          }}>
           <i className="icon-album" style={{paddingRight: '4px'}}/>
           {name}
          </div>
    );
  }
}
