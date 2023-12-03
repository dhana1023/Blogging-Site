
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

let firebaseConfig = {
    apiKey: "AIzaSyAO61RtoXff9FNkZOLBT_RTzHC1huvMb4A",
    authDomain: "blogging-site-37064.firebaseapp.com",
    projectId: "blogging-site-37064",
    storageBucket: "blogging-site-37064.appspot.com",
    messagingSenderId: "324351220392",
    appId: "1:324351220392:web:7fc5074877a93143d0009d"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, firebaseConfig, getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged};




