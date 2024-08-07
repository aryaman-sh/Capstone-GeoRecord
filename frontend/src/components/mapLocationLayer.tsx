import { useEffect, useState } from "react";
import { GeoJSON, useMap, useMapEvent } from "react-leaflet";
import { GeoJsonObject } from "geojson";
import useLocationApi from "../api/location";
import { useNavigate } from "react-router-dom";

type LeafletMouseEvent = {
  originalEvent: any;
  containerPoint: Point;
  layerPoint: Point;
  latlng: any;
  type: "mouseover";
  target: any;
  sourceTarget: any;
};

type Point = {
  x: number;
  y: number;
};

const polygonStyle = { color: "#4f46e5", fillColor: "#4f46e5" };

export default function MapLocationLayer() {
  const [geoJSONData, setGeoJSONData] = useState<GeoJsonObject>({
    type: "FeatureCollection",
    features: [],
  });

  const locationApi = useLocationApi();
  const navigate = useNavigate();
  const map = useMap();

  // Function that updates the geoJSON describing the locations
  const updateMapGeoJSON = async (mapBounds: {
    _southWest: { lng: number; lat: number };
    _northEast: { lng: number; lat: number };
  }) => {
    const { data, error } = await locationApi.locationQuery(
      mapBounds._southWest.lng,
      mapBounds._southWest.lat,
      mapBounds._northEast.lng,
      mapBounds._northEast.lat,
    );
    if (error) {
      // TODO! error handling
      console.error(error);
    } else {
      setGeoJSONData(data);
    }
  };

  // Load in locations on load
  useEffect(() => {
    updateMapGeoJSON(map.getBounds());
  }, []);

  // Load in locations on map movement
  useMapEvent({
    dragend: (event: any) => {
      updateMapGeoJSON(event.target.getBounds());
    },
    zoomend: (event: any) => {
      updateMapGeoJSON(event.target.getBounds());
    },
  });

  const onEachFeature = (
    feature: {
      geometry: any;
      properties: {
        id: string;
        name: string;
        owner_id: string;
      };
    },
    layer: any,
  ) => {
    if (feature.properties) {
      layer.bindPopup(`${feature.properties.name}`);
    }
    layer.on({
      mouseover: function () {
        this.setStyle({
          fillColor: "#c7d2fe",
        });
      },
      mouseout: function () {
        this.setStyle(polygonStyle);
      },
      click: () => {
        const bounds = layer.getBounds();
        map.fitBounds(bounds);
        navigate(`/${feature.properties.id}`);
      },
    });
  };

  // Note: to force the GeoJson layer to be reactive we give it a data-dependent key
  // In future we should find a fast way to hash this but for now stringifying the data works.
  return (
    <GeoJSON
      key={JSON.stringify(geoJSONData)}
      data={geoJSONData}
      onEachFeature={onEachFeature}
      pathOptions={polygonStyle}
    />
  );
}