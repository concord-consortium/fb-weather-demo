import * as React from "react";
import { observer } from "mobx-react";
import { Map, TileLayer, Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { dataStore } from "../data-store";
import { MapConfig } from "../map-config";
import { Basestation } from "../basestation";
import { LeafletMapMarker } from "./leaflet-map-marker";
interface LeafletMapProps {
  mapConfig: MapConfig | null;
  width: number;
  height: number;
  interaction: boolean;
  baseStations: Basestation[];
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
          <TileLayer
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {this.props.baseStations.map(b =>
            <LeafletMapMarker basestation={b} key={b.id} />
          )}
        </Map>
      </div>
    );
  }
}
