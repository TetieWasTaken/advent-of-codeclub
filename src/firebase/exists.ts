import { firestore } from "./init";
import { doc, getDoc } from "firebase/firestore";

/**
 * @internal
 * Check if a document exists in Firestore
 * @param {string} path - The path to the document in Firestore
 * @returns {boolean} - True if the collection exists, false otherwise
 */
async function documentExists(path: string): Promise<boolean> {
  const docRef = doc(firestore, path);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export { documentExists };
