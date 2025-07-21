import { ProgramOptionsType } from "../../data.js";
import {
  configOption,
  ConfigType,
  DebugConfigType,
  debugOption,
  DryConfigType,
  dryRunOption,
  IgnoreConfigType,
  ignoreOption,
  SrcConfigType,
  srcOption,
} from "../../utils/shared.js";

export type UploadConfigType = {
  uploadFolder?: string;
  directusToken?: string;
  directusUrl?: string;
} & DryConfigType &
  DebugConfigType &
  ConfigType &
  SrcConfigType &
  IgnoreConfigType;

export const uploadOptions: ProgramOptionsType[] = [
  {
    short: "u",
    name: "directusUrl",
    description: "URL of Directus URL",
    required: true,
  },
  {
    short: "t",
    name: "directusToken",
    description: "Token of Directus user with upload permissions.",
    required: false,
  },
  {
    short: "f",
    name: "uploadFolder",
    description: "ID of directus folder where files should be uploaded.",
    required: false,
  },
  srcOption,
  dryRunOption,
  debugOption,
  configOption,
  ignoreOption,
];
