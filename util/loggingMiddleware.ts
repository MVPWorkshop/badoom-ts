import { NextFunction, Request, RequestHandler, Response } from 'express';
import _ from 'lodash';

type HeaderMap = { [header: string]: any };

enum WinstonLevels {
    emerg = 'emergency',
    alert = 'alert',
    criot = 'critical',
    error = 'error',
    warning = 'warning',
    warn = 'warning',
    notice = 'notice',
    info = 'info',
    debug = 'debug',
}

interface RequestMetadata {
    url: string;
    ip: string;
    method: string;
    requestHeaders: HeaderMap;
    requestBody: { [key: string]: any };
}

interface Log {
    responseHeaders: any;
    responseBody: { [key: string]: any };
    httpCode: number;
    level: WinstonLevels;
    statusMessage: string;
}

export interface Logger {
    log(data: object): void;
}

export interface BadoomRequest extends Request {
    badoomMetadata: RequestMetadata;
}

export interface LoggingMiddlewareOpts {
    omittedHeaders?: string[];
    logger: Logger;
}

export function loggingMiddleware(opts: LoggingMiddlewareOpts): RequestHandler {
    const logger = opts.logger;
    return function (req: BadoomRequest, res: Response, next: NextFunction) {
        const requestHeaders = _.omit(req.headers, opts.omittedHeaders || []);

        req.badoomMetadata = {
            url: req.url,
            ip: <string>req.headers['x-real-ip'] || req.connection.remoteAddress,
            method: req.method,
            requestHeaders: <HeaderMap>requestHeaders,
            requestBody: req.body || {},
        };

        const originalSend = res.send.bind(res);
        const originalWrite = res.write.bind(res);
        let originalBody: any;
        let streamedBody = '';

        res.send = function (...args: any[]) {
            originalBody = _.head(args);
            return originalSend(...args);
        };

        res.write = function (...args: any[]) {
            console.log(args);
            streamedBody += args;
            return originalWrite(...args);
        };

        res.on('finish', () => {
            logger.log({
                ...req.badoomMetadata,
                ...prepareResponseLog(res, originalBody || streamedBody)
            });
        });

        next();
    };
}

function prepareResponseLog(res: Response, responseBody: any): Log {
    let level = WinstonLevels.info;

    if (res.statusCode >= 500) {
        level = WinstonLevels.error;
    } else if (res.statusCode < 200 && res.statusCode >= 299) {
        level = WinstonLevels.warning;
    }

    return {
        statusMessage: res.statusMessage,
        httpCode: res.statusCode,
        level: level,
        responseBody: responseBody || {},
        responseHeaders: res.getHeaders()
    };
}