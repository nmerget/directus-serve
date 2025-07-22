import { extractQueryParams, getBasename, INDEX_HTML } from "./utils";
import { log, type SandboxEndpointRouter } from "directus:api";
import { getConfig } from "./requests/config";
import { readFile, streamFileData } from "./requests/files";

export default (router: SandboxEndpointRouter) => {
  router.get("/*", async ({ url, headers }) => {
    const { host } = headers;
    const queryParams = extractQueryParams(url);

    const { contentNotFoundResponse, latestTag } = await getConfig({
      host: host!,
      queryParams,
    });

    try {
      const pathname = url.split("?")[0] ?? "/";
      const filename = pathname === "/" ? INDEX_HTML : getBasename(pathname);

      const data = await readFile(host!, filename);

      if (data && data.length > 0) {
        const filteredFiles = data.filter(
          (file: any) => !latestTag || file.tags?.includes(latestTag),
        );
        let foundFile: any;
        if (filteredFiles.length > 0) {
          foundFile =
            filteredFiles.find((file: any) => file.location === pathname) ??
            filteredFiles[0];
        } else {
          foundFile =
            data.find((file: any) => file.location === pathname) ?? data[0];
        }

        const fileContent = await streamFileData(host!, foundFile.id);

        if (fileContent) {
          return { status: 200, body: fileContent };
        }
      }
    } catch (e: any) {
      log("Error serving file: " + e.message);
    }

    return { status: 200, body: contentNotFoundResponse };
  });
};
