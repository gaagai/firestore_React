const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

module.exports = functions.database
  .ref("status/{userId}")
  .onUpdate((change, context) => {
    const eventStatus = change.after.val();
    const userDoc = db.doc(`users/${context.params.userId}`);

    return change.after.ref.once("value").then(snapshot => {
      const status = snapshot.val();

      // make sure events come in the right order
      if (status.lastChanged > eventStatus.lastChanged) {
        return;
      }
      eventStatus.lastChanged = new Date(eventStatus.lastChanged);
      userDoc.update({
        status: eventStatus
      });
    });
  });
