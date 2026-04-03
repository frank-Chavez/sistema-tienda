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
  try {
    const snapshot = await getDocs(ordersRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    return [];
  }
}

export async function updateOrderStatus(id, estado) {
  await updateDoc(doc(db, 'pedidos', id), { estado });
}

export async function deleteOrder(id) {
  await deleteDoc(doc(db, 'pedidos', id));
}
