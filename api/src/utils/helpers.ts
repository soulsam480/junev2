import {
  AnyParamConstructor,
  BeAnObject,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose/lib/types';
import { Query } from 'mongoose';
import { ParsedQs } from './types';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

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

export async function offsetPaginateResponse<T extends TimeStamps>(
  model: Query<DocumentType<T>[]> & TimeStamps,
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
    Promise.reject(error);
  }
}

export async function cursorPaginateResponse<T extends TimeStamps>(
  model: Query<DocumentType<T>[]> & TimeStamps,
  cursor: number,
  limit: number,
  total_count: number,
) {
  try {
    let data;
    if (cursor) {
      let decrypedDate = new Date(cursor * 1000);

      data = await model
        .find({
          updatedAt: {
            $lt: new Date(decrypedDate),
          },
        })
        .sort({ updatedAt: -1 })
        .limit(limit + 1)
        .exec();
    } else {
      data = await model
        .find({})
        .sort({ updatedAt: -1 })
        .limit(limit + 1);
    }

    const has_more = data.length === limit + 1;
    let next_cursor = null;

    if (has_more) {
      const nextCursorRecord = data[limit];
      var unixTimestamp = Math.floor(nextCursorRecord.updatedAt.getTime() / 1000);
      next_cursor = unixTimestamp.toString();
      data.pop();
    }

    return {
      data: data.map((entity) => ({ ...sanitizeResponse(entity.toJSON()) })),
      total_count,
      has_more,
      next_cursor,
    };
  } catch (error) {
    Promise.reject(error);
  }
}

function constructModelQuery(query: ParsedQs) {
  return Object.keys(query)
    .map((key) => {
      return {
        [key]: { $regex: RegExp(`^${(query[key] as string).replace(/[.<>*()?]/g, '\\$&')}`, 'i') },
      };
    })
    .reduce((o, val) => ({ ...o, ...val }), {});
}

export async function filterFromQuery<T extends AnyParamConstructor<any>>(
  query: ParsedQs,
  model: ReturnModelType<T, BeAnObject>,
  schema: string[],
  config?: { select?: string },
) {
  const mappedQueries = Object.keys(query)
    .map((key) => (schema.includes(key) ? key : undefined))
    .filter((x) => !!x)
    .reduce((o, key) => ({ ...o, [key as string]: query[key as string] }), {});

  if (!Object.keys(mappedQueries).length || Object.values(mappedQueries).every((el) => !el))
    return formatResponse([]);

  const results = await model
    //@ts-ignore
    .find({ ...constructModelQuery(mappedQueries) })
    .select(config?.select)
    .limit(parseInt(query.limit as string) || 5);

  return formatResponse(results.map((val) => sanitizeResponse(val.toJSON())));
}
