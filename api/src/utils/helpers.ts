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
