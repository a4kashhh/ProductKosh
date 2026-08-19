import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth"

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCIPTkkuXRL0-gj1b9YoacnQR8XD2uiEV0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "productkosh-271d1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "productkosh-271d1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "productkosh-271d1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "829432124084",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:829432124084:web:30192c5a1f6befadf7fde1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9CNMGB8LC0"
}

// Canonical singleton Firebase app & auth
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const appleProvider = new OAuthProvider('apple.com')
appleProvider.addScope('email')
appleProvider.addScope('name')

export { app, auth, googleProvider, appleProvider }
