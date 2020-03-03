const admin = require("firebase-admin");

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.onUserStatusChange = require("./triggers/onUserStatusChanged");

exports.helloWorld = require("./routes/helloWorld");

exports.onCleverbotMessage = require("./triggers/onCleverbotMessage");
