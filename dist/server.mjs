import {
  app_default
} from "./chunk-5R6NPHV7.mjs";
import "./chunk-D4LUF23Q.mjs";
import "./chunk-KNF7AIAK.mjs";
import "./chunk-3TW2SMPE.mjs";
import "./chunk-IQJYFE7P.mjs";
import "./chunk-RSQU7O5N.mjs";
import "./chunk-Y4O45TBE.mjs";
import "./chunk-6WLVXSUQ.mjs";

// src/server.ts
try {
  app_default.listen({ port: Number(process.env.PORT) || 4e3 });
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
} catch (error) {
  console.error("Error starting the server:", error);
  process.exit(1);
}
