import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDey6s5l6_6sEsQaHjboHzpmzJFTS4RFVQ',
  authDomain: 'sistema-tienda-web.firebaseapp.com',
  projectId: 'sistema-tienda-web',
  storageBucket: 'sistema-tienda-web.firebasestorage.app',
  messagingSenderId: '241695161673',
  appId: '1:241695161673:web:dd3a4d1ff9ffdd12c42e98',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// 🔥 AGREGAR ESTO
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
