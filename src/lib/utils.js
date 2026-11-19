// Utilidades compartidas por toda la tienda.

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escapa texto antes de meterlo en innerHTML.
 * Evita que un nombre o descripción con etiquetas HTML rompa la página
 * o ejecute código (XSS).
 */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/** Formatea un monto en soles: S/ 12.50 */
export function formatPrice(value) {
  return `S/ ${(Number(value) || 0).toFixed(2)}`;
}

/** Convierte un Timestamp de Firestore (o fecha) en texto legible. */
export function formatDate(fecha) {
  const seconds = fecha?.seconds;
  if (!seconds) return '—';
  return new Date(seconds * 1000).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Solo permite redirecciones dentro del mismo sitio ("/cart", "/products").
 * Evita que un enlace como /login?redirect=https://sitio-falso.com
 * mande al usuario a otra página después de iniciar sesión.
 */
export function safeRedirect(target, fallback = '/') {
  if (typeof target !== 'string') return fallback;
  if (!target.startsWith('/') || target.startsWith('//')) return fallback;
  return target;
}

/** Número de WhatsApp de la tienda. */
export const STORE_PHONE = '51975279174';
