import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqHu29IbJxvK9qAOq30q8SSc9J_28kNiA",
  authDomain: "logic-looper-5f301.firebaseapp.com",
  projectId: "logic-looper-5f301",
  storageBucket: "logic-looper-5f301.firebasestorage.app",
  messagingSenderId: "425730198763",
  appId: "1:425730198763:web:fd0871ec5bed7870b1c2ae",
  measurementId: "G-X1DMS4C1H1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user to Firestore (optional but good)
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName,
        email: user.email,
        lastLogin: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log("Login success:", user.email);
    return user;
  } catch (err) {
    console.error("Login error:", err.code, err.message);
    throw err;
  }
}



export function logout() {
  return signOut(auth);
}

export { auth, db };
