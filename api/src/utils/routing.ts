/**
 * A dango spinoff for routing
 * @author Sambit Sahoo
 * @license MIT
 */

import { FastifyInstance, HTTPMethods, RouteHandler } from 'fastify';
import { appendBaseRoute } from './helpers';

interface Route {
  method: HTTPMethods;
  url: string;
  handler: RouteHandler;
}

interface ControllerOpts {
  prefix?: string;
}

export function createController(routes: Route[], opts?: ControllerOpts) {
  return (app: FastifyInstance) => {
    routes.forEach((route) => {
      app.route({
        ...route,
        url: opts && opts.prefix ? appendBaseRoute(opts.prefix, route.url) : route.url,
      });
    });
  };
}

export function createRoute(route: Route) {
  return route;
}
