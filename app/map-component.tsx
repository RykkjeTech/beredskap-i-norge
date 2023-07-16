"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo, useRef, useCallback } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  MapRef,
  GeolocateResultEvent,
} from "react-map-gl";
import { shelters } from "./shelters";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import Link from "next/link";
import { Session } from "@supabase/auth-helpers-nextjs";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const Pin: React.FC<{
  size?: number;
  fill?: string;
}> = ({ size = 20, fill = "#000000" }) => {
  return (
    <svg
      height={size}
      viewBox="0 0 24 24"
      style={{
        cursor: "pointer",
        stroke: "none",
        fill,
      }}
    >
      <path d={ICON} />
    </svg>
  );
};

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const MapComponent: React.FC<{
  session: Session | null;
}> = ({ session }) => {
  const user = session?.user;
  console.log("🚀 ~ file: map-component.tsx:50 ~ user:", user);
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
        interactive: false,
        controls: {
          instructions: false,
        },
        flyTo: false,
      }),
    []
  );

  const mapRef = useRef<MapRef>(null);
  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.addControl(directions as any, "bottom-left");
  }, [directions]);

  directions.on("origin", (e: any) => {
    setStart(e.feature.geometry.coordinates);
  });

  directions.on("destination", (e: any) => {
    setEnd(e.feature.geometry.coordinates);
  });

  return (
    <div
      id="map"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Link href={session?.user ? "/account" : "/login"}>
        <div className="rounded absolute top-0 right-0 z-10 p-2 bg-white w-20 h-10">
          <div className="flex flex-col items-center justify-center text-black">
            {session?.user ? "Min side" : "Logg inn"}
          </div>
        </div>
      </Link>

      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        initialViewState={{
          latitude: 62,
          longitude: 10,
          zoom: 4.5,
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
        maxZoom={0}
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
        {start && (
          <Marker longitude={start[0]} latitude={start[1]} key="marker-start">
            <Pin size={30} fill="#00d" />
          </Marker>
        )}
        {end && (
          <Marker longitude={end[0]} latitude={end[1]} key="marker-end">
            <Pin size={30} fill="#d00" />
          </Marker>
        )}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={+popupInfo.longitude}
            latitude={+popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
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
              onClick={() => {
                directions.setDestination([
                  +popupInfo.longitude,
                  +popupInfo.latitude,
                ]);
                setEnd([+popupInfo.longitude, +popupInfo.latitude]);
              }}
              style={{
                backgroundColor: "#d00",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
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
