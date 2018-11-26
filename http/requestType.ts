import { HttpRequestInterface } from './httpRequest';
import HttpResponse from './httpResponse';
import { Response, Request, NextFunction } from 'express';
import { validate } from 'class-validator';

export default function requestType(HttpRequest: HttpRequestInterface | any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const request = new HttpRequest();
      Object.assign(request, req.body);
      Object.assign(request, req.files);

      const errors = await validate(request, {validationError: {target: false}});

      if (errors.length > 0) {
        return res.status(400).send(errors);
      }

      const result: any = await originalFunction(req, request, res, next);

      if (result instanceof HttpResponse) {
        res.status(result.code).set(result.headers).json(result.toJSON());
        return;
      }

      if (result) {
        res.json(result);
      }
    };

    Reflect.defineMetadata('design:open_api_request_type', HttpRequest, target, propertyKey);
    Reflect.defineMetadata('wrapped_response_function', true, target, propertyKey);

    return descriptor;
  };
}
