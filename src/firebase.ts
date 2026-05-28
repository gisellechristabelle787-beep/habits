import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCbwtxnIo9Yeqs0-g1DN_0-ng_pixru-kE",
  authDomain: "habit-bcedf.firebaseapp.com",
  databaseURL: "https://habit-bcedf-default-rtdb.firebaseio.com",
  projectId: "habit-bcedf",
  storageBucket: "habit-bcedf.firebasestorage.app",
  messagingSenderId: "1085914019159",
  appId: "1:1085914019159:web:168e5a8930b1d6b978fa12",
  measurementId: "G-HGEJH39P11"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Uses the default Firestore database
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
