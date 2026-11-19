import { showToast } from '../lib/toast.js';

class CartStore extends EventTarget {
  constructor() {
    super();
    this.items = [];
    this.loadCart();
  }

  loadCart() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('naturist_cart');
      if (stored) {
        try {
          this.items = JSON.parse(stored);
        } catch (e) {
          this.items = [];
        }
      }
    }
  }

  saveCart() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('naturist_cart', JSON.stringify(this.items));
    }
    this.notify();
  }

  notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cart_change', { detail: this.items }),
      );
    }
  }

  /** Devuelve true si se agregó al menos una unidad. */
  addItem(product, quantity = 1) {
    const maxStock = Number(product.stock) || 0;
    const existingItem = this.items.find((item) => item.id === product.id);
    const current = existingItem ? existingItem.quantity : 0;

    if (current >= maxStock) {
      showToast(
        maxStock === 0
          ? 'Este producto está agotado'
          : `Solo quedan ${maxStock} unidades y ya están en tu carrito`,
        'warning',
      );
      return false;
    }

    const next = Math.min(current + quantity, maxStock);
    if (existingItem) {
      existingItem.quantity = next;
      existingItem.stock = maxStock;
    } else {
      this.items.push({ ...product, quantity: next });
    }
    this.saveCart();
    return true;
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.items.find((item) => item.id === productId);
    if (item) {
      const maxStock = item.stock || 0;
      item.quantity = Math.min(quantity, maxStock);
      if (quantity > maxStock) {
        showToast(`Solo hay ${maxStock} unidades disponibles`, 'warning');
      }
      this.saveCart();
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }
}

export const cartStore = new CartStore();
