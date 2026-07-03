import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUnzGyeXJCCnQCtpvkKOOS4JP_VN2eiO4",
  authDomain: "tce-event-portal.firebaseapp.com",
  projectId: "tce-event-portal",
  storageBucket: "tce-event-portal.firebasestorage.app",
  messagingSenderId: "488159453155",
  appId: "1:488159453155:web:0f20a8e293849168edcad6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;