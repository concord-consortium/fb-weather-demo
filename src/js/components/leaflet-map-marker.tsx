import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { PredictionType } from "../models/prediction";
import { simulationStore } from "../stores/simulation-store";
import { IWeatherStation } from "../models/weather-station";

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
    const prediction = simulationStore.predictions.predictionFor(weatherStation);
    return prediction;
  }

  get predictedTemp() {
    return (this.prediction && (this.prediction.type === PredictionType.eTemperature))
              ? this.prediction.predictedValue : null;
  }

  get actualTemp() {
    const weatherStation = this.props.weatherStation;
    return weatherStation.temperature;
  }

  get diffTemp() {
    if(this.actualTemp && this.predictedTemp) {
      return(this.actualTemp - this.predictedTemp);
    }
    return null;
  }

  predictedTempDiv() {
    if(simulationStore.settings.showPrediction && this.prediction) {
      if ((this.predictedTemp != null) && !isNaN(this.predictedTemp)) {
        const predictedTempString = this.predictedTemp.toFixed(precision);
        return `<span class="predictTemp">${predictedTempString}°</span> /`;
      }
    }
    return "";
  }

  actualTempDiv() {
    if (simulationStore.settings.showTempValues && this.actualTemp) {
      const actualTempString = this.actualTemp.toFixed(precision);
      return `<span class="actualTemp">${actualTempString}°</span>`;
    }
    return "";
  }

  diffTempDiv() {
    if (simulationStore.settings.showDeltaTemp && this.diffTemp) {
      let difTempString = this.diffTemp.toFixed(precision);
      difTempString = this.diffTemp < 0 ? difTempString : `+${difTempString}`;
      return `<div class="difTemp">${difTempString}&#8457</div>`;
    }
    return "";
  }

  callsignDiv() {
    if (simulationStore.settings.showStationNames) {
      return `<div>${this.props.weatherStation.callsign}</div>`;
    }
    return "";
  }

  render() {
    const weatherStation = this.props.weatherStation;
    const handleClick = function(evt:any) {
      simulationStore.stations.select(weatherStation);
    };

    if ((weatherStation.lat == null) || (weatherStation.long == null)) {
      return null;
    }

    const center = { lat: weatherStation.lat, lng: weatherStation.long };
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
