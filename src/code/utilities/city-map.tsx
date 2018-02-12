import * as React from "react";

export const CityMap:any = {
  "F-1": "Glenburg",
  "C-3": "Bump City",
  "C-5": "Plainville",
  "G-7": "Farmington"
};

export function cityAnnotation(cellName:string) {
  const name =  CityMap[cellName],
        annotationStyle: React.CSSProperties = {
          left: 12,
          top: 20,
          zIndex: 1,
          whiteSpace: 'nowrap',
          position: 'absolute',
          display: 'block',
          overflow:'visible',
          fontSize: '15pt',
          padding: '0em 0.5em',
          // backgroundColor: 'hsla(255, 0%, 100%, 0.5)',
          borderRadius: '1em',
          fontWeight: 400,
          pointerEvents: 'none'
        },
        leftLabelStyle: React.CSSProperties = {
          position: 'absolute',
          right: 34,
          textAlign: 'right'
        },
        leftLabelIconStyle = {},
        rightLabelIconStyle = { paddingRight: '4px' },
        rightLabelStyle = {},
        // prepare for optionally putting label to left of dot
        isLeftLabel = ['E', 'F', 'G'].indexOf(cellName[0]) >= 0,
        iconStyle = isLeftLabel ? leftLabelIconStyle : rightLabelIconStyle;
  if (name) {
    return(
      <div style={annotationStyle}>
        {isLeftLabel ? <div style={leftLabelStyle}>{name}</div> : null}
        {<i className="icon-album" style={iconStyle}/>}
        {!isLeftLabel ? <span style={rightLabelStyle}>{name}</span> : null}
      </div>
    );
  }
}
