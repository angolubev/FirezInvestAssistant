// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue,
  onChildAdded,
  remove,
  update,
  onChildChanged,
} from 'firebase/database';
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
    this.NAVBAR_LIST_ITEMS_HEADER = '/navbarListItems';
  }

  insertNavbarListItem(navbarListItem) {
    const r = ref(this.database, this.NAVBAR_LIST_ITEMS_HEADER);
    push(r, navbarListItem);
  }

  removeNavbarListItem(id) {
    const r = ref(this.database, `${this.NAVBAR_LIST_ITEMS_HEADER}/${id}`);
    remove(r);
  }

  editNavbarListItem(id, navbarListItem) {
    const r = ref(this.database, `${this.NAVBAR_LIST_ITEMS_HEADER}/${id}`);
    update(r, navbarListItem);
  }

  onNavbarListChange(callback) {
    const r = ref(this.database, this.NAVBAR_LIST_ITEMS_HEADER);
    console.log('onNavbarListChange');
    onValue(r, (snapshot) => {
      console.log('onValue');
      const navbarList = [];
      snapshot.forEach((item) => {
        const childData = item.val();
        console.log(childData);
        childData.id = item.key;
        navbarList.push(childData);
      });
      callback(navbarList);
    });
  }

  onNavbarListItemChange(callback) {
    const r = ref(this.database, this.NAVBAR_LIST_ITEMS_HEADER);
    console.log('onNavbarListItemChange');
    onChildChanged(r, (snapshot) => {
      console.log('onChildChanged');
      const childData = snapshot.val();
      console.log(childData);
      childData.id = snapshot.key;
      callback(childData);
    });
  }
}
