// Protección del panel de administración.
// Espera a que Firebase confirme la sesión y vuelve a leer el rol desde
// Firestore. Las páginas llaman `await requireAdmin()` antes de pedir datos.
import { authStore } from '../store/auth.js';

let pending = null;

export function requireAdmin() {
  if (pending) return pending;
  pending = (async () => {
    await authStore.refreshRole();
    if (!authStore.isAdmin()) {
      const back = encodeURIComponent(location.pathname);
      location.replace(authStore.isLoggedIn() ? '/' : `/login?redirect=${back}`);
      // Nunca se resuelve: la página se está yendo.
      return new Promise(() => {});
    }
    return authStore.user;
  })();
  return pending;
}
