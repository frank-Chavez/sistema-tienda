import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

import { doc, setDoc, getDoc } from 'firebase/firestore';

import { auth, googleProvider, db } from '../lib/firebase.js';

const STORAGE_KEY = 'naturist_auth_user';
const ADMIN_EMAIL = 'admin@tienda.com';

// Mensajes claros para los errores más comunes de Firebase.
const AUTH_ERRORS = {
  'auth/invalid-credential': 'El correo o la contraseña no coinciden.',
  'auth/wrong-password': 'El correo o la contraseña no coinciden.',
  'auth/user-not-found': 'No hay una cuenta con ese correo.',
  'auth/invalid-email': 'Escribe un correo válido.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Inicia sesión.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos y vuelve a probar.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet y vuelve a intentar.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de terminar.',
  'auth/cancelled-popup-request': 'Cerraste la ventana de Google antes de terminar.',
};

function errorMessage(error, fallback) {
  return AUTH_ERRORS[error?.code] || fallback;
}

class AuthStore extends EventTarget {
  constructor() {
    super();
    this.user = null;
    this.loadUser();

    // `ready` se resuelve cuando Firebase confirma si hay sesión de verdad.
    // Antes la app solo miraba localStorage, así que una sesión vencida
    // seguía apareciendo como "iniciada" (bug del login).
    this.ready =
      typeof window === 'undefined'
        ? Promise.resolve()
        : new Promise((resolve) => {
            let first = true;
            onAuthStateChanged(auth, (fbUser) => {
              if (!fbUser && this.user) {
                this.user = null;
                this.saveUser();
              }
              if (first) {
                first = false;
                resolve();
              }
            });
          });

    // Termina el inicio con Google cuando se usó redirección (móviles).
    if (typeof window !== 'undefined') {
      getRedirectResult(auth)
        .then((result) => (result ? this.#saveGoogleUser(result.user) : null))
        .catch((error) => console.error(error));
    }
  }

  loadUser() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      this.user = JSON.parse(stored);
    } catch {
      this.user = null;
    }
  }

  saveUser() {
    if (typeof window !== 'undefined') {
      if (this.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    this.notify();
  }

  notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth_change', { detail: this.user }));
    }
  }

  async #loadProfile(fbUser, defaults) {
    const docRef = doc(db, 'usuarios', fbUser.uid);
    const docSnap = await getDoc(docRef);

    let userData;
    if (docSnap.exists()) {
      userData = docSnap.data();
    } else {
      userData = { ...defaults, rol: 'cliente' };
      await setDoc(docRef, userData);
    }

    if (fbUser.email === ADMIN_EMAIL && userData.rol !== 'admin') {
      userData.rol = 'admin';
      await setDoc(docRef, userData);
    }

    return {
      id: fbUser.uid,
      nombre: userData.nombre || defaults.nombre,
      email: userData.email || fbUser.email,
      rol: userData.rol || 'cliente',
      photo: fbUser.photoURL || null,
    };
  }

  async #saveGoogleUser(fbUser) {
    this.user = await this.#loadProfile(fbUser, {
      nombre: fbUser.displayName || fbUser.email.split('@')[0],
      email: fbUser.email,
    });
    this.saveUser();
  }

  async register(nombre, email, password) {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      const user = { id: result.user.uid, nombre, email, rol: 'cliente' };
      await setDoc(doc(db, 'usuarios', user.id), {
        nombre,
        email,
        rol: 'cliente',
      });

      this.user = user;
      this.saveUser();
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: errorMessage(error, 'No se pudo crear la cuenta. Intenta de nuevo.'),
      };
    }
  }

  async login(email, password, remember = true) {
    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );
      const result = await signInWithEmailAndPassword(auth, email, password);

      this.user = await this.#loadProfile(result.user, {
        nombre: result.user.email.split('@')[0],
        email: result.user.email,
      });
      this.saveUser();
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: errorMessage(error, 'No se pudo iniciar sesión. Intenta de nuevo.'),
      };
    }
  }

  async loginWithGoogle() {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      await this.#saveGoogleUser(result.user);
      return { success: true };
    } catch (error) {
      // En muchos celulares el navegador bloquea la ventana emergente:
      // en ese caso se usa la redirección de página completa.
      if (
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirecting: true };
      }
      console.error(error);
      return {
        success: false,
        message: errorMessage(error, 'No se pudo entrar con Google. Intenta de nuevo.'),
      };
    }
  }

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: errorMessage(error, 'No se pudo enviar el correo. Revisa la dirección.'),
      };
    }
  }

  /** Vuelve a leer el rol desde Firestore (no confía solo en localStorage). */
  async refreshRole() {
    await this.ready;
    const fbUser = auth.currentUser;
    if (!fbUser || !this.user) return this.user;
    try {
      const snap = await getDoc(doc(db, 'usuarios', fbUser.uid));
      const rol = snap.exists() ? snap.data().rol || 'cliente' : 'cliente';
      if (rol !== this.user.rol) {
        this.user = { ...this.user, rol };
        this.saveUser();
      }
    } catch (error) {
      console.error(error);
    }
    return this.user;
  }

  async logout() {
    await signOut(auth);
    this.user = null;
    this.saveUser();
  }

  isAdmin() {
    return this.user?.rol === 'admin';
  }

  isLoggedIn() {
    return !!this.user;
  }
}

export const authStore = new AuthStore();
