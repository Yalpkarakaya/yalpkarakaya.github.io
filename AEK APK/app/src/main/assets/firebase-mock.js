/*
 * AEK Projesi Çevrimdışı Firebase Taklit (Mock) Kütüphanesi
 * Tüm verileri cihazın localStorage'ına kaydeder.
 */
(function(global){
  const LOCAL_STORAGE_KEY = 'AEK_OFFLINE_DB';

  function readDb() {
    try {
      const db = localStorage.getItem(LOCAL_STORAGE_KEY);
      return db ? JSON.parse(db) : {};
    } catch (e) {
      console.error('AEK Mock DB Okuma Hatası:', e);
      return {};
    }
  }

  function writeDb(db) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('AEK Mock DB Yazma Hatası:', e);
    }
  }

  function setPathValue(obj, path, value) {
    const keys = path.split('/').filter(Boolean);
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return obj;
  }

  function getPathValue(obj, path) {
    const keys = path.split('/').filter(Boolean);
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
      if (current === null || typeof current !== 'object') return null;
      current = current[keys[i]];
    }
    return current;
  }

  // --- Modular API (v9+) ---
  function initializeApp(config){
    global.__aekFirebaseApp = { config };
    console.log('AEK Mock: Firebase App Başlatıldı (çevrimdışı).', config);
    return global.__aekFirebaseApp;
  }

  function getDatabase(app){
    return { app: app || global.__aekFirebaseApp };
  }

  function ref(db, path){
    return { __ref: true, db, path };
  }

  function set(refObj, value){
    return new Promise((resolve) => {
      const db = readDb();
      setPathValue(db, refObj.path, value);
      writeDb(db);
      resolve();
    });
  }

  function onValue(refObj, callback){
    const db = readDb();
    const data = getPathValue(db, refObj.path);
    const snapshot = { val: () => (data ?? null) };
    setTimeout(() => callback(snapshot), 0);
  }

  function getAuth(app){
    return { app: app || global.__aekFirebaseApp };
  }

  function signInAnonymously(){
    const user = { uid: 'offline-user', isAnonymous: true };
    return Promise.resolve({ user });
  }

  function onAuthStateChanged(auth, callback){
    const user = { uid: 'offline-user', isAnonymous: true };
    setTimeout(() => callback(user), 0);
  }

  function signInWithEmailAndPassword(auth, email, password){
    const user = { uid: 'offline-user', email, isAnonymous: false };
    return Promise.resolve({ user });
  }

  function signOut(){
    return Promise.resolve();
  }

  // --- Compat-style global ---
  const compatRef = (path) => ({
    set: (value) => set({ path }, value),
    onValue: (cb) => onValue({ path }, cb)
  });

  const compatDatabase = { ref: (path) => compatRef(path) };
  const compatAuth = {
    onAuthStateChanged: (cb) => onAuthStateChanged(null, cb),
    signInAnonymously: () => signInAnonymously(),
  };

  const firebaseCompat = {
    initializeApp: (config) => initializeApp(config),
    auth: () => compatAuth,
    database: () => compatDatabase,
  };

  // Expose compat
  global.firebase = firebaseCompat;

  // Also expose modular exports for ESM re-exports
  global.__firebaseMockExports = {
    initializeApp,
    getDatabase,
    ref,
    set,
    onValue,
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
  };
})(window);

// ESM export bridge
export const initializeApp = window.__firebaseMockExports.initializeApp;
export const getDatabase = window.__firebaseMockExports.getDatabase;
export const ref = window.__firebaseMockExports.ref;
export const set = window.__firebaseMockExports.set;
export const onValue = window.__firebaseMockExports.onValue;
export const getAuth = window.__firebaseMockExports.getAuth;
export const signInAnonymously = window.__firebaseMockExports.signInAnonymously;
export const onAuthStateChanged = window.__firebaseMockExports.onAuthStateChanged;
export const signInWithEmailAndPassword = window.__firebaseMockExports.signInWithEmailAndPassword;
export const signOut = window.__firebaseMockExports.signOut;
