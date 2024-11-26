// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "penatalayan-db.firebaseapp.com",
  projectId: "penatalayan-db",
  storageBucket: "penatalayan-db.firebasestorage.app",
  messagingSenderId: "1088080132723",
  appId: "1:1088080132723:web:10142530ce625a0d998806",
  measurementId: "G-0EMNEVB2YZ",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { app, db }
