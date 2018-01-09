import * as React from "react";

export const CityMap:any = {
  "A-6": "Glenburg",
  "C-3": "Bump City",
  "E-3": "Plainville",
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
          fontSize: '15pt',
          marginTop: '-10px',
          marginLeft: '-36px',
          padding: '0em 0.5em',
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
