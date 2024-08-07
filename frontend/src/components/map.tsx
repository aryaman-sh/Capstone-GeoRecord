import 'leaflet/dist/leaflet.css'
import {MapContainer, Marker, Popup, TileLayer, Polygon} from 'react-leaflet'
import L from 'leaflet'
import MarkerClusterGroup from "react-leaflet-cluster";
import {MapLibreTileLayer} from "./MapLibreTileLayer.tsx";
import Search from './searchBar.tsx';
import { useEffect, useRef } from 'react';
import MapLocationLayer from './mapLocationLayer.tsx'

delete L.Icon.Default.prototype._getIconUrl;

/*L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});*/

export default function Map(){
  const polygon = [
    [-27.49736739085346, 153.01206027531853],
    [-27.496789950816307, 153.01424840417872],
    [-27.497767930235526, 153.01406489380034],
    [-27.498086382631744, 153.01281191085573]
  ]

  /*
  const mapRef = useMap();

  useEffect(() => {
    console.log('map center:', map.getCenter())
  })
  */

  return (
  <>
    <Search />
    <MapContainer
      className=""
      style={{height: "calc(100vh - 4rem)"}}
      center={[-27.497581662147017, 153.0133274488911]}
      zoom={17}
      minZoom={3}
      maxZoom={18}
      zoomControl={false}
      scrollWheelZoom={true}>
      <TileLayer
        attribution=''
        //url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*<Polygon pathOptions={{color: "purple"}} positions={polygon} />*/}
      <MapLocationLayer />
    </MapContainer>
    </>
  );
}
