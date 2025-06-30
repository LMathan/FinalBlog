// netlify/functions/api.ts
import app from "../../server/index";
import serverless from "serverless-http";
import app from "../../src/index";

export const handler = serverless(app);
