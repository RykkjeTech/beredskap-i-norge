interface MapboxDirectionsOptions {
  styles?: Array<any>;
  accessToken?: string;
  api?: string;
  interactive?: boolean;
  profile?: string;
  alternatives?: boolean;
  congestion?: boolean;
  unit?: string;
  compile?: Function | null;
  geocoder?: {
    [key: string]: any;
  } | null;
  controls?: {
    inputs?: boolean;
    instructions?: boolean;
    profileSwitcher?: boolean;
  } | null;
  zoom?: number;
  language?: string;
  placeholderOrigin?: string;
  placeholderDestination?: string;
  flyTo?: boolean;
  exclude?: string | null;
  routePadding?: number | PaddingOptions;
}

interface PaddingOptions {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

declare module "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions" {
  export default class MapboxDirections {
    constructor(options: MapboxDirectionsOptions);
    onRemove(map: any): Control;
    interactive(state: boolean): MapboxDirections;
    getOrigin(): Object;
    setOrigin(query: Array<number> | string): MapboxDirections;
    getDestination(): Object;
    setDestination(query: Array<number> | string): MapboxDirections;
    reverse(): MapboxDirections;
    addWaypoint(index: number, waypoint: Array<number> | any): MapboxDirections;
    setWaypoint(index: number, waypoint: Array<number> | any): MapboxDirections;
    removeWaypoint(index: number): MapboxDirections;
    getWaypoints(): Array<any>;
    removeRoutes(): MapboxDirections;
    on(type: "origin" | "destination", fn: Function): MapboxDirections;
  }
}
