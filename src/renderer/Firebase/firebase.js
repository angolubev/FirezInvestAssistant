// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getDatabase
} from 'firebase/database';
import FirezFirebaseListHandler from './list-handler';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA57kals2MAvtbYIJY_mA05ejpxumQFuoA',
  authDomain: 'firez-invest-assistant.firebaseapp.com',
  databaseURL:
    'https://firez-invest-assistant-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'firez-invest-assistant',
  storageBucket: 'firez-invest-assistant.appspot.com',
  messagingSenderId: '923250833784',
  appId: '1:923250833784:web:a2fa22420d4d2ab8c7308d',
  measurementId: 'G-LJJ6LJ240N',
};

export default class FirezFirebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.database = getDatabase(this.app);
    this.navbarListHandler = new FirezFirebaseListHandler('/navbarListItems', this.database);
    this.equitiesListHandler = new FirezFirebaseListHandler('/equities', this.database);
  }
}
