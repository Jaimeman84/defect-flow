import { LocalStorageProvider } from "./local.storage";
import type { StorageProvider } from "./storage.interface";

// Future: switch based on env var
// if (process.env.STORAGE_PROVIDER === "s3") return new S3StorageProvider()
export function getStorageProvider(): StorageProvider {
  return new LocalStorageProvider();
}
