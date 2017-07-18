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
const precision = 0;

export class LeafletMapMarker extends React.Component<
  LeafletMapMarkerProps,
  LeafletMapMarkerState
> {
  constructor(props: LeafletMapMarkerProps, ctx: any) {
    super(props, ctx);
  }

  get prediction() {
    const basestation = this.props.basestation;
    const prediction = dataStore.predictionFor(basestation.id);
    return prediction;
  }

  get predictedTemp() {
    if(this.prediction) {
      return this.prediction.temp;
    }
    return null;
  }

  get actualTemp() {
    const basestation = this.props.basestation;
    const frameNumber = dataStore.frameNumber.get();
    if (
      basestation &&
      basestation.data &&
      basestation.data.length > frameNumber
    ) {
      return basestation.data[frameNumber].value;
    }
    return null;
  }

  get diffTemp() {
    if(this.actualTemp && this.predictedTemp) {
      return(this.actualTemp - this.predictedTemp);
    }
    return null;
  }

  predictedTempDiv() {
    if(dataStore.prefs.showPredictions && this.prediction) {
      if (this.prediction.temp) {
        const predictedTempString = this.prediction.temp.toFixed(precision);
        return `<span class="predictTemp">${predictedTempString}°</span> /`;
      }
    }
    return "";
  }

  actualTempDiv() {
    if (dataStore.prefs.showTempValues && this.actualTemp) {
      const actualTempString = this.actualTemp.toFixed(precision);
      return `<span class="actualTemp">${actualTempString}°</span>`;
    }
    return "";
  }

  diffTempDiv() {
    if (dataStore.prefs.showDeltaTemp && this.diffTemp) {
      let difTempString = this.diffTemp.toFixed(precision);
      difTempString = this.diffTemp < 0 ? difTempString : `+${difTempString}`;
      return `<div class="difTemp">${difTempString}&#8457</div>`;
    }
    return "";
  }

  callsignDiv() {
    if (dataStore.prefs.showStationNames) {
      return `<div>${this.props.basestation.callsign}</div>`;
    }
    return "";
  }

  render() {
    const center = { lat: this.props.basestation.lat, lng: this.props.basestation.long };
    const key = this.props.basestation.id;
    const icon = new DivIcon({
      html: `
        <div class "divIconContent" >
          <div>
            ${this.predictedTempDiv()}
            ${this.actualTempDiv()}
          </div>
            ${this.diffTempDiv()}
            ${this.callsignDiv()}
        </div>`,
      iconSize: [50, 50],
      className: "divIcon"
    });

    return <Marker position={center} icon={icon} key={key} />;
  }
}
