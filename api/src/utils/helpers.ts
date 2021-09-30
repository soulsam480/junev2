import {
  AnyParamConstructor,
  BeAnObject,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose/lib/types';
import { Query, QueryWithHelpers } from 'mongoose';
import { ParsedQs } from './types';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { mongoose } from '@typegoose/typegoose';

export function parseEnv<T extends number | string | boolean>(key: string): T {
  return process.env[key] as T;
}

export function createError(message: string, error?: any) {
  return {
    message,
    error,
  };
}

export function formatResponse<T>(data: T) {
  return {
    data,
  };
}

export async function offsetPaginateResponse<T extends TimeStamps>(
  model: QueryWithHelpers<
    DocumentType<T, BeAnObject>[],
    DocumentType<T, BeAnObject>,
    BeAnObject,
    DocumentType<T, BeAnObject>
  > &
    TimeStamps,
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

export async function cursorPaginateResponse<K extends TimeStamps>(
  model: Query<DocumentType<K, BeAnObject>[], DocumentType<K, BeAnObject>> & TimeStamps,
  cursor: number,
  limit: number,
  total_count: number,
) {
  try {
    let data;
    if (cursor) {
      let decrypedDate = new Date(cursor * 1000);

      //@ts-ignore
      data = await model
        .find({
          createdAt: {
            $lt: new Date(decrypedDate),
          },
        })
        .limit(limit + 1);
      // .exec();
    } else {
      data = await model.find().limit(limit + 1);
      // .exec();
    }

    const has_more = data.length === limit + 1;
    let next_cursor = null;

    if (has_more) {
      const nextCursorRecord = data[limit];
      var unixTimestamp = Math.floor(nextCursorRecord.createdAt!.getTime() / 1000);
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
  //@ts-ignore
  return new mongoose.Types.ObjectId(val);
}

export function normalize(str: string) {
  return str
    .replace(/#|\/|\?|-/g, '')
    .split(' ')
    .join('_');
}

export const streamToString = (stream: any): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
