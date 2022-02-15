import {
  ref,
  push,
  remove,
  update,
  onValue,
  onChildChanged,
  set,
  get,
  query
} from 'firebase/database';

export default class FirezFirebaseListHandler {
  constructor(listName, database) {
    this.listName = listName;
    this.database = database;
  }

  insertListItem(listItem) {
    const r = ref(this.database, this.listName);
    push(r, listItem);
  }

  removeListItem(id) {
    const r = ref(this.database, `${this.listName}/${id}`);
    remove(r);
  }

  updateListItem(newListItem) {
    const r = ref(this.database, `${this.listName}/${newListItem.id}`);
    set(r, newListItem);
  }

  onListChange(callback) {
    const r = ref(this.database, this.listName);
    onValue(r, (snapshot) => {
      const updatedList = [];
      snapshot.forEach((item) => {
        const childData = item.val();
        childData.id = item.key;
        updatedList.push(childData);
      });
      callback(updatedList);
    });
  }

  onListItemChange(callback) {
    const r = ref(this.database, this.listName);
    onChildChanged(r, (snapshot) => {
      const updatedListItem = snapshot.val();
      updatedListItem.id = snapshot.key;
      callback(updatedListItem);
    });
  }

  getListItemByField(fieldName, value, callback) {
    console.log('getListItemByField');
    const r = ref(this.database, this.listName);
    const q = query(r);
    get(q).then(snapshot => {
      console.log(snapshot);
      let itemToReturn = null;
      snapshot.forEach((item) => {
        const childData = item.val();
        if (childData[fieldName] === value) {
          itemToReturn = childData;
        }
      });
      callback(itemToReturn);
    });
  }
}
