import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function getProducts() {
  const querySnapshot = await getDocs(collection(db, 'productos'));

  const products = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    products.push({
      id: doc.id,
      name: data.nombre || '',
      description: data.descripcion || '',
      price: Number(data.precio) || 0,
      image: data.imagen || '',
      category: data.categoria || 'General',
      stock: Number(data.stock) || 0,
      estado: data.estado || 'activo',
    });
  });

  return products;
}
