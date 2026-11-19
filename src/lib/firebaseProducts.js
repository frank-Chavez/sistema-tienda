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

/** Suma (o resta, con número negativo) unidades al stock de un producto. */
export async function adjustStock(productId, delta) {
  const productRef = doc(db, 'productos', productId);
  const productSnap = await getDoc(productRef);
  if (!productSnap.exists()) return;

  const currentStock = Number(productSnap.data().stock) || 0;
  const newStock = Math.max(0, currentStock + delta);
  const update = { stock: newStock };
  if (newStock === 0) update.estado = 'inactivo';
  else if (currentStock === 0 && delta > 0) update.estado = 'activo';
  await updateDoc(productRef, update);
}
