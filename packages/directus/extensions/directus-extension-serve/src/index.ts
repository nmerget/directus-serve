import type { EndpointExtensionContext } from "@directus/extensions";
import type express from "express";
import path from "node:path";
import compression from "compression";
import { INDEX_HTML, sendFileToClient } from "./utils";
import { getConfig } from "./config";

const readFile = async (filesService: any, filename: string) =>
  filesService.readByQuery({
    fields: ["id", "location", "tags"],
    filter: { filename_download: { _eq: filename } },
  });

export default {
  id: process.env.EXTENSION_SERVE_ENDPOINT ?? "serve",
  handler: async (
    router: express.Router,
    context: EndpointExtensionContext,
  ) => {
    const { services, logger, env } = context;
    const { FilesService, AssetsService } = services;

    router.use(compression());

    router.use("*", async (req: any, res: any) => {
      const { contentNotFoundResponse, latestTag } = await getConfig({
        req,
        context,
      });

      try {
        const filesService = new FilesService({
          schema: req.schema,
          accountability: req.accountability,
        });

        const assetsService = new AssetsService({
          accountability: req.accountability,
          schema: req.schema,
        });

        const pathname = req._parsedUrl.pathname;
        const filename =
          pathname === "/" ? INDEX_HTML : path.basename(pathname);

        const data = await readFile(filesService, filename);

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

          return sendFileToClient(req, res, assetsService, foundFile.id, env);
        }
      } catch (e: any) {
        logger.error("Error serving file:" + e.message);
      }

      return res.status(200).send(contentNotFoundResponse);
    });
  },
};
