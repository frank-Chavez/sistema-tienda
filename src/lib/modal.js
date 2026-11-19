// Abrir y cerrar modales con animación. Usa las clases .modal / .modal-sheet
// definidas en global.css. En celular el modal sale desde abajo (hoja).

export function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => modal.classList.add('is-open'));
  const focusable = modal.querySelector(
    'input, select, textarea, button:not([data-close])',
  );
  setTimeout(() => focusable?.focus({ preventScroll: true }), 60);
}

export function closeModal(modal) {
  if (!modal || modal.hidden) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  setTimeout(() => {
    modal.hidden = true;
  }, 220);
}

/** Cierra al tocar el fondo, los botones [data-close] o la tecla Escape. */
export function wireModal(modal, onClose = () => closeModal(modal)) {
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-close]')) onClose();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) onClose();
  });
}
