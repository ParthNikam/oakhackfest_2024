import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD83ipeT7odWbiePmnUpTwRr-ORRqDaKDI",
  authDomain: "hello-world-30b0a.firebaseapp.com",
  databaseURL: "https://hello-world-30b0a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hello-world-30b0a",
  storageBucket: "hello-world-30b0a.appspot.com",
  messagingSenderId: "999977495484",
  appId: "1:999977495484:web:2b57da153faf437e6c19b9",
  measurementId: "G-LGMD1PKX0Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
