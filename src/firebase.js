import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import useDoc from "./useDoc";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADtenQw5Yu6BMz5mxsySFZ7y29paRi59s",
  authDomain: "newone-8c9ec.firebaseapp.com",
  databaseURL: "https://newone-8c9ec.firebaseio.com",
  projectId: "newone-8c9ec",
  storageBucket: "newone-8c9ec.appspot.com",
  messagingSenderId: "665878915657",
  appId: "1:665878915657:web:7d1189f9a8818d0190ad98"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const rtdb = firebase.database();

export function setupPresence(user) {
  // a special ref in real time firebase

  const isOfflineRTDB = {
    state: "offline",
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  };
  const isOnlineRTDB = {
    state: "online",
    lastChanged: firebase.database.ServerValue.TIMESTAMP
  };

  const isOfflineFireStore = {
    state: "offline",
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  };
  const isOnlineFireStore = {
    state: "online",
    lastChanged: firebase.firestore.FieldValue.serverTimestamp()
  };

  const rtdbRef = rtdb.ref(`/status/${user.uid}`);
  const userDoc = db.doc(`/users/${user.uid}`);

  rtdb.ref(".info/connected").on("value", async snapshot => {
    if (snapshot.val() === false) {
      userDoc.update({
        status: isOfflineFireStore
      });
      return;
    }

    await rtdbRef.onDisconnect().set(isOfflineRTDB);

    rtdbRef.set(isOnlineRTDB);
    userDoc.update({
      status: isOnlineFireStore
    });
  });
}

export { db, firebase };
