import { requestData } from "./firebase/requestData";
import { FirebaseAuth } from "./firebase/auth";

class AdminHelper {
  private auth: FirebaseAuth = new FirebaseAuth();

  constructor() {
  }

  async getUsers() {
    try {
      const data = await requestData("users");
      return data;
    } catch (error) {
      console.warn("Error getting documents");
      console.error(error);
      return [];
    }
  }
}

export { AdminHelper };
