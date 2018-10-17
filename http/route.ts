import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpMethod } from './httpMethod';
import { RouteHandler } from './routeHandler';
import openAPI, { Doc } from '../docs/openAPI';
import HttpResponse, { HttpResponseInterface } from './httpResponse';
import 'reflect-metadata';

export interface AdditionalOptions {
    before?: RequestHandler[];
    after?: RequestHandler[];
}

function isAdditionalOptions(additionalOption: AdditionalOptions | any[]): additionalOption is AdditionalOptions {
    return additionalOption && ((<AdditionalOptions>additionalOption).before !== undefined || (<AdditionalOptions>additionalOption).after !== undefined);
}

export function route(method: HttpMethod, path: string, additional?: any[] | AdditionalOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let middlewares: RequestHandler[] = [];

        parseRequests(target, propertyKey, descriptor);
        parseResponses(target, propertyKey, descriptor);

        if (!Reflect.getMetadata('wrapped_response_function', target, propertyKey)) {
            descriptor.value = wrapResponse(descriptor.value);
        }

        if (isAdditionalOptions(additional)) {
            if (additional.before) {
                middlewares.push.apply(middlewares, additional.before);
            }

            middlewares.push(descriptor.value);

            if (additional.after) {
                middlewares.push.apply(middlewares, additional.after);
            }
        } else {
            middlewares = [descriptor.value];
        }

        RouteHandler.createRoute(target.constructor.name + '-' + propertyKey, method, path, middlewares);

        return descriptor;
    };
}

function parseRequests(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metadata = Reflect.getMetadata('design:open_api_types', target, propertyKey);
}

function parseResponses(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    const types: HttpResponseInterface[] = Reflect.getMetadata('design:open_api_types', target, propertyKey);

    if (!types || !types.length) {
        return;
    }

    types.forEach(responseType => {
        const response = new responseType();

        if (!response.code) {
            return;
        }

        const code: number = response.code;
        const componentPath: string = openAPI.addComponent(responseType);
    });
}

function wrapResponse(originalFunction: any): any {
    return async function (req: Request, res: Response, next: NextFunction) {
        const result: any = await originalFunction(req, res, next);

        if (result instanceof HttpResponse) {
            res.status(result.code).json(result.toJson());
            return;
        }

        if (result) {
            res.json(result);
        }
    };
}