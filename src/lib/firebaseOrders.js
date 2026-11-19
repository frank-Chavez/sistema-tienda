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
import { adjustStock } from './firebaseProducts.js';

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

/**
 * Cambia el estado de un pedido y ajusta el stock una sola vez.
 * Antes, pasar un pedido a "completado" varias veces descontaba el stock
 * cada vez. Ahora se guarda `stockDescontado` y, si el pedido deja de estar
 * completado, las unidades vuelven al inventario.
 */
export async function updateOrderStatus(order, estado) {
  const productos = Array.isArray(order.productos) ? order.productos : [];
  // Pedidos antiguos completados (sin el campo) ya descontaron su stock.
  let stockDescontado =
    order.stockDescontado ?? (order.estado || '').toLowerCase() === 'completado';

  if (estado === 'completado' && !stockDescontado) {
    for (const p of productos) {
      if (p?.id) await adjustStock(p.id, -(Number(p.cantidad) || 0));
    }
    stockDescontado = true;
  } else if (estado !== 'completado' && stockDescontado) {
    for (const p of productos) {
      if (p?.id) await adjustStock(p.id, Number(p.cantidad) || 0);
    }
    stockDescontado = false;
  }

  await updateDoc(doc(db, 'pedidos', order.id), { estado, stockDescontado });
}

export async function deleteOrder(id) {
  await deleteDoc(doc(db, 'pedidos', id));
}
