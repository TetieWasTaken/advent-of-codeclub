import { firestore } from "./init";
import {
  addDoc,
  collection,
  doc,
  type DocumentData,
  type DocumentReference,
  setDoc,
} from "firebase/firestore";

/**
 * @internal
 * Add data to Firestore
 * @param {string} collectionPath - The path to the collection in Firestore
 * @param {object} data - The data to add to Firestore
 * @param {id} id - Optional id to set for the document
 * @returns {Promise<DocumentReference<object, DocumentData>> | void} - A promise that resolves when the data has been added to Firestore
 */
async function addData(
  collectionPath: string,
  data: object,
  id?: string,
): Promise<DocumentReference<object, DocumentData> | void> {
  if (!id) {
    return (await addDoc(collection(firestore, collectionPath), data));
  } else {
    return (await setDoc(doc(firestore, collectionPath, id), data));
  }
}

export { addData };
