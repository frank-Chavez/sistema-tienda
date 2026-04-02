import { db } from './firebase'; // tu config
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// ==========================
// OBTENER CATEGORÍAS
// ==========================
export async function getCategories() {
  const snapshot = await getDocs(collection(db, 'categorias'));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ==========================
// CREAR CATEGORÍA
// ==========================
export async function createCategory(category) {
  await addDoc(collection(db, 'categorias'), category);
}

// ==========================
// ELIMINAR CATEGORÍA
// ==========================
export async function deleteCategory(id) {
  await deleteDoc(doc(db, 'categorias', id));
}
