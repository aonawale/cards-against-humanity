const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.removeGameDeck = functions.firestore
  .document('games/{gameId}')
  .onDelete((snapshot, context) => {
    return admin.firestore().collection('decks').doc(context.params.gameId).delete();
  });