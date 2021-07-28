export function parseEnv<T extends number | string>(key: string): T {
  return process.env[key] as T;
}

export function cerateError(message: string, error?: any) {
  return {
    message,
    error,
  };
}

export function sanitizeResponse(
  schema: string[],
  data: Record<string, string | number | symbol>,
): { [x: string]: any } {
  return [
    ...Object.keys(data).map((key) => {
      if (schema.includes(key)) return [key, data[key]];
      return [];
    }),
  ]
    .filter((x) => !!x.length && x)
    .reduce((o, [key, val]) => ({ ...o, [key]: val }), {});
}
