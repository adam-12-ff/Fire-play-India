// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRJNantaz_gjopXsAFh3wlQY_vxF9kCmE",
  authDomain: "fireplay-arena-4ll8k.firebaseapp.com",
  databaseURL: "https://fireplay-arena-4ll8k-default-rtdb.firebaseio.com",
  projectId: "fireplay-arena-4ll8k",
  storageBucket: "fireplay-arena-4ll8k.firebasestorage.app",
  messagingSenderId: "507600271529",
  appId: "1:507600271529:web:e3bbad77125eaa231951b8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
