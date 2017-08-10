import * as React from "react";
import { observer } from "mobx-react";
import { Map, TileLayer } from "react-leaflet";
import { LeafletMapMarker } from "./leaflet-map-marker";

import { IMapConfig } from "../models/map-config";
import { IWeatherStation } from "../models/weather-station";
import { simulationStore } from "../stores/simulation-store";

interface LeafletMapProps {
  mapConfig: IMapConfig | null;
  width: number;
  height: number;
  interaction: boolean;
  weatherStations: IWeatherStation[];
  update?: (lat: number, long: number, zoom: number) => void;
}

interface LeafletMapState {}

@observer
export class LeafletMapView extends React.Component<
  LeafletMapProps,
  LeafletMapState
> {
  constructor(props: LeafletMapProps, ctx: any) {
    super(props, ctx);
  }

  render() {
    const mapConfig = this.props.mapConfig;

    if (!mapConfig) {
      return <div />;
    }

    const center = { lat: mapConfig.lat, lng: mapConfig.long };
    const updateMap = (e: any) => {
      if (this.props.update) {
        const center = e.target.getCenter();
        const lat = center.lat;
        const long = center.lng;
        const zoom = e.target.getZoom();
        this.props.update(lat, long, zoom);
      }
    };
    updateMap.bind(this);
    const baseMap = (simulationStore.settings && simulationStore.settings.showBaseMap)
      ? <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      : null;

    return (
      <div>
        <Map
          center={center}
          onzoomend={updateMap}
          onmoveend={updateMap}
          zoom={mapConfig.zoom}
          width={this.props.width}
          height={this.props.height}
          zoomControl={this.props.interaction}
          attributionControl={false}
          dragging={this.props.interaction}
          doubleClickZoom={false}
          scrollWheelZoom={this.props.interaction}
          keyboard={this.props.interaction}
          style={{ width: this.props.width, height: this.props.height }}
        >
          {baseMap}
          {this.props.weatherStations.map(b => {
              const selectedStation = simulationStore.selectedStation,
                    selectedCallSign = selectedStation && selectedStation.callSign,
                    isSelected = b.callSign === selectedCallSign;
              return <LeafletMapMarker weatherStation={b} key={b.callSign} selected={isSelected}/>;
            }
          )}
        </Map>
      </div>
    );
  }
}
