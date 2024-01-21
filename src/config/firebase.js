import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSwiTkaKpMpugkHiwfVfmF3gvcUqUFYYE",
  authDomain: "hackathon-28b28.firebaseapp.com",
  databaseURL: "https://hackathon-28b28-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hackathon-28b28",
  storageBucket: "hackathon-28b28.appspot.com",
  messagingSenderId: "21058829054",
  appId: "1:21058829054:web:78014b25e9ae698ce943af",
  measurementId: "G-1WFDHXLNVK"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
