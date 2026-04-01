import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function getProducts() {
  const snapshot = await getDocs(collection(db, 'productos'));

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.nombre,
      description: data.descripcion,
      image: data.imagen,
      price: data.precio,
      stock: data.stock,
      category: data.categoria || 'Otros',
      status: data.estado,
    };
  });
}
