import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

export async function getProducts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'productos'));

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.nombre || '',
        description: data.descripcion || '',
        price: Number(data.precio) || 0,
        image: data.imagen || '',
        category: data.categoria || 'General',
        stock: Number(data.stock) || 0,
        estado: data.estado || 'activo',
      };
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}
