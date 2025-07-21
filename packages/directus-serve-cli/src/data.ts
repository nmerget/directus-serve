import { uploadOptions } from "./commands/upload/data.js";
import { uploadAction } from "./commands/upload/action.js";

export const programName = "directus-serve";
export const programDescription =
  "Tool to manage files for directus serve extension";

export type Command = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (...args: any[]) => void | Promise<any>;
  description?: string;
  options?: ProgramOptionsType[];
};

export type ProgramOptionsType = {
  name: string;
  short?: string;
  long?: string;
  array?: boolean;
  required?: boolean;
  description?: string;
  defaultValue?: string | boolean | string[];
};

export const UPLOAD_COMMAND = "upload";

export const commands: Command[] = [
  {
    name: UPLOAD_COMMAND,
    description:
      "Upload a folder to the Directus instance with correct path as location.",
    options: uploadOptions,
    action: uploadAction,
  },
];
