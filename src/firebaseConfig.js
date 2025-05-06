import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { ref, onValue, getDatabase, push, orderByChild, query, limitToLast } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBr3wwGDqCsEZ8wLzEkiu9maGFrWhHP4fI",
    authDomain: "morteros-granpiedra.firebaseapp.com",
    projectId: "morteros-granpiedra",
    storageBucket: "morteros-granpiedra.appspot.com",
    messagingSenderId: "385455408732",
    appId: "1:385455408732:web:d21b04343927f385c84899",
    measurementId: "G-QCC6NZKQQY"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const fireDb = ref(database, 'productos');

  export const auth = getAuth(app);
  export const db = getDatabase(app);
  
  export default fireDb;
  