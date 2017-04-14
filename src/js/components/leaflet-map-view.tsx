import * as React from "react";
import { observer } from 'mobx-react';
import { Map, TileLayer, Marker } from "react-leaflet";
import { DivIcon } from "leaflet";
import { dataStore } from "../data-store";
import { MapConfig } from "../map-config";
import { Basestation } from "../basestation";
interface LeafletMapProps {
  mapConfig: MapConfig | null
  width:number
  height:number
  interaction: boolean
  baseStations: Basestation[]
}

interface LeafletMapState {}

export class LeafletMapView extends React.Component<LeafletMapProps, LeafletMapState> {
  constructor(props:LeafletMapProps, ctx:any){
    super(props, ctx);
  }


renderMarker(basestation:Basestation) {
  let  predictedTemp = 0;
  let  actualTemp = 0;
  if (basestation && basestation.data && basestation.data.length > dataStore.frameNumber) {
    actualTemp = basestation.data[dataStore.frameNumber].value;
    predictedTemp = basestation.data[0].value; // TODO: again fake for now.
  }
  const difTemp = Math.abs(actualTemp - predictedTemp);
  const center = {lat:basestation.lat, lng:basestation.long};
  const key = basestation.id;
  const icon = new DivIcon({
    html: `
      <div class "divIconContent" >
        <div>
          <span class="predictTemp">${predictedTemp}°</span>
            /
          <span class="actualTemp">${actualTemp}°</span>
        </div>
        <div class="difTemp">Δ${difTemp}&#8457</span>
      </div>`,
    iconSize: [50,30],
    className: "divIcon"
  });

  return (
    <Marker position={center} icon={icon} key={key}>
    </Marker>
  );
}
render() {
    const mapConfig = this.props.mapConfig;

    if(!mapConfig) {
      return <div/>;
    }
    const updateMap = (e:any) => {
      const center = e.target.getCenter();
      const zoom   = e.target.getZoom();
        mapConfig.zoom = zoom;
        mapConfig.lat = center.lat;
        mapConfig.long= center.lng;;
        dataStore.saveMapConfig();
    };
    const center = {lat: mapConfig.lat, lng: mapConfig.long};
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
          dragging={this.props.interaction}
          doubleClickZoom={false}
          scrollWheelZoom={this.props.interaction}
          keyboard={this.props.interaction}
          >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          { this.props.baseStations.map( (b) => this.renderMarker(b) ) }
        </Map>
      </div>
    );
  }

}