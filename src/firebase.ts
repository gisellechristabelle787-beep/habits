import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
const firebaseConfig = {
  projectId: "ninth-list-wr5vm",
  appId: "1:301472867796:web:e3a06e8e34e474a7b2e241",
  apiKey: "AIzaSyDC25PmQ03nO8sqp0iVCWs7dgQu3UXYtMo",
  authDomain: "ninth-list-wr5vm.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-f50c50e4-86ff-4cbc-9d20-d55cfa97f415",
  storageBucket: "ninth-list-wr5vm.firebasestorage.app",
  messagingSenderId: "301472867796",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
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
