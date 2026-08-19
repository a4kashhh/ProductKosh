import { initializeApp, getApps, getApp } from "firebase/app"
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  OAuthProvider
} from "firebase/auth"

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "productkosh-271d1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "productkosh-271d1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "productkosh-271d1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "829432124084",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:829432124084:web:30192c5a1f6befadf7fde1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9CNMGB8LC0"
}

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Safely initialize Auth with fallback persistence to prevent "Database is closing/hidden" IndexedDB errors
let auth: ReturnType<typeof getAuth>
try {
  if (typeof window !== "undefined") {
    auth = initializeAuth(app, {
      persistence: [browserLocalPersistence, indexedDBLocalPersistence, browserSessionPersistence, inMemoryPersistence]
    })
  } else {
    auth = getAuth(app)
  }
} catch (e) {
  // If already initialized (e.g. during Fast Refresh / HMR)
  auth = getAuth(app)
}

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const appleProvider = new OAuthProvider('apple.com')
appleProvider.addScope('email')
appleProvider.addScope('name')

export { app, auth, googleProvider, appleProvider }
