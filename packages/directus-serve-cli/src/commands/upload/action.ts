import { UploadConfigType } from "./data.js";
import { startConfigProcess } from "../../utils/config-process.js";
import { UPLOAD_COMMAND } from "../../data.js";
import { upload } from "./index.js";

export const uploadAction = async (passedConfig: UploadConfigType) => {
  const config = await startConfigProcess(UPLOAD_COMMAND, passedConfig);

  return await upload(config);
};
