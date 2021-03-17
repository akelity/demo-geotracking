import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { Loader } from "google-maps";

import { Position, Markers, Data } from './types';
import { activeWatchPosition } from './geoUtils';
import { login, logout, watchDatabase, watchLogin } from './firebaseUtils';

const mapsKey = "";
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
const authProvider = new firebase.auth.GoogleAuthProvider();

// Random Position Offset
const randomOffset = {
  lat: Math.floor(Math.random() * 1000) - 500,
  lng: Math.floor(Math.random() * 1000) - 500
} as Position;

let map: google.maps.Map<HTMLElement>;
let markers: Markers = {};

const doLogin = (user: firebase.User): void => {
  loginButton.hidden = true;
  logoutButton.hidden = false;
  const userRef = database.ref('users/' + user.uid);
  activeWatchPosition(userRef, user.uid, randomOffset);
  watchDatabase(database, updateMarkers);
}

const doLogout = (): void => {
  loginButton.hidden = false;
  logoutButton.hidden = true;
  cleanMarkers();
}

const loadMap = async (elementId: string): Promise<void> => {
  const loader = new Loader(mapsKey);
  const google = await loader.load();
  const mapRef = document.getElementById(elementId) as HTMLElement;
  map = new google.maps.Map(mapRef, {
    center: {lat: 45.464664, lng: 9.188540},
    zoom: 6,
  });
}

const updateMarkers = (data: Data) => {
  if(map) {
    const savedIds = Object.keys(data);
    const markerIds = Object.keys(markers);

    // Update Pins
    savedIds.filter(x => markerIds.includes(x)).forEach(id => {
      const { lat, lng } = data[id];
      markers[id].setPosition({lat, lng});
    });

    // Add Pins
    savedIds.filter(x => !markerIds.includes(x)).forEach(id => {
      const { lat, lng } = data[id];
      markers[id] = addMarker({lat, lng});
    });

    // Remove Pins
    markerIds.filter(x => !savedIds.includes(x)).forEach(id => {
      removeMarker(id);
    });
  }
}

const addMarker = (position: Position) => {
  return new google.maps.Marker({position, map});
}

const removeMarker = (id: string) => {
  markers[id].setMap(null);
  delete markers[id];
}

const cleanMarkers = () => {
  Object.keys(markers).forEach(id => {
    removeMarker(id);
  });
}

const loadGeoTrack = async () => {
  loadMap('map');
  watchLogin(auth, doLogin, doLogout);
  console.log("App Loaded!");
}

const loginButton = document.getElementById("loginButton") as HTMLElement;
const logoutButton = document.getElementById("logoutButton") as HTMLElement;
logoutButton.addEventListener("click", () => logout(auth));
loginButton.addEventListener("click", () => login(auth, authProvider));

loadGeoTrack().then(() => { console.log("Ready") });