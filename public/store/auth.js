import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { doc, setDoc, getDoc } from 'firebase/firestore';

import { auth, googleProvider, db } from '../lib/firebase.js';

class AuthStore extends EventTarget {
  constructor() {
    super();
    this.user = null;
    this.loadUser();
  }

  loadUser() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('naturist_auth_user');
      if (stored) {
        try {
          this.user = JSON.parse(stored);
        } catch {
          this.user = null;
        }
      }
    }
  }

  saveUser() {
    if (typeof window !== 'undefined') {
      if (this.user) {
        localStorage.setItem('naturist_auth_user', JSON.stringify(this.user));
      } else {
        localStorage.removeItem('naturist_auth_user');
      }
    }
    this.notify();
  }

  notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('auth_change', { detail: this.user }),
      );
    }
  }

  // 🔥 REGISTRO
  async register(nombre, email, password) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = {
        id: result.user.uid,
        nombre,
        email,
        rol: 'cliente',
      };

      await setDoc(doc(db, 'usuarios', user.id), user);

      this.user = user;
      this.saveUser();

      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Error al registrar usuario',
      };
    }
  }

  // 🔥 LOGIN
  async login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const docRef = doc(db, 'usuarios', result.user.uid);
      const docSnap = await getDoc(docRef);

      let userData;

      if (docSnap.exists()) {
        userData = docSnap.data();
      } else {
        // 🔥 CREAR USUARIO SI NO EXISTE
        userData = {
          nombre: result.user.email.split('@')[0],
          email: result.user.email,
          rol: 'cliente',
        };

        await setDoc(docRef, userData);
      }

      // 🔥 ASIGNAR ROL ADMIN SI ES EL EMAIL DEL ADMIN
      if (email === 'admin@tienda.com') {
        userData.rol = 'admin';
        await setDoc(docRef, userData); // Actualizar en DB
      }

      const user = {
        id: result.user.uid,
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol,
      };

      this.user = user;
      this.saveUser();

      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Correo o contraseña incorrectos',
      };
    }
  }

  // 🔥 GOOGLE LOGIN
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const docRef = doc(db, 'usuarios', result.user.uid);
      const docSnap = await getDoc(docRef);

      let userData;

      if (docSnap.exists()) {
        userData = docSnap.data();
      } else {
        userData = {
          nombre: result.user.displayName,
          email: result.user.email,
          rol: 'cliente',
        };

        await setDoc(docRef, userData);
      }

      const user = {
        id: result.user.uid,
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol,
        photo: result.user.photoURL,
      };

      this.user = user;
      this.saveUser();

      return { success: true };
    } catch (error) {
      console.error('ERROR GOOGLE:', error);
      return { success: false };
    }
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
