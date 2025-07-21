import { UploadConfigType } from "./data.js";
import { config } from "@dotenvx/dotenvx";
import { createDirectus, rest, staticToken, uploadFiles } from "@directus/sdk";
import * as path from "path";
import { existsSync, readFileSync } from "node:fs";
import { sync } from "glob";
import fs from "node:fs";

export const findPath = (startDir: string, find: string): string | null => {
  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    const envFilePath = path.join(currentDir, find);
    if (fs.existsSync(envFilePath)) {
      return envFilePath;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
};

export const upload = async (
  uploadConfig: UploadConfigType,
): Promise<boolean> => {
  const {
    dry,
    src,
    ignore = [],
    uploadFolder,
    directusUrl = "http://localhost:8055/",
    directusToken,
    debug,
  } = uploadConfig;

  if (!src) {
    console.error("No upload folder provided");
    return false;
  }

  const log = (...args: any[]) => {
    if (debug) {
      console.log(...args);
    }
  };

  let token = process.env.DIRECTUS_ACCESS_TOKEN ?? directusToken;
  if (!token) {
    const envFilePath = findPath(src, ".env");
    if (envFilePath) {
      config({ path: envFilePath });
      log(`Loaded .env file from ${envFilePath}`);
    } else {
      console.warn("No .env file found in parent directories");
    }

    token = process.env.DIRECTUS_ACCESS_TOKEN;

    if (!token) {
      console.error("No Token provided");
      return false;
    }
  }

  try {
    log("Creating Directus client with URL:", directusUrl);
    const client = createDirectus(directusUrl!)
      .with(staticToken(token))
      .with(rest());
    let version: string | undefined;

    log("Search option version in package.json");
    const packageJsonPath = findPath(src, "package.json");

    // Read version from package.json
    if (packageJsonPath && existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      version = packageJson.version;
    }

    const files = sync("**/*", {
      cwd: src,
      nodir: true,
      absolute: true,
      ignore,
    });

    for (const filePath of files) {
      log("Uploading file:", filePath);
      const file = new Blob([readFileSync(filePath)]);
      const fileName = path.basename(filePath);
      const relativeLocation = path.relative(src, filePath);
      const location = relativeLocation.replaceAll("\\", "/");

      // Upload file to Directus
      const formData = new FormData();
      formData.append("title", fileName);
      if (uploadFolder) {
        formData.append("folder", uploadFolder);
      }
      if (version) {
        formData.append("tags", JSON.stringify([version]));
      }
      formData.append("location", location);
      formData.append("file", file, fileName);

      if (dry) {
        const dryOutput = { fileName, uploadFolder, version, location };
        console.log(dryOutput);
      } else {
        await client.request(uploadFiles(formData));
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
};
