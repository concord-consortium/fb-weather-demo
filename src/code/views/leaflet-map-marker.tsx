import * as React from "react";
import { observer } from "mobx-react";
import { Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { PredictionType } from "../models/prediction";
import { simulationStore } from "../models/simulation";
import { IWeatherStation } from "../models/weather-station";
import * as _ from "lodash";

interface LeafletMapMarkerProps {
  weatherStation: IWeatherStation;
  selected: boolean;
}

interface LeafletMapMarkerState {}

@observer
export class LeafletMapMarker extends React.Component<
                                        LeafletMapMarkerProps,
                                        LeafletMapMarkerState> {
  constructor(props: LeafletMapMarkerProps, ctx: any) {
    super(props, ctx);
  }

  get tempPrediction() {
    const simulation = simulationStore.selected,
          weatherStation = this.props.weatherStation,
          predictions = simulation && simulation.predictions,
          stationPredictions = predictions && predictions.predictionsFor(weatherStation);
    return _.find(stationPredictions, (p) => p.type === PredictionType.eTemperature);
  }

  get predictedTemp() {
    return (this.tempPrediction && (this.tempPrediction.type === PredictionType.eTemperature))
              ? this.tempPrediction.predictedValue : null;
  }

  get actualTemp() {
    const weatherStation = this.props.weatherStation;
    return weatherStation.temperature;
  }

  get diffTemp() {
    return (this.predictedTemp != null) && (this.actualTemp != null)
      ? this.predictedTemp - this.actualTemp
      : null;
  }

  get windSpeed() {
    return this.props.weatherStation.windSpeed;
  }

  get windDirection() {
    return this.props.weatherStation.windDirection;
  }

  predictedTempDiv() {
    const simulation = simulationStore.selected,
          showPredictions = simulation && simulation.settings && simulation.settings.showPredictions;
    if(showPredictions && this.tempPrediction) {
      if ((this.predictedTemp != null) && isFinite(this.predictedTemp)) {
        const predictedTempString = simulation &&
                                      simulation.formatTemperature(this.predictedTemp, { withDegree: true });
        return `<span class="predictTemp">${predictedTempString}</span> /`;
      }
    }
    return "";
  }

  actualTempDiv() {
    const simulation = simulationStore.selected,
          showTempValues = simulation && simulation.settings && simulation.settings.showTempValues;
    if (showTempValues && (this.actualTemp != null) && isFinite(this.actualTemp)) {
      const actualTempString = simulation && simulation.formatTemperature(this.actualTemp, { withDegree: true });
      return `<span class="actualTemp">${actualTempString}</span>`;
    }
    return "";
  }

  diffTempDiv() {
    const simulation = simulationStore.selected,
          showDeltaTemp = simulation && simulation.settings && simulation.settings.showDeltaTemp;
    if (showDeltaTemp && (this.diffTemp != null) && isFinite(this.diffTemp)) {
      const options = { asDifference: true, withDegreeUnit: true },
            diffTempString = simulation && simulation.formatTemperature(this.diffTemp, options);
      return `<div class="diffTemp">${diffTempString}</div>`;
    }
    return "";
  }

  windSpeedDiv() {
    const simulation = simulationStore.selected,
          settings = simulation && simulation.settings,
          showWindValues = settings && settings.showWindValues,
          windSpeedUnit = (settings && settings.windSpeedUnit) || "";
    if (showWindValues && (this.windSpeed != null) && isFinite(this.windSpeed)) {
      const windSpeedStr = simulation && simulation.formatWindSpeed(this.windSpeed, {withUnit: false }),
            kFourPerEmSpace = '\u2005';
      return `<span class="windSpeed">${windSpeedStr}</span>` +
            `<span class="windSpeedUnit">${kFourPerEmSpace + windSpeedUnit}</span>`;
    }
    return "";
  }

  windDirectionDiv() {
    const simulation = simulationStore.selected,
          showWindValues = simulation && simulation.settings && simulation.settings.showWindValues;
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
    const simulation = simulationStore.selected,
          showStationNames = simulation && simulation.settings && simulation.settings.showStationNames;
    if (showStationNames) {
      return `<div>${this.props.weatherStation.callSign}</div>`;
    }
    return "";
  }

  render() {
    const simulation = simulationStore.selected;
    const weatherStation = this.props.weatherStation;
    const handleClick = function(evt:any) {
      const simulationStations = simulation && simulation.stations;
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
      iconSize: [54, iconHeight],
      className: classes
    });

    return <Marker onclick={handleClick} position={center} icon={icon} key={key} />;
  }
}
