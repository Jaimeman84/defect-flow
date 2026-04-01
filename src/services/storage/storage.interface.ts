export interface StorageProvider {
  upload(
    file: File,
    path: string
  ): Promise<{ url: string; storagePath: string }>;
  delete(storagePath: string): Promise<void>;
  getPublicUrl(storagePath: string): string;
}
