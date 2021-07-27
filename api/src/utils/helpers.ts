export function parseEnv<T extends number | string>(key: string): T {
  return process.env[key] as T;
}

export function cerateError(message: string, error?: any) {
  return {
    message,
    error,
  };
}
