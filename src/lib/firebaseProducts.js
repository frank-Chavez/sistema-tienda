import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

import { db } from './firebase.js';

const productsCollection = collection(db, 'productos');

export async function getProducts() {
  try {
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}

export async function createProduct(product) {
  await addDoc(productsCollection, product);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, 'productos', id));
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, 'productos', id), data);
}

export async function updateStock(productId, quantity) {
  const productRef = doc(db, 'productos', productId);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const currentStock = productSnap.data().stock || 0;
    const newStock = Math.max(0, currentStock - quantity);
    const estado = newStock === 0 ? 'inactivo' : 'activo';

    await updateDoc(productRef, { stock: newStock, estado });
  }
}
