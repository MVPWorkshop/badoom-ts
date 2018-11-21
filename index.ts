import { Provider } from './http/provider';
import { RouteHandler } from './http/routeHandler';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerUrl: `/api-doc`
};

export function app(value: any) {
  return function (constructor: any) {
    const controllers = value.controllers;
    if (controllers && controllers.length > 0) {
      controllers.forEach((controller: any) => {
        Provider.getDefaultProvider().register(Symbol(controller.name), controller);
      });
    }

    const express = value.express.provider;
    constructor.prototype.express = express;
    const beforeMiddleware = value.express.beforeMiddleware;
    const afterMiddleware = value.express.afterMiddleware;
    const setters = value.express.setters;

    for (const key in setters) {
      express.set(key, setters[key]);
    }

    if (beforeMiddleware && beforeMiddleware.length > 0) {
      beforeMiddleware.forEach((middleware: any) => {
        express.use(middleware);
      });
    }

    if (process.env['NODE_ENV'] !== 'production') {
      express.use('/swagger', swaggerUi.serve, swaggerUi.setup(undefined, options));
    }

    RouteHandler.RegisterToExpress(express);

    if (afterMiddleware && afterMiddleware.length > 0) {
      afterMiddleware.forEach((middleware: any) => {
        express.use(middleware);
      });
    }

  };
}



export { default as Http } from './http/index';
export { default as Logger } from './util/logger';
export { default as Docs } from './docs/index';

