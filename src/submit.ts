import { formData } from "./types";
import { addData } from "./firebase/addData";
import { PutBlobResult } from "@vercel/blob";

interface ExtendedPutBlobResult extends PutBlobResult {
  filePath: string;
}

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
  private async storeImages(file: File): Promise<PutBlobResult> {
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const newBlob = await response.json() as PutBlobResult;
      return newBlob;
    } catch (error) {
      console.warn("Error uploading file to storage");
      console.error(error);

      // Not sure if this would work lol
      return {
        url: "",
        downloadUrl: "",
        pathname: "",
        contentDisposition: "",
      };
    }
  }

  /**
   * Submit the form to firestore
   * @param formData - The form data to submit
   * @param id - The task id
   * @returns void
   */
  public async submit(formData: formData, id: string): Promise<void> {
    try {
      const imageUrls = await Promise.all(
        formData.files.map((image) => this.storeImages(image)),
      ) as ExtendedPutBlobResult[];

      const data = {
        text: formData.text,
        note: formData.note,
        images: imageUrls.map((image) => image.filePath),
      };

      addData(`users/${this.userId}/forms`, {
        ...data,
        timestamp: new Date().toISOString(),
      }, id);
    } catch (error) {
      console.warn("Error while submitting form");
      console.error(error);
    }
  }
}

export { SubmitHelper };
