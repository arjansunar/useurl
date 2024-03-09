import { ZodType, z } from "zod";

function createFallbackSchema<T extends ZodType>(schema: T) {
  return function (fallback: any = undefined) {
    return schema.catch(fallback);
  };
}

export const urlSchema = {
  date: createFallbackSchema(z.date().optional()),
  string: createFallbackSchema(z.string().optional()),
  number: createFallbackSchema(z.number().optional()),
};
