import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBnmAqdDCw3qQmMo6jQc6auBvnORe0_cU8",
  authDomain: "storyloom-firebase.firebaseapp.com",
  projectId: "storyloom-firebase",
  storageBucket: "storyloom-firebase.firebasestorage.app",
  messagingSenderId: "651442074280",
  appId: "1:651442074280:web:e5a4857e7c610e66d7489d",
  measurementId: "G-VCG50NWEWY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
