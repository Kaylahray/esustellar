import * as FileSystem from 'expo-file-system';

const CACHE_DIR = `${FileSystem.cacheDirectory}esustellar_images/`;

/** Ensure the cache directory exists. */
async function ensureCacheDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

/** Derive a stable filename from a URL. */
function cacheKey(url: string): string {
  // Replace non-alphanumeric chars to get a safe filename
  return url.replace(/[^a-zA-Z0-9]/g, '_').slice(-120);
}

/**
 * Returns a local URI for the given remote image URL.
 * Downloads and caches the image on first access; returns the cached
 * path on subsequent calls.
 */
export async function getCachedImageUri(url: string): Promise<string> {
  await ensureCacheDir();
  const localPath = `${CACHE_DIR}${cacheKey(url)}`;
  const info = await FileSystem.getInfoAsync(localPath);
  if (info.exists) {
    return localPath;
  }
  const result = await FileSystem.downloadAsync(url, localPath);
  return result.uri;
}

/**
 * Removes a single cached image.
 */
export async function evictCachedImage(url: string): Promise<void> {
  const localPath = `${CACHE_DIR}${cacheKey(url)}`;
  const info = await FileSystem.getInfoAsync(localPath);
  if (info.exists) {
    await FileSystem.deleteAsync(localPath, { idempotent: true });
  }
}

/**
 * Clears the entire image cache directory.
 */
export async function clearImageCache(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (info.exists) {
    await FileSystem.deleteAsync(CACHE_DIR, { idempotent: true });
  }
}
