import { formData } from "./types";
import { addData } from "./firebase/addData";
import { PutBlobResult } from "@vercel/blob";
import imageCompression from "browser-image-compression";

interface ExtendedPutBlobResult extends PutBlobResult {
  filePath: string;
}

class SubmitHelper {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  fetchUploadToken = async () => {
    const response = await fetch("/api/ut", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: this.userId }),
    });
    const { token } = await response.json();
    return token;
  };

  /**
   * Store an image in the public Uploads folder by calling the API
   * @internal
   * @param file - The file to store
   * @returns URL of the stored image
   */
  private async storeImage(file: File): Promise<PutBlobResult> {
    try {
      const uploadToken = await this.fetchUploadToken();

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
      });

      const response = await fetch(
        `/api/upload?filename=${compressedFile.name}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${uploadToken}`,
          },
          body: compressedFile,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      return await response.json();
    } catch (error) {
      console.warn("Error uploading file to storage");
      console.error(error);
      throw error;
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
        formData.files.map((image) => this.storeImage(image)),
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
      throw error;
    }
  }
}

export { SubmitHelper };
