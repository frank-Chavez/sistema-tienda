import { db } from './firebase.js';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';

const ordersRef = collection(db, 'pedidos');

export async function createOrder(orderData) {
  try {
    const order = {
      ...orderData,
      fecha: Timestamp.now(),
      estado: 'pendiente',
    };
    const docRef = await addDoc(ordersRef, order);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creando pedido:', error);
    return { success: false, error: error.message };
  }
}

export async function getOrders() {
  const snapshot = await getDocs(ordersRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updateOrderStatus(id, estado) {
  const ref = doc(db, 'pedidos', id);
  await updateDoc(ref, { estado });
}

export async function deleteOrder(id) {
  const ref = doc(db, 'pedidos', id);
  await deleteDoc(ref);
}
