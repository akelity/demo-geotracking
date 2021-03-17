import firebase from "firebase";

import { Options, Position, RandomOffset } from './types';


const offsetPosition = (options: Options): Position => {
    const {coords : { latitude, longitude }, randomOffset} = options;
    //Earth’s radius (aprox)
    const R = 6378137;
    //Coordinate offsets in radians
    const deltaLatRadius = randomOffset.lat/R;
    const deltaLngRadius = randomOffset.lng/(R*Math.cos(Math.PI*longitude/180));
    //Return OffsetPosition coords with offset
    return {
        lat: latitude + deltaLatRadius * 180/Math.PI,
        lng: longitude + deltaLngRadius * 180/Math.PI
    }
}

const activeWatchPosition = (userRef: firebase.database.Reference, uid: string, randomOffset: RandomOffset) => {
    if ("geolocation" in navigator) {
        console.log("La Geolocalizzazione è disponibile!");

        navigator.geolocation.watchPosition((position) => {
            console.log("Geolocation updated");
            const coordsWithOffset = offsetPosition({
                coords: position.coords,
                randomOffset
            });
            userRef.set({
                lat: coordsWithOffset.lat,
                lng: coordsWithOffset.lng,
                uid: uid
            }).then(() => { console.log("Geolocation saved!") });
        });
    } else {
        alert("La Geolocalizzazione NON è disponibile!")
    }
}


export {
    activeWatchPosition
}