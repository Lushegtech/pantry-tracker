// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8ezYVSAyyseqT9UdMX1fKEjtYXezf5HY",
  authDomain: "pantry-tracker-ca36f.firebaseapp.com",
  projectId: "pantry-tracker-ca36f",
  storageBucket: "pantry-tracker-ca36f.appspot.com",
  messagingSenderId: "876634472951",
  appId: "1:876634472951:web:054758f9a754c1f5512ef2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);