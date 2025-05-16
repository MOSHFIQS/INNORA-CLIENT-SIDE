'use client'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP18b-29kfg3Wuy72KAEpGhcDgKDZNrbw",
    authDomain: "innora-1.firebaseapp.com",
    projectId: "innora-1",
    storageBucket: "innora-1.firebasestorage.app",
    messagingSenderId: "878105704609",
    appId: "1:878105704609:web:12c0d1dea74ef694c2d8e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
