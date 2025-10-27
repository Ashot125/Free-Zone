// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "free-zone-5e0da.firebaseapp.com",
  projectId: "free-zone-5e0da",
  storageBucket: "free-zone-5e0da.firebasestorage.app",
  messagingSenderId: "720801696903",
  appId: "1:720801696903:web:73b51b986a020c1fcfbc22",
  measurementId: "G-HJHG949V3G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/** Register user */
export async function register(email, password, name) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      name,
      createdAt: serverTimestamp(),
    });

    console.log("User registered:", user.uid);
    return user;
  } catch (error) {
    console.error("Registration failed:", error.code, error.message);
    return null;
  }
}

/** Register partner WITHOUT password */
export async function registerPartnerFirestore({ email, firstName, lastName, companyName, businessType, phone, countryCode }) {
  try {
    const newDocRef = doc(collection(db, "users")); //Firestore will generate the ID itself
    await setDoc(newDocRef, {
      uid: newDocRef.id,
      email,
      firstName,
      lastName,
      companyName,
      businessType,
      phone: countryCode + phone,
      role: "partner",
      createdAt: serverTimestamp(),
    });

    console.log("Partner saved :", newDocRef.id);
    return newDocRef.id;
  } catch (error) {
    console.error("Partner  registration failed:", error);
    throw error;
  }
}

/** Register courier WITHOUT password */
export async function registerCourierFirestore({ firstName, lastName, email, phone, countryCode, vehicle }) {
  try {
    const newDocRef = doc(collection(db, "users")); //Firestore will generate the ID itself
    await setDoc(newDocRef, {
      uid: newDocRef.id,
      firstName,
      lastName,
      email,
      phone: countryCode + phone,
      vehicle,
      role: "courier",
      createdAt: serverTimestamp(),
    });

    console.log("Courier saved:", newDocRef.id);
    return newDocRef.id;
  } catch (error) {
    console.error("Courier registration failed:", error);
    throw error;
  }
}


/** Login user */
export async function login(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

/** Fetch all products (example) */
export async function getProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/** Create Buy Order */

export async function createOrder({ userId, product, quantity }) {
  const order = {
    userId,
    productId: product.id,
    productName: product.title,
    amount: product.price * quantity,
    quantity,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), order);
  return { id: docRef.id, ...order };
}

/** Confirm payment */
export async function confirmPayment(orderId) {
  const orderRef = doc(db, "orders", orderId);
  await setDoc(orderRef, { status: "paid" }, { merge: true });
}



