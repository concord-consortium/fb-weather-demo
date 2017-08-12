import * as React from "react";
import { observer } from "mobx-react";
import { Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { PredictionType } from "../models/prediction";
import { simulationStore } from "../stores/simulation-store";
import { IWeatherStation, kDefaultPrecision } from "../models/weather-station";

interface LeafletMapMarkerProps {
  weatherStation: IWeatherStation;
  selected: boolean;
}

interface LeafletMapMarkerState {}

@observer
export class LeafletMapMarker extends React.Component<
  LeafletMapMarkerProps,
  LeafletMapMarkerState
> {
  constructor(props: LeafletMapMarkerProps, ctx: any) {
    super(props, ctx);
  }

  get prediction() {
    const weatherStation = this.props.weatherStation;
    const predictions = simulationStore.predictions,
          prediction = predictions && predictions.predictionFor(weatherStation);
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

  get windSpeed() {
    return this.props.weatherStation.windSpeed;
  }

  get windDirection() {
    return this.props.weatherStation.windDirection;
  }

  predictedTempDiv() {
    const showPredictions = simulationStore.settings && simulationStore.settings.showPredictions;
    if(showPredictions && this.prediction) {
      if ((this.predictedTemp != null) && isFinite(this.predictedTemp)) {
        const predictedTempString = this.predictedTemp.toFixed(kDefaultPrecision.temperature);
        return `<span class="predictTemp">${predictedTempString}°</span> /`;
      }
    }
    return "";
  }

  actualTempDiv() {
    const showTempValues = simulationStore.settings && simulationStore.settings.showTempValues;
    if (showTempValues && (this.actualTemp != null) && isFinite(this.actualTemp)) {
      const actualTempString = this.actualTemp.toFixed(kDefaultPrecision.temperature);
      return `<span class="actualTemp">${actualTempString}°</span>`;
    }
    return "";
  }

  diffTempDiv() {
    const showDeltaTemp = simulationStore.settings && simulationStore.settings.showDeltaTemp;
    if (showDeltaTemp && (this.diffTemp != null) && isFinite(this.diffTemp)) {
      let diffTempString = this.diffTemp.toFixed(kDefaultPrecision.temperature);
      diffTempString = diffTempString === "0"
                        ? diffTempString
                        : (this.diffTemp < 0 ? diffTempString : `+${diffTempString}`);
      return `<div class="diffTemp">${diffTempString}&#8457</div>`;
    }
    return "";
  }

  windSpeedDiv() {
    const showWindValues = simulationStore.settings && simulationStore.settings.showWindValues;
    if (showWindValues && (this.windSpeed != null) && isFinite(this.windSpeed)) {
      const windSpeedStr = this.windSpeed.toFixed(kDefaultPrecision.windSpeed);
      return `<span class="windSpeed">${windSpeedStr}</span>`;
    }
    return "";
  }

  windDirectionDiv() {
    const showWindValues = simulationStore.settings && simulationStore.settings.showWindValues;
    if (showWindValues && (this.windDirection != null)) {
      const classes = `"windDirection"`,
            rotation = this.windDirection + 90,
            style = `"transform: rotate(${rotation}deg); display: inline-block; font-size: 16px"`,
            arrowChar = this.windDirection ? "\u279B" : "\xA0";
      return `<span class=${classes} style=${style}>${arrowChar}</span>`;
    }
    return "";
  }

  callsignDiv() {
    const showStationNames = simulationStore.settings && simulationStore.settings.showStationNames;
    if (showStationNames) {
      return `<div>${this.props.weatherStation.callSign}</div>`;
    }
    return "";
  }

  render() {
    const weatherStation = this.props.weatherStation;
    const handleClick = function(evt:any) {
      const simulationStations = simulationStore.stations;
      if (simulationStations) {
        simulationStations.select(weatherStation);
      }
    };

    if ((weatherStation.lat == null) || (weatherStation.long == null)) {
      return null;
    }

    const center = { lat: weatherStation.lat, lng: weatherStation.long };
    const key = this.props.weatherStation.id;
    let classes ="divIcon";
    const selected = this.props.selected,
          divPredictedTemp = this.predictedTempDiv(),
          divActualTemp = this.actualTempDiv(),
          divDiffTemp = this.diffTempDiv(),
          divWindSpeed = this.windSpeedDiv(),
          divWindDirection = this.windDirectionDiv(),
          iconHeight = 40 + (divDiffTemp ? 14 : 0)
                          + (divWindSpeed || divWindDirection ? 14 : 0);

    if(selected) {
      classes = `${classes} selected`;
    }

    const icon = new DivIcon({
      html: `
        <div class "divIconContent" >
          <div>
            ${divPredictedTemp}
            ${divActualTemp}
          </div>
          ${divDiffTemp}
          <div style="margin-top:-2px; margin-bottom:-2px">
            ${divWindSpeed}
            ${divWindDirection}
          </div>
          ${this.callsignDiv()}
        </div>`,
      iconSize: [50, iconHeight],
      className: classes
    });

    return <Marker onclick={handleClick} position={center} icon={icon} key={key} />;
  }
}
