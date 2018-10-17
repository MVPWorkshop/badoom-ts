import { Provider } from './provider';
import { RequestHandler } from 'express';
import { Express } from 'express-serve-static-core';
import { HttpMethod } from './httpMethod';

export class RouteHandler {
  private static provider = Provider.getDefaultProvider();
  private static routes: Route[] = [];

  public static createRoute(name: string, method: HttpMethod, path: string, middlewares: any[]) {
    const route = new Route(name, method, path, middlewares);
    this.routes.push(route);
  }

  public static RegisterToExpress(express: Express) {
    this.routes.forEach(route => {
      switch (route.method) {
        case HttpMethod.GET:
          express.get(route.path, route.middlewares);
          break;
        case HttpMethod.POST:
          express.post(route.path, route.middlewares);
          break;
        case HttpMethod.PUT:
          express.put(route.path, route.middlewares);
          break;
        case HttpMethod.DELETE:
          express.delete(route.path, route.middlewares);
          break;
        default:
          express.get(route.path, route.middlewares);
          break;
      }
    });
  }

  public static GetAllRoutes(): Route[] {
    return this.routes;
  }
}

class Route {
  name: string;
  method: HttpMethod;
  path: string;
  middlewares: RequestHandler[];

  constructor(name: string, method: HttpMethod, path: string, middlewares: RequestHandler[]) {
    this.name = name;
    this.method = method;
    this.path = path;
    this.middlewares = middlewares;
  }
}
