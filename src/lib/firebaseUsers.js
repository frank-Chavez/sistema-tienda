import { db } from './firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const usersRef = collection(db, 'usuarios');

export async function getUsers() {
  const snapshot = await getDocs(usersRef);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function deleteUser(id) {
  const ref = doc(db, 'usuarios', id);
  await deleteDoc(ref);
}
