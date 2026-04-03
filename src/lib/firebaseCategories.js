import { db } from './firebase.js';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export async function getCategories() {
  try {
    const snapshot = await getDocs(collection(db, 'categorias'));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
}

export async function createCategory(category) {
  await addDoc(collection(db, 'categorias'), category);
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, 'categorias', id));
}
