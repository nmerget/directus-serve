import type { EndpointExtensionContext } from "@directus/extensions";

export const getConfig = async ({
  req,
  context,
}: {
  req: any;
  context: EndpointExtensionContext;
}): Promise<{
  contentNotFoundResponse: string;
  latestTag?: string;
}> => {
  const { services, env } = context;
  const { ItemsService, CollectionsService } = services;
  const queryParams = req.query;

  let contentNotFoundResponse = "Content not found";
  let latestTag: string | undefined = undefined;

  try {
    const collectionsService = new CollectionsService({
      accountability: req.accountability,
      schema: req.schema,
    });
    const serveConfigCollection =
      env.EXTENSION_SERVE_CONFIG_COLLECTION ?? "serve_config";
    const collection = await collectionsService.readOne(serveConfigCollection);
    if (collection) {
      const itemsService = new ItemsService(serveConfigCollection, {
        accountability: req.accountability,
        schema: req.schema,
      });
      const { latest, versionQueryParam, contentNotFound } =
        await itemsService.readSingleton({
          fields: ["id", "latest", "versionQueryParam", "contentNotFound"],
        });
      const queryParamVersion = queryParams?.[versionQueryParam ?? "version"];
      if (queryParamVersion) {
        latestTag = queryParamVersion;
      } else {
        latestTag = latest;
      }

      if (contentNotFound) {
        contentNotFoundResponse = contentNotFound;
      }
    }
  } catch (e) {
    // The serve config can't be found, so we assume the serve config is disabled
  }

  return { contentNotFoundResponse, latestTag };
};
