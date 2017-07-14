import * as React from "react";
import { observer } from "mobx-react";
import { Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { dataStore } from "../data-store";
import { MapConfig } from "../map-config";
import { Basestation } from "../basestation";
interface LeafletMapMarkerProps {
  basestation: Basestation;
}

interface LeafletMapMarkerState {}

export class LeafletMapMarker extends React.Component<
  LeafletMapMarkerProps,
  LeafletMapMarkerState
> {
  constructor(props: LeafletMapMarkerProps, ctx: any) {
    super(props, ctx);
  }

  render() {
    const basestation = this.props.basestation;
    let predictedTemp = 0;
    let actualTemp = 0;
    if (
      basestation &&
      basestation.data &&
      basestation.data.length > dataStore.frameNumber
    ) {
      actualTemp = basestation.data[dataStore.frameNumber].value;
      predictedTemp = dataStore.predictionFor(basestation.id).temp;
    }
    const precision = 0;
    const difTemp = predictedTemp - actualTemp;
    const predictedTempString = predictedTemp.toFixed(precision);
    const actualTempString = actualTemp.toFixed(precision);

    const center = { lat: basestation.lat, lng: basestation.long };
    const key = basestation.id;

    let difTempString = difTemp.toFixed(precision);
    difTempString = difTemp < 0 ? difTempString : `+${difTempString}`;

    const icon = new DivIcon({
      html: `
        <div class "divIconContent" >
          <div>
            <span class="predictTemp">${predictedTempString}°</span>
              /
            <span class="actualTemp">${actualTempString}°</span>
          </div>
          <div class="difTemp">${difTempString}&#8457</div>
          <div>${basestation.callsign}</div>
        </div>`,
      iconSize: [50, 50],
      className: "divIcon"
    });

    return <Marker position={center} icon={icon} key={key} />;
  }
}
