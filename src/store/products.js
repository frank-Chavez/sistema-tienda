import { getProducts } from '../lib/products.js';

class ProductsStore extends EventTarget {
  products = [];
  loaded = false;

  async loadProducts() {
    try {
      this.products = await getProducts();
    } catch (error) {
      console.error('Error cargando productos:', error);
      this.products = [];
    }
    this.loaded = true;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('products_change', { detail: this.products }),
      );
    }
    return this.products;
  }

  getActiveProducts() {
    return this.products.filter((p) => p.estado === 'activo' && p.stock > 0);
  }
}

export const productsStore = new ProductsStore();
