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
    const response = await fetch(`/api/upload?filename=${file.name}`, {
      method: "POST",
      body: file,
    });

    const newBlob = await response.json() as PutBlobResult;
    return newBlob;
  }

  /**
   * Submit the form to firestore
   * @param formData - The form data to submit
   * @param index - The index of the
   * @returns void
   */
  public async submit(formData: formData /* _index: number */): Promise<void> {
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
    });
  }
}

export { SubmitHelper };
