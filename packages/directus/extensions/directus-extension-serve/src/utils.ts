export const INDEX_HTML = "index.html";

export function parseDurationToMs(duration: string): number | boolean {
  const regex = /^(\d+)([dhms])$/;
  const match = duration.match(regex);

  if (!match) return false;

  const value = parseInt(match[1] ?? "", 10);
  const unit = match[2];

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
      return value * 1000;
    default:
      return false;
  }
}

export const sendFileToClient = async (
  req: any,
  res: any,
  assetsService: any,
  id: string,
  env: any,
) => {
  const { stream, file, stat } = await assetsService.getAsset(
    id,
    undefined,
    undefined,
    true,
  );

  const filename = req.params["filename"] ?? file.filename_download;
  res.attachment(filename);
  res.setHeader("Content-Type", file.type);
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Length", stat.size);
  res.setHeader(
    "Cache-Control",
    `private, max-age=${parseDurationToMs(env.ASSETS_CACHE_TTL) ?? 2592000}`,
  );
  res.setHeader("Vary", "Origin, Cache-Control");

  const unixTime = Date.parse(file.modified_on);

  if (!Number.isNaN(unixTime)) {
    const lastModifiedDate = new Date(unixTime);
    res.setHeader("Last-Modified", lastModifiedDate.toUTCString());
  }
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

  (await stream())
    .on("error", () => {
      if (!res.headersSent) {
        res.removeHeader("Content-Type");
        res.removeHeader("Content-Disposition");
        res.removeHeader("Cache-Control");

        res.status(500).json({
          errors: [
            {
              message: "An unexpected error occurred.",
              extensions: {
                code: "INTERNAL_SERVER_ERROR",
              },
            },
          ],
        });
      } else {
        res.end();
      }
    })
    .pipe(res);
};
