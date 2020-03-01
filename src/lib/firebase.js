import * as firebase from 'firebase/app';
import 'firebase/auth';
import * as firebaseui from 'firebaseui';

const firebaseConfig = {
  apiKey: 'AIzaSyDNEIRxIGiX25ogNLDAgs0ItvHJQj9A3Q4',
  authDomain: 'cah-dev-86dc7.firebaseapp.com',
  databaseURL: 'https://cah-dev-86dc7.firebaseio.com',
  projectId: 'cah-dev-86dc7',
  storageBucket: 'cah-dev-86dc7.appspot.com',
  messagingSenderId: '708919127947',
  appId: '1:708919127947:web:87b610b4902a868d6bc98e',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseUI = new firebaseui.auth.AuthUI(firebaseApp.auth());
