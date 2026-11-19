// Tarjetas de producto compartidas por Inicio y Productos.
// Todo el texto pasa por escapeHtml antes de entrar al HTML.
import { cartStore } from '../store/cart.js';
import { escapeHtml, formatPrice } from './utils.js';
import { openModal, closeModal, wireModal } from './modal.js';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#efe7fb"/><path d="M60 30c-14 12-20 26-20 38a20 20 0 0 0 40 0c0-12-6-26-20-38Z" fill="#d8c8f2"/></svg>',
  );

export function productCardHTML(prod) {
  const lowStock = prod.stock > 0 && prod.stock <= 5;
  return `
  <article class="group flex h-full flex-col">
    <button type="button" data-open="${escapeHtml(prod.id)}"
      class="relative block aspect-square overflow-hidden rounded-[20px] bg-lavanda text-left"
      aria-label="Ver detalles de ${escapeHtml(prod.name)}">
      <img src="${escapeHtml(prod.image || PLACEHOLDER)}" alt="" loading="lazy"
        onerror="this.src='${PLACEHOLDER}'"
        class="h-full w-full object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]" />
      ${
        lowStock
          ? `<span class="badge absolute left-2.5 top-2.5 bg-white/90 text-[#8a5a00]">Quedan ${prod.stock}</span>`
          : ''
      }
    </button>
    <div class="flex grow flex-col px-1 pt-3">
      <p class="text-xs font-medium text-gris">${escapeHtml(prod.category)}</p>
      <h3 class="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-tinta sm:text-base">
        <button type="button" data-open="${escapeHtml(prod.id)}" class="text-left hover:text-morado">${escapeHtml(prod.name)}</button>
      </h3>
      <div class="mt-auto flex items-center justify-between gap-2 pt-3">
        <span class="font-display text-lg font-bold text-morado sm:text-xl">${formatPrice(prod.price)}</span>
        <button type="button" data-add="${escapeHtml(prod.id)}"
          class="btn btn-primary h-10 min-h-10 w-10 px-0 sm:w-auto sm:px-4"
          aria-label="Agregar ${escapeHtml(prod.name)} al carrito">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          <span class="hidden sm:inline" data-label>Agregar</span>
        </button>
      </div>
    </div>
  </article>`;
}

export function skeletonCards(count = 4) {
  return Array.from(
    { length: count },
    () => `
    <div aria-hidden="true">
      <div class="skeleton aspect-square"></div>
      <div class="skeleton mt-3 h-3 w-1/3"></div>
      <div class="skeleton mt-2 h-4 w-3/4"></div>
      <div class="skeleton mt-4 h-9 w-full"></div>
    </div>`,
  ).join('');
}

function addToCart(prod, button) {
  const added = cartStore.addItem(
    { id: prod.id, name: prod.name, price: prod.price, image: prod.image, stock: prod.stock },
    1,
  );
  if (!added || !button) return;

  const label = button.querySelector('[data-label]');
  const original = label?.textContent;
  button.classList.add('!bg-hoja');
  if (label) label.textContent = 'Agregado';
  setTimeout(() => {
    button.classList.remove('!bg-hoja');
    if (label) label.textContent = original;
  }, 1300);
}

// Modal de detalle (se crea una sola vez por página).
function ensureDetailModal() {
  let modal = document.getElementById('product-detail');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'product-detail';
  modal.className = 'modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `<div class="modal-sheet modal-wide" data-body></div>`;
  document.body.appendChild(modal);
  wireModal(modal);
  return modal;
}

function showDetail(prod) {
  const modal = ensureDetailModal();
  const body = modal.querySelector('[data-body]');
  body.innerHTML = `
    <div class="grid sm:grid-cols-2">
      <div class="relative bg-lavanda sm:rounded-l-[24px]">
        <button type="button" data-close aria-label="Cerrar"
          class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-tinta shadow-sm">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <img src="${escapeHtml(prod.image || PLACEHOLDER)}" alt="${escapeHtml(prod.name)}"
          onerror="this.src='${PLACEHOLDER}'"
          class="mx-auto aspect-square w-full max-w-xs object-contain p-6 mix-blend-multiply sm:max-w-none" />
      </div>
      <div class="flex flex-col p-6 sm:p-8">
        <p class="text-sm font-medium text-gris">${escapeHtml(prod.category)}</p>
        <h2 class="mt-1 text-2xl font-bold leading-tight">${escapeHtml(prod.name)}</h2>
        <p class="mt-3 font-display text-3xl font-bold text-morado">${formatPrice(prod.price)}</p>
        <p class="mt-4 whitespace-pre-line leading-relaxed text-gris">${escapeHtml(prod.description || 'Sin descripción.')}</p>
        <p class="mt-4 text-sm font-semibold text-hoja">${prod.stock} disponibles</p>
        <button type="button" data-add-detail class="btn btn-primary mt-6 w-full">Agregar al carrito</button>
      </div>
    </div>`;
  body.querySelector('[data-add-detail]').addEventListener('click', (e) => {
    addToCart(prod, null);
    const btn = e.currentTarget;
    btn.textContent = 'Agregado al carrito';
    btn.classList.add('!bg-hoja');
    setTimeout(() => closeModal(modal), 700);
  });
  openModal(modal);
}

/** Pinta los productos en `grid` y conecta los botones. */
export function renderProductGrid(grid, products) {
  grid.innerHTML = products.map(productCardHTML).join('');

  if (grid.dataset.wired) return;
  grid.dataset.wired = '1';
  grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    const openBtn = e.target.closest('[data-open]');
    const list = grid._products || [];
    if (addBtn) {
      const prod = list.find((p) => p.id === addBtn.dataset.add);
      if (prod) addToCart(prod, addBtn);
    } else if (openBtn) {
      const prod = list.find((p) => p.id === openBtn.dataset.open);
      if (prod) showDetail(prod);
    }
  });
}

export function setGridProducts(grid, products) {
  grid._products = products;
  renderProductGrid(grid, products);
}
