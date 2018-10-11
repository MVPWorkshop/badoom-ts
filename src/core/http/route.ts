import { Request, Response, NextFunction, RequestHandler } from 'express';
import { HttpMethod } from './httpMethod';
import { RouteHandler } from './routeHandler';
import openAPI, { Doc } from '../docs/openAPI';
import HttpResponse, { HttpResponseInterface } from './httpResponse';
import 'reflect-metadata';
import { Role } from '../../auth/role';
import passport from 'passport';

import './isAuthenticated';
import User from '../../database/models/user.model';
import UnauthorizedError from '../../http/errors/unauthorizedError';

export interface AdditionalOptions {
    doc?: Doc;
    middleware?: any[];
    role?: Role;
}

function isAdditionalOptions(additionalOption: AdditionalOptions | any[]): additionalOption is AdditionalOptions {
    return additionalOption && ((<AdditionalOptions>additionalOption).doc !== undefined ||
        (<AdditionalOptions>additionalOption).middleware !== undefined ||
        (<AdditionalOptions>additionalOption).role !== undefined);
}

export function route(method: HttpMethod, path: string, additional?: any[] | AdditionalOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let middlewares;
        let role: Role;

        if (isAdditionalOptions(additional)) {
            middlewares = additional.middleware;
            role = additional.role;
        }

        if (!middlewares) {
            middlewares = [];
        }

        if (role) {
            middlewares.push(passport.authenticate('jwt', {session: false}));
            middlewares.push(authorize(role));
        }

        parseRequests(target, propertyKey, descriptor);
        parseResponses(target, propertyKey, descriptor);

        if (!Reflect.getMetadata('wrapped_response_function', target, propertyKey)) {
            descriptor.value = wrapResponse(descriptor.value);
        }

        middlewares.push(descriptor.value);

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

function authorize(role: Role): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction): void {
        const user: User = req.user;

        if (!user || user.role !== role) {
            const unauthorized = new UnauthorizedError();

            res.status(unauthorized.code).json(unauthorized.toJson());
            return;
        }

        next();
    };
}

function wrapResponse(originalFunction: any): any {
    return async function (req: Request, res: Response, next: NextFunction) {
        const result: any = await originalFunction(req, res, next);

        if (result instanceof HttpResponse) {
            res.status(result.code).json(result.toJson());
            return;
        }

        res.json(result);
    };
}