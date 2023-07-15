"use client";
/* eslint-disable @next/next/no-img-element */
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
  use,
} from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  MapRef,
  IControl,
  MapEvent,
  GeolocateResultEvent,
} from "react-map-gl";
import { shelters } from "./shelters";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: "pointer",
  fill: "#d00",
  stroke: "none",
};

const Pin: React.FC<{
  size?: number;
}> = ({ size = 20 }) => {
  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  );
};

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const MapComponent: React.FC = () => {
  const [popupInfo, setPopupInfo] = useState<{
    longitude: string;
    latitude: string;
    adress: string;
    capacity: number;
    // image: string;
  } | null>(null);

  const pins = useMemo(
    () =>
      shelters.features.map(({ geometry, properties }, index) => {
        const [longitude, latitude] = geometry.coordinates;
        return (
          <Marker
            key={`marker-${index}`}
            longitude={longitude}
            latitude={latitude}
            // anchor="bottom"
            onClick={(e) => {
              // If we let the click event propagates to the map, it will immediately close the popup
              // with `closeOnClick: true`
              e.originalEvent.stopPropagation();
              setPopupInfo({
                longitude: String(longitude),
                latitude: String(latitude),
                adress: properties.adresse,
                capacity: properties.plasser,
                // image: properties.areal,
              });
            }}
          >
            <Pin
              size={
                properties.plasser > 1000
                  ? 30
                  : properties.plasser > 500
                  ? 25
                  : 20
              }
            />
          </Marker>
        );
      }),
    []
  );

  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  const directions = useMemo(
    () =>
      new MapboxDirections({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        unit: "metric",
        profile: "mapbox/driving",
      }),
    []
  );

  const mapRef = useRef<MapRef>(null);
  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.addControl(directions as any, "bottom-left");
  }, [directions]);

  // useEffect(() => {
  //   if (end) {
  //     directions.setDestination(end);
  //   }
  // }, [end, directions]);

  return (
    <div
      id="map"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        initialViewState={{
          latitude: 60,
          longitude: 10,
          zoom: 3.5,
          bearing: 0,
          pitch: 0,
        }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={TOKEN}
        style={{
          height: "100vh",
          width: "100vw",
        }}
        onClick={(e) => {
          // If we let the click event propagates to the map, it will immediately close the popup
          // with `closeOnClick: true`
          e.originalEvent.stopPropagation();
          setPopupInfo(null);
        }}
      >
        <GeolocateControl
          position="top-left"
          onGeolocate={(evt: GeolocateResultEvent) => {
            directions.setOrigin([evt.coords.longitude, evt.coords.latitude]);
          }}
        />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        {pins}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <p
                style={{
                  color: "black",
                }}
              >
                Adresse: {popupInfo.adress}
              </p>
              <p
                style={{
                  color: "black",
                }}
              >
                Kapasitet: {popupInfo.capacity}
              </p>
            </div>
            <button
              onClick={() =>
                directions.setDestination([
                  Number(popupInfo.longitude),
                  Number(popupInfo.latitude),
                ])
              }
            >
              Gå til {popupInfo.adress}
            </button>

            <img width="100%" src={""} alt="" />
          </Popup>
        )}
      </Map>
    </div>
  );
};
