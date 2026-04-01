class CategoriesStore extends EventTarget {
  constructor() {
    super();
    this.categories = [];
    this.loadCategories();
  }

  loadCategories() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('naturist_categories');
      if (stored) {
        try {
          this.categories = JSON.parse(stored);
        } catch (e) {
          this.categories = [];
        }
      } else {
        this.categories = [];
        this.saveCategories();
      }
    } else {
      this.categories = [];
    }
  }

  saveCategories() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'naturist_categories',
        JSON.stringify(this.categories),
      );
    }
    this.notify();
  }

  notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('categories_change', { detail: this.categories }),
      );
    }
  }

  getAll() {
    return this.categories;
  }

  addCategory(name) {
    if (!this.categories.includes(name)) {
      this.categories.push(name);
      this.saveCategories();
      return true;
    }
    return false;
  }

  deleteCategory(name) {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter((c) => c !== name);
    if (this.categories.length !== initialLength) {
      this.saveCategories();
      return true;
    }
    return false;
  }
}

export const categoriesStore = new CategoriesStore();
