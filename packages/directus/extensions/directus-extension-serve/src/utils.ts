export const INDEX_HTML = "index.html";

/**
 * Extracts query parameters from a given URL.
 *
 * @param url - The URL string to extract query parameters from.
 * @returns An object containing key-value pairs of query parameters.
 */
export function extractQueryParams(url: string): Record<string, string> {
  const queryParams: Record<string, string> = {};

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
  } catch (error) {
    console.error("Invalid URL provided:", error);
  }

  return queryParams;
}

/**
 * Ensures a URL has a valid protocol prefix (http or https).
 * Adds "http" for localhost and "https" for other hosts if no protocol is provided.
 *
 * @param url - The URL string to validate and modify if necessary.
 * @returns The URL with the appropriate protocol prefix.
 */
export function ensureUrlProtocol(url: string): string {
  try {
    new URL(url);
    return url; // URL already has a protocol
  } catch {
    // If URL constructor fails, assume no protocol is present
    if (url.startsWith("localhost")) {
      return `http://${url}`;
    }
    return `https://${url}`;
  }
}

/**
 * Extracts the last portion of a path, similar to `path.basename` in Node.js.
 *
 * @param path - The full path string.
 * @returns The last portion of the path.
 */
export function getBasename(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).pop() || "";
}
