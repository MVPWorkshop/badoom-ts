import { HttpRequestInterface } from './httpRequest';
import HttpResponse, { HttpResponseInterface } from './httpResponse';
import { Response, Request, NextFunction } from 'express';
import { validate } from 'class-validator';
import HttpError from './httpError';

export default function requestType(HttpRequest: HttpRequestInterface) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const request = new HttpRequest();
      Object.assign(request, req.body);

      const errors = await validate(request, {validationError: {target: false}});

      if (errors.length > 0) {
        return res.status(400).send(errors);
      }

      const result: HttpResponse | HttpError = await originalFunction(req, res, request, next);

      res.status(result.code).json(result.toJson());
    };

    return descriptor;
  };
}
