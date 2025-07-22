import { ensureUrlProtocol } from "../utils";
import { request } from "directus:api";
import { DirectusFile } from "./data";

export const readFile = async (
  host: string,
  filename: string,
): Promise<DirectusFile[]> => {
  const url = `${ensureUrlProtocol(host)}/files?fields=id,location,tags&filter[filename_download]=${filename}`;
  const response = await request(url, {
    method: "GET",
  });

  if (typeof response.data === "string" || !response.data.data) {
    return [];
  }

  return response.data.data as DirectusFile[];
};

export const streamFileData = async (
  host: string,
  fileId: string,
): Promise<string | undefined> => {
  const url = `${ensureUrlProtocol(host)}/assets/${fileId}`;
  const response = await request(url, {
    method: "GET",
  });

  if (typeof response.data === "string") {
    return response.data;
  }

  return undefined;
};
