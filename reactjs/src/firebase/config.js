import firebase from 'firebase/compat/app';
//import { initializeApp } from 'firebase/app';
//import { getStorage } from 'firebase/storage'
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: process.env.FB_apiKey,
  authDomain: process.env.FB_authDomain,
  databaseURL: process.env.FB_databaseURL,
  projectId: process.env.FB_projectId,
  storageBucket: process.env.FB_storageBucket,
  messagingSenderId: process.env.FB_messagingSenderId,
  appId: process.env.FB_appId,
  measurementId: process.env.FB_measurementId
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
// Get a non-default Storage bucket
var storage = firebase.app().storage("gs://thienproject-2a65d.appspot.com");
//const storage = firebase.storage(app);
//const storage = getStorage(app);

export { storage };