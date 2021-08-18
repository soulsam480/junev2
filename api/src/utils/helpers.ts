import {
  AnyParamConstructor,
  BeAnObject,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose/lib/types';
import { Query } from 'mongoose';
import { ParsedQs } from './types';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { mongoose } from '@typegoose/typegoose';

// const toString = Object.prototype.toString;

export function parseEnv<T extends number | string | boolean>(key: string): T {
  return process.env[key] as T;
}

export function createError(message: string, error?: any) {
  return {
    message,
    error,
  };
}

// type MaybeObjArrStrNum =
//   | { [x: string]: MaybeObjArrStrNum }
//   | (MaybeObjArrStrNum | string | number)[]
//   | string
//   | number;

// export function sanitizeResponse(data: {
//   [x: string]: MaybeObjArrStrNum;
// }): { [x: string]: any } | { [x: string]: any }[] {
//   function sanitizeObject(data: { [x: string]: string | number }) {
//     return Object.keys(data).reduce(
//       (o, key) => (key.startsWith('_') ? { ...o } : { ...o, [key]: data[key] }),
//       {},
//     );
//   }

//   function sanitizeArray(dat: (MaybeObjArrStrNum | string | number)[]): any[] {
//     return dat.map((el) => {
//       if (Array.isArray(el)) return sanitizeArray(el);
//       if (el.toString() === '[object Object]') return sanitizeResponse(el as any);
//       return el;
//     });
//   }

//   return Object.keys(data).reduce<{ [x: string]: any }>((o, key) => {
//     if (!key.startsWith('_')) {
//       if (
//         toString.call(data[key]) === '[object Object]' &&
//         Object.values(data[key]).every(
//           (value) => !['[object Object]', '[object Array]'].includes(toString.call(value)),
//         )
//       ) {
//         o[key] = sanitizeObject(data[key] as any);
//       } else if (
//         toString.call(data[key]) === '[object String]' ||
//         toString.call(data[key]) === '[object Number]'
//       ) {
//         o[key] = data[key];
//       } else if (Array.isArray(data[key])) {
//         o[key] = sanitizeArray(data[key] as any[]);
//       } else if (toString.call(data[key]) === '[object Object]') {
//         o[key] = sanitizeResponse(data[key] as any);
//       } else {
//         o[key] = data[key];
//       }
//     }
//     return o;
//   }, {});
// }

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
      data,
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
        .find()
        .sort({ updatedAt: -1 })
        .limit(limit + 1)
        .exec();
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
      data,
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

  return formatResponse(results);
}

export function getObjectId(val: string) {
  return new mongoose.Types.ObjectId(val);
}
