import { BeAnObject, DocumentType, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { DocumentQuery } from 'mongoose';
import { ParsedQs } from './types';

export function parseEnv<T extends number | string>(key: string): T {
  return process.env[key] as T;
}

export function createError(message: string, error?: any) {
  return {
    message,
    error,
  };
}

export function sanitizeResponse(
  data: Record<string, string | number | symbol>,
  schema?: string[],
): { [x: string]: any } {
  return !!schema
    ? [
        ...Object.keys(data).map((key) => {
          if (schema.includes(key)) return [key, data[key]];
          return [];
        }),
      ]
        .filter((x) => !!x.length && x)
        .reduce((o, [key, val]) => ({ ...o, [key]: val }), {})
    : Object.keys(data).reduce(
        (o, key) => (key.match(/_/) ? { ...o } : { ...o, [key]: data[key] }),
        {},
      );
}

export function formatResponse<T>(data: T) {
  return {
    data,
  };
}

declare type Class<T = any> = new (...args: any[]) => T;

export async function paginateResponse<T = Class<any>>(
  model: DocumentQuery<DocumentType<T>[], DocumentType<T>, BeAnObject> & BeAnObject,
  page: number,
  limit: number,
  total_count: number,
) {
  const total_pages = Math.ceil(total_count / limit);

  const offset = page * limit;

  try {
    const data = await model.skip(offset).limit(limit);

    return {
      data: data.map((entity) => ({ ...sanitizeResponse(entity.toJSON()) })),
      total_count,
      total_pages,
      current_page: page,
    };
  } catch (error) {
    throw error;
  }
}

function constructModelQuery(query: ParsedQs) {
  return Object.keys(query)
    .map((key) => {
      return { [key]: { $regex: RegExp(`^${query[key]}`) } };
    })
    .reduce((o, val) => ({ ...o, ...val }), {});
}

export async function filterFromQuery<T extends Class<any>>(
  query: ParsedQs,
  model: ReturnModelType<T, BeAnObject>,
  schema: string[],
) {
  if (!Object.keys(query).every((key) => schema.includes(key)))
    return Promise.reject('filter key not in model schema !');

  if (!Object.keys(query).length) return await model.find().select('id name username');

  //@ts-ignore
  const results = await model.find({ ...constructModelQuery(query) }).select('id name username');
  return results.map((val) => sanitizeResponse(val.toJSON()));
}
