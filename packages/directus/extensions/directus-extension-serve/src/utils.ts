export const INDEX_HTML = "index.html";

/**
 * Parses a duration string into milliseconds.
 *
 * @param duration - A string representing the duration (e.g., "1d", "2h", "30m", "45s").
 * @returns The duration in milliseconds, or false if the input is invalid.
 */
export function parseDurationToMs(duration: string): number | boolean {
  // Regular expression to match the duration format (e.g., "1d", "2h", "30m", "45s").
  const regex = /^\d+[dhms]$/;
  const match = duration.match(regex);
  if (!match) return false;

  const value = parseInt(match[1] ?? "", 10); // Extract the numeric value.
  const unit = match[2]; // Extract the unit (d, h, m, s).

  // Convert the duration to milliseconds based on the unit.
  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000; // Days to milliseconds.
    case "h":
      return value * 60 * 60 * 1000; // Hours to milliseconds.
    case "m":
      return value * 60 * 1000; // Minutes to milliseconds.
    case "s":
      return value * 1000; // Seconds to milliseconds.
    default:
      return false; // Invalid unit.
  }
}

/**
 * Generates the headers for a file response.
 * @param filename - The name of the file to be served.
 */
export const getFileHeaders = async (
  filename: string,
): Promise<Record<string, any>> => {
  const header: Record<string, string> = {};

  // Set the Content-Type header based on the file's MIME type.
  header["Content-Type"] = getMimeType(filename);

  // Set the Cache-Control header to allow private caching for 30 days.
  header["Cache-Control"] = `private, max-age=2592000`;
  header["Vary"] = "Origin, Cache-Control";

  return header;
};

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

/**
 * Returns the MIME type based on the file extension of the given filename.
 *
 * @param filename - The name of the file to determine the MIME type for.
 * @returns The MIME type as a string, or 'application/octet-stream' if unknown.
 */
export function getMimeType(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    txt: "text/plain",
    xml: "application/xml",
    zip: "application/zip",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "audio/ogg",
    wav: "audio/wav",
    ico: "image/x-icon",
  };

  return mimeTypes[extension || ""] || "application/octet-stream";
}
