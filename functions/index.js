const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.removeUser = functions.auth
  .user()
  .onDelete(async (user) => {
    const db = admin.firestore();

    const batch = db.batch();

    // delete user games
    const gamesSnapshot = await db.collection('games').where('ownerID', '==', user.uid).get();
    gamesSnapshot.forEach((doc) => batch.delete(doc.ref));
    
    return batch.commit();
  });

  exports.removeGameDeck = functions.firestore
    .document('games/{gameId}')
    .onDelete((snapshot, context) => {
      return admin.firestore().collection('decks').doc(context.params.gameId).delete();
    });