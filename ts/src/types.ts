interface Position {
    lat: number;
    lng: number;
}

interface Markers {
    [index: string]: google.maps.Marker
}

interface Data {
    [index: string]: Position
}

interface RandomOffset {
    lat: number;
    lng: number;
}

interface Options {
    readonly coords: Coordinates,
    readonly randomOffset: {
        lat: number;
        lng: number;
    }
}



export {
    Position,
    Markers,
    Data,
    Options,
    RandomOffset
}