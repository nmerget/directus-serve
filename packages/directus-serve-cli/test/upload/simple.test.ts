import { describe, expect, test } from "vitest";
import { uploadAction } from "../../src/commands/upload/action.js";

describe("upload", () => {
  test("no token provided", async () => {
    const upload = await uploadAction({
      dry: true,
      src: "./test/upload/simple",
      ignore: ["**/ignore/**"],
    });
    expect(upload).toBeTruthy();
  });
});
