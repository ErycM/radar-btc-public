import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore().collection("/store_map");

const getAll = () => {
  return db;
};

const create = (data) => {
  return db.add(data);
};

const createDoc = (data,doc) => {
  return db.doc(doc).set(data);
};

const update = (id, value) => {
  return db.doc(id).update(value);
};


const remove = (id) => {
  return db.doc(id).delete();
};

const getUser = () => {
  return firebase.auth().currentUser;
}

export const FirestoreService = {
  getAll,
  create,
  update,
  remove,
  getUser,
  createDoc
};

export default firebase;
