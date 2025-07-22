import { ensureUrlProtocol } from "../utils";
import { request } from "directus:api";
import { ServeConfig } from "./data";

export const getConfig = async ({
  host,
  queryParams,
}: {
  queryParams: Record<string, string>;
  host: string;
}): Promise<{
  contentNotFoundResponse: string;
  latestTag?: string;
}> => {
  const serveConfigCollection = "serve_config";
  let contentNotFoundResponse = "Content not found";
  let latestTag: string | undefined = undefined;

  try {
    const configUrl = `${ensureUrlProtocol(host)}/items/${serveConfigCollection}`;
    const response = await request(configUrl, {
      method: "GET",
    });

    if (typeof response.data === "string" || !response.data.data) {
      return { contentNotFoundResponse };
    }

    const { latest, versionQueryParam, contentNotFound } = response.data
      .data as ServeConfig;

    const queryParamVersion = queryParams?.[versionQueryParam ?? "version"];
    if (queryParamVersion) {
      latestTag = queryParamVersion;
    } else {
      latestTag = latest;
    }

    if (contentNotFound) {
      contentNotFoundResponse = contentNotFound;
    }
  } catch (e: any) {
    // The serve config can't be found, so we assume the serve config is disabled
  }

  return { contentNotFoundResponse, latestTag };
};
