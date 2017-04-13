import * as React from "react";
import { observer } from 'mobx-react';
import { Map, TileLayer, Marker} from "react-leaflet";
import { dataStore } from "../data-store";
import { MapConfig } from "../map-config";
interface LeafletMapProps {
  mapConfig: MapConfig | null
  width:number
  height:number
}
interface LeafletMapState {}

export class LeafletMapView extends React.Component<LeafletMapProps, LeafletMapState> {
  constructor(props:LeafletMapProps, ctx:any){
    super(props, ctx);
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
    updateMap.bind(this);

    return (
      <div>
        <Map center={{lat: mapConfig.lat, lng: mapConfig.long}} onzoomend={updateMap} onmoveend={updateMap}  zoom={mapConfig.zoom} width={this.props.width} height={this.props.height} >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {/*<Marker position={center}>
          </Marker>*/}
        </Map>
      </div>
    );
  }

}