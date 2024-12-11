import { firestore } from "./init";
import { doc, type DocumentData, getDoc } from "firebase/firestore";

/**
 * @internal
 * Request a document from Firestore
 * @param {string} collectionPath - The path to the document in Firestore
 * @param {boolean} silent - Whether to suppress errors
 * @returns {Promise<DocumentData>} - An object from the Firestore document
 */
async function getDocument(
  collectionPath: string,
  silent: boolean,
): Promise<DocumentData> {
  try {
    const docRef = doc(firestore, collectionPath);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      if (!silent) {
        console.error("No such document!");
        throw new Error("No such document!");
      } else {
        return { error: true };
      }
    }
  } catch (error: unknown) {
    console.error("Error getting document: ", error);
    throw new Error("An unknown error occurred.");
  }
}

export { getDocument };
