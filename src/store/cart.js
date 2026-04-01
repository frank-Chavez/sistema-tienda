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

  addItem(product, quantity = 1) {
    const existingItem = this.items.find((item) => item.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const maxStock = product.stock || 0;
      existingItem.quantity = Math.min(newQuantity, maxStock);
      if (newQuantity > maxStock) {
        showToast('Stock máximo alcanzado', 'warning');
      }
    } else {
      const maxStock = product.stock || 0;
      const addQuantity = Math.min(quantity, maxStock);
      if (addQuantity > 0) {
        this.items.push({ ...product, quantity: addQuantity });
      }
      if (quantity > maxStock) {
        showToast('Stock máximo alcanzado', 'warning');
      }
    }
    this.saveCart();
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
        showToast('Stock máximo alcanzado', 'warning');
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
