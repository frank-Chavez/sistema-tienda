import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase.js'; // 🔥 IMPORT CORRECTO

export async function getProducts() {
  try {
    const snapshot = await getDocs(collection(db, 'productos'));

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.nombre || '',
        description: data.descripcion || '',
        image: data.imagen || '',
        price: Number(data.precio) || 0,
        stock: Number(data.stock) || 0,
        category: data.categoria || 'Otros',
        status: data.estado || 'activo',
      };
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}
