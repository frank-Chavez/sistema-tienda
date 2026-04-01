import { getProducts } from '../lib/products';

class ProductsStore extends EventTarget {
  products = [];

  async loadProducts() {
    this.products = await getProducts();

    window.dispatchEvent(
      new CustomEvent('products_change', {
        detail: this.products,
      }),
    );
  }

  getActiveProducts() {
    return this.products.filter((p) => p.estado === 'activo' && p.stock > 0);
  }
}

export const productsStore = new ProductsStore();
