import { createDirectus, rest } from "@directus/sdk";

const BACKEND_URL = "http://localhost:8055/";

const client = createDirectus(BACKEND_URL).with(
  rest({ credentials: "include" }),
);

export default client;
