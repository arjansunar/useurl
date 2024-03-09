"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ZodSchema, z } from "zod";

type SetUrlValue = (key: string, value: string) => void;
type DeleteUrlValue = (key: string) => void;

/**
 * State management via the URLS
 *
 * @description
 * Major use case:
 *   -> Storing filters data in the URL
 *
 * @example
 * >>> const [value, setValue] = useUrl(schema);
 *
 * @warn DO NOT use as a management for InputForm fields
 * */
export function useUrl<
  Schema extends ZodSchema,
  Output extends z.infer<Schema>
>(schema: Schema): [Output, SetUrlValue, DeleteUrlValue] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const paramsRecord: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    paramsRecord[key] = value;
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(`${name}`, value);
      return params.toString();
    },
    [searchParams]
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(`${name}`);
      return params.toString();
    },
    [searchParams]
  );

  function setValue(key: keyof Output, value: string) {
    return router.replace(
      `${pathname}?${createQueryString(key as string, value)}`,
      {}
    );
  }

  function deleteValue(key: keyof Output) {
    return router.replace(`${pathname}?${deleteQueryString(key as string)}`);
  }

  return [schema.parse(paramsRecord), setValue, deleteValue] as const;
}
