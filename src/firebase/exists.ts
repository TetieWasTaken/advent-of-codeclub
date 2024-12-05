import { firestore } from "./init";
import { doc, getDoc } from "firebase/firestore";

/**
 * @internal
 * Check if a document exists in Firestore
 * @param {string} path - The path to the document in Firestore
 * @returns {boolean} - True if the collection exists, false otherwise
 */
async function documentExists(path: string): Promise<boolean> {
  try {
    const docRef = doc(firestore, path);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.warn("Error checking if document exists");
    console.error(error);
    return false;
  }
}

export { documentExists };
