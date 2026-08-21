import 'dotenv/config'
import { BlobServiceClient, ContainerClient, BlockBlobClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { randomUUID } from "crypto";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "uploads";
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

const containerClient: ContainerClient = blobServiceClient.getContainerClient(containerName);

export interface UploadResult {
  blobName: string;
  url: string;
  size: number;
  contentType: string;
}

/**
 * Upload a File (from Hono multipart) to Azure Blob Storage
 */
export async function uploadFile(
  file: File,
  options?: { prefix?: string }
): Promise<UploadResult> {
  const blobName = options?.prefix
    ? `${options.prefix}/${randomUUID()}-${file.name}`
    : `${randomUUID()}-${file.name}`;

  const blockBlobClient: BlockBlobClient =
    containerClient.getBlockBlobClient(blobName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: file.type || "application/octet-stream",
    },
  });

  return {
    blobName,
    url: blockBlobClient.url,
    size: file.size,
    contentType: file.type,
  };
}

/**
 * Download a blob and return its readable stream + metadata
 */
export async function downloadFile(blobName: string) {
  const blobClient = containerClient.getBlobClient(blobName);

  const exists = await blobClient.exists();
  if (!exists) {
    return null;
  }

  const properties = await blobClient.getProperties();
  const downloadResponse = await blobClient.download();

  if (!downloadResponse.readableStreamBody) {
    throw new Error("Failed to get readable stream for blob");
  }

  return {
    stream: downloadResponse.readableStreamBody,
    contentType: properties.contentType || "application/octet-stream",
    contentLength: properties.contentLength,
    blobName,
  };
}

/**
 * Delete a blob
 */
export async function deleteFile(blobName: string): Promise<boolean> {
  const blobClient = containerClient.getBlobClient(blobName);
  const result = await blobClient.deleteIfExists();
  return result.succeeded;
}

/**
 * Check if a blob exists
 */
export async function fileExists(blobName: string): Promise<boolean> {
  const blobClient = containerClient.getBlobClient(blobName);
  return blobClient.exists();
}
