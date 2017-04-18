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
  update?: (lat:number,long:number, zoom:number) => void
}

interface LeafletMapState {}

@observer
export class LeafletMapView extends React.Component<LeafletMapProps, LeafletMapState> {
  constructor(props:LeafletMapProps, ctx:any){
    super(props, ctx);
  }


renderMarker(basestation:Basestation) {
  let predictedTemp= 0;
  let actualTemp = 0;
  if (basestation && basestation.data && basestation.data.length > dataStore.frameNumber) {
    actualTemp = basestation.data[dataStore.frameNumber].value;
    predictedTemp = basestation.data[0].value; // TODO: again fake for now.
  }
  const precision=0;
  const difTemp = Math.abs(actualTemp - predictedTemp);
  const predictedTempString = predictedTemp.toFixed(precision);
  const actualTempString = actualTemp.toFixed(precision);
  const difTempString  = difTemp.toFixed(precision);
  const center = {lat:basestation.lat, lng:basestation.long};
  const key = basestation.id;
  const icon = new DivIcon({
    html: `
      <div class "divIconContent" >
        <div>
          <span class="predictTemp">${predictedTempString}°</span>
            /
          <span class="actualTemp">${actualTempString}°</span>
        </div>
        <div class="difTemp">Δ${difTempString}&#8457</span>
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

    const center = {lat: mapConfig.lat, lng: mapConfig.long};
    const updateMap = (e:any) => {
      if(this.props.update) {
        const center = e.target.getCenter();
        const lat = center.lat;
        const long = center.lng;
        const zoom   = e.target.getZoom();
        this.props.update(lat,long,zoom);
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
          style={{width: this.props.width, height: this.props.height}}
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