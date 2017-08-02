import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { dataStore } from "../data-store";
import { MapConfig } from "../map-config";
import { IWeatherStation, weatherStationStore } from "../models/weather-station";
interface LeafletMapMarkerProps {
  weatherStation: IWeatherStation;
  selected: boolean;
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
    const weatherStation = this.props.weatherStation;
    const prediction = dataStore.predictionFor(weatherStation.id);
    return prediction;
  }

  get predictedTemp() {
    if(this.prediction) {
      return this.prediction.temp;
    }
    return null;
  }

  get actualTemp() {
    const weatherStation = this.props.weatherStation;
    const frameNumber = dataStore.frameNumber.get();
    if (
      weatherStation &&
      weatherStation.data &&
      weatherStation.data.length > frameNumber
    ) {
      return weatherStation.data[frameNumber].value;
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
      return `<div>${this.props.weatherStation.callsign}</div>`;
    }
    return "";
  }

  render() {
    const weatherStation = this.props.weatherStation;
    const ds = dataStore;
    const handleClick = function(evt:any) {
      weatherStationStore.select(weatherStation);
    };

    const center = { lat: this.props.weatherStation.lat, lng: this.props.weatherStation.long };
    const key = this.props.weatherStation.id;
    let classes ="divIcon";
    const selected = this.props.selected;

    if(selected) {
      classes = `${classes} selected`;
    }

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
      className: classes
    });

    return <Marker onclick={handleClick} position={center} icon={icon} key={key} />;
  }
}
