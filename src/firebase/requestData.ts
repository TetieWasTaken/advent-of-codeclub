import { firestore } from "./init";
import { collection, type DocumentData, getDocs } from "firebase/firestore";

/**
 * @internal
 * Request data from Firestore
 * @param {string} collectionPath - The path to the collection in Firestore
 * @returns {Promise<DocumentData[]>} - An array of objects from the Firestore collection
 */
async function requestData(collectionPath: string): Promise<DocumentData[]> {
  try {
    const querySnapshot = await getDocs(collection(firestore, collectionPath));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error: unknown) {
    console.error("Error getting documents: ", error);
    throw new Error("An unknown error occurred.");
  }
}

export { requestData };
