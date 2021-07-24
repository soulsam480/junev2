export function parseEnv<T extends number | string>(key: string): T {
  return process.env[key] as T;
}

/**
 * Append prefix to a route
 * @param baseRoute
 * @param route
 * This snippet is from {@link https://github.com/typestack/routing-controllers/blob/af0cdf83c070bbc9f1018c09c08c65bdf09fcf64/src/metadata/ActionMetadata.ts#L178}
 */

export function appendBaseRoute(baseRoute: string, route: string): string {
  const prefix = `${baseRoute.length > 0 && baseRoute.indexOf('/') < 0 ? '/' : ''}${baseRoute}`;
  if (typeof route === 'string') return `${prefix}${route}`;
  return route;
}
