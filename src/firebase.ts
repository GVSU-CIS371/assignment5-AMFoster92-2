import { getFirestore, doc, getDoc, collection, getDocs, setDoc, query, where} from "firebase/firestore";
import type {WhereFilterOp} from "firebase/firestore"
import {GoogleAuthProvider, getAuth, signInWithPopup, signOut} from "firebase/auth"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDlyHtkwXsLVhnvSCzU-0YlVpqyd8awd-w",
  authDomain: "brewportal-520bf.firebaseapp.com",
  projectId: "brewportal-520bf",
  storageBucket: "brewportal-520bf.firebasestorage.app",
  messagingSenderId: "879174333668",
  appId: "1:879174333668:web:73a30562dac4986fac28f1"
};

const provider = new GoogleAuthProvider()

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


function signInAuth(){
  return signInWithPopup(auth, provider)
    .then((result) => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  // The signed-in user info.
  const user = result.user;
  return user;
  // IdP data available using getAdditionalUserInfo(result)
  // ...
}).catch((error) => {
  // Handle Errors here.
  // The email of the user's account used.
  // The AuthCredential type that was used.

  console.log(error)
  // ...
});
}

function signOutAuth(){
  signOut(auth).then(() => {
    console.log("logged out")
  }).catch((error) => {
    console.log(error)
  });
}

async function getDocument(collectName: string, docName: string){
  try{
    const docRef = await doc(db, collectName, docName)
    const dbSnap = await getDoc(docRef)

    if(dbSnap.exists()){
      return dbSnap
    }
  } catch(error){
    console.log(error)
  }
}

async function getCollection(collectName: string, filters: {[field: string]: {op:string, value:string}} = {}){
  try{
    const collect = filterCollection(collectName, filters)
    const querySnap = await getDocs(collect);

    return querySnap

  } catch(error){
    console.log(error)
  }
}

async function createDocument(collectName: string, docName: string, data: any){
  try{
    let document = doc(db, collectName, docName)
    await setDoc(document, data)
  } catch (error) {
    console.log(error)
  }
}

function filterCollection(collectName: string, filters: {[field: string]: {op: string, value:string}} = {}){
    var q = query(collection(db, collectName))

    for (const [field, filter] of Object.entries(filters)){
        q = query(q, where(field, filter.op! as WhereFilterOp, filter.value))
    }

    return q

}

export default db;
export {auth, provider};
export {getDocument, getCollection, createDocument, signInAuth, signOutAuth}