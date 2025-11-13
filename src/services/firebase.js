import { initializeApp, getApps } from 'firebase/app'
import { getDatabase, ref, push, set, onValue, update, remove } from 'firebase/database'

let app
export function ensureFirebase() {
  if (getApps().length) return app
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
  }
  app = initializeApp(config)
  return app
}

export function db() { ensureFirebase(); return getDatabase() }

export function userPinsRef(userId) { return ref(db(), `/quests/${userId}`) }
export function liveRef(userId) { return ref(db(), `/live/${userId}`) }

export async function addPin(userId, pin) {
  const r = userPinsRef(userId)
  const key = push(r).key
  await set(ref(db(), `/quests/${userId}/${key}`), { id: key, ...pin, createdAt: Date.now() })
  return key
}

export function subscribePins(userId, cb) {
  const r = userPinsRef(userId)
  return onValue(r, (snap) => {
    const v = snap.val() || {}
    cb(Object.values(v))
  })
}

export function deletePin(userId, pinId) { return remove(ref(db(), `/quests/${userId}/${pinId}`)) }

export async function setLiveLocation(userId, { lat, lon, name }) {
  return update(liveRef(userId), { lat, lon, name, ts: Date.now() })
}

export function subscribeLive(cb) {
  return onValue(ref(db(), '/live'), (snap) => {
    cb(snap.val() || {})
  })
}
