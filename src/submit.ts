import { formData } from "./types";
import { addData } from "./firebase/addData";
import { updateData } from "./firebase/updateData";

class SubmitHelper {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Store images in the public Uploads folder
   * @param file - The file to store
   * @returns Promise<void>
   */
  private async storeImages(file: File): Promise<void> {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const buffer = Buffer.from(reader.result as ArrayBuffer);
      // fs.writeFileSync(`public/uploads/${file.name}`, buffer);
    };
  }

  /**
   * Submit the form to firestore
   * @param formData - The form data to submit
   * @param index - The index of the
   * @returns void
   */
  public async submit(formData: formData, index: number): Promise<void> {
    await Promise.all(
      formData.files.map(async (file) => {
        await this.storeImages(file);
      }),
    );
    /*addData(`users/${this.userId}/forms`, {
      index,
      createdAt: new Date().toISOString(),
    });*/
  }
}

export { SubmitHelper };
