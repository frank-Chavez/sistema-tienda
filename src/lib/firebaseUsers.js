import { db } from './firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const usersRef = collection(db, 'usuarios');

export async function getUsers() {
  try {
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return [];
  }
}

export async function deleteUser(id) {
  await deleteDoc(doc(db, 'usuarios', id));
}
