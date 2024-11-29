import { formData } from "./types";
import { addData } from "./firebase/addData";

class SubmitHelper {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Store images in the public Uploads folder by calling the API
   * @internal
   * @param file - The file to store
   * @returns URL of the stored image
   */
  private async storeImages(file: File): Promise<string> {
    console.log("Storing image", file);

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    console.log(response);

    const data = await response.json();
    console.log("Image stored", data);
    return data.filePath;
  }

  /**
   * Submit the form to firestore
   * @param formData - The form data to submit
   * @param index - The index of the
   * @returns void
   */
  public async submit(formData: formData /* _index: number */): Promise<void> {
    console.log("Submitting form", formData);
    const imageUrls = await Promise.all(
      formData.files.map((image) => this.storeImages(image)),
    );

    const data = {
      text: formData.text,
      note: formData.note,
      images: imageUrls,
    };

    addData(`users/${this.userId}/forms`, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}

export { SubmitHelper };
