import { StorageProvider } from "./storage.interface";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR ?? "./public/uploads";
    this.baseUrl = "/uploads";
  }

  async upload(
    file: File,
    prefix: string
  ): Promise<{ url: string; storagePath: string }> {
    const ext = path.extname(file.name);
    const filename = `${randomUUID()}${ext}`;
    const dir = path.join(process.cwd(), this.uploadDir, prefix);
    const fullPath = path.join(dir, filename);
    const storagePath = path.join(prefix, filename).replace(/\\/g, "/");

    await fs.mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buffer);

    return {
      url: `${this.baseUrl}/${storagePath}`,
      storagePath,
    };
  }

  async delete(storagePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), this.uploadDir, storagePath);
    try {
      await fs.unlink(fullPath);
    } catch {
      // File may not exist; ignore
    }
  }

  getPublicUrl(storagePath: string): string {
    return `${this.baseUrl}/${storagePath}`;
  }
}
