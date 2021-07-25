/**
 * A dango spinoff for routing
 * @author Sambit Sahoo
 * @license MIT
 */

import { FastifyInstance, HTTPMethods, RouteHandler } from 'fastify';
import { FastifyAuthFunction } from 'fastify-auth';
import { appendBaseRoute } from 'src/utils/helpers';

interface Route {
  method: HTTPMethods;
  url: string;
  handler: RouteHandler;
  fAuthHandler?: FastifyAuthFunction[];
}

interface AuthOpts {
  run?: 'all';
  relation?: 'and' | 'or';
}
interface ControllerOpts {
  prefix?: string;
  fAuthHandler?: FastifyAuthFunction[];
  authOpts?: AuthOpts;
}

export function createController(routes: Route[], opts?: ControllerOpts) {
  opts = opts ? opts : {};
  let { fAuthHandler: GlobalAuthHandler, authOpts, prefix } = opts;

  return (app: FastifyInstance) => {
    routes.forEach(({ fAuthHandler, url, ...rest }) => {
      const modRoute: any = {
        ...rest,
        url: opts && prefix ? appendBaseRoute(prefix, url) : url,
      };

      if (
        (fAuthHandler && fAuthHandler.length > 0) ||
        (GlobalAuthHandler && GlobalAuthHandler.length > 0)
      ) {
        fAuthHandler = !!fAuthHandler ? fAuthHandler : [];
        GlobalAuthHandler = !!GlobalAuthHandler ? GlobalAuthHandler : [];

        modRoute.preHandler = app.auth([...GlobalAuthHandler, ...fAuthHandler], {
          ...authOpts,
        });
      }

      app.route({
        ...modRoute,
      });
    });
  };
}

export function createRoute(route: Route) {
  return route;
}
