import { Provider } from './http/provider';
import { RouteHandler } from './http/routeHandler';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerUrl: `/api-doc`
};

export function app(value: any) {
  return function (constructor: any) {
    const {controllers, application} = value;

    if (controllers && controllers.length > 0) {
      controllers.forEach((controller: any) => {
        Provider.getDefaultProvider().register(Symbol(controller.name), controller);
      });
    }

    const express = application.provider;
    constructor.prototype.express = express;
    const middlewares = application.middlewares;
    const setters = application.setters;

    for (const key in setters) {
      express.set(key, setters[key]);
    }

    if (middlewares && middlewares.length > 0) {
      middlewares.forEach((middleware: any) => {
        express.use(middleware);
      });
    }

    express.use('/swagger', swaggerUi.serve, swaggerUi.setup(undefined, options));

    RouteHandler.RegisterToExpress(express);
  };
}
