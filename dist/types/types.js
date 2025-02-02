"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/types/types.ts
var types_exports = {};
module.exports = __toCommonJS(types_exports);
var import_zod = require("zod");
var userBodySchema = import_zod.z.object({
  name: import_zod.z.string(),
  email: import_zod.z.string(),
  password: import_zod.z.string()
});
var userTokenSchema = import_zod.z.object({
  email: import_zod.z.string(),
  password: import_zod.z.string()
});
var taskBodySchema = import_zod.z.object({
  title: import_zod.z.string(),
  description: import_zod.z.string(),
  dueDate: import_zod.z.date()
});
var paramsSchema = import_zod.z.object({
  id: import_zod.z.string().uuid()
});
