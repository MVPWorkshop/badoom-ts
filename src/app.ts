import express from 'express';
import { Express } from 'express-serve-static-core';
import compression from 'compression';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import lusca from 'lusca';
import dotenv from 'dotenv';
import path from 'path';
import expressValidator from 'express-validator';
import morgan from 'morgan';
import cors from 'cors';

import { Health, Auth } from './http/controllers';
import { app } from './core/app';
import Database from './database';
import logger from './util/logger';
dotenv.config({path: '.env'});

const middlewares = [
  compression(),
  morgan('dev'),
  bodyParser.json(),
  bodyParser.urlencoded({extended: true}),
  expressValidator(),
  lusca.xframe('SAMEORIGIN'),
  lusca.xssProtection(true),
  cors(),
  express.static(path.join(__dirname, 'public'), {maxAge: 31557600000})
];

if (process.env['NODE_ENV'] === 'development') {
  // @ts-ignore
  middlewares.unshift(errorHandler());
}

@app({
  controllers: [Health, Auth], // Add new controllers here to register
  express: {
    provider: express(),
    setters: {},
    middlewares,
  }
})

export class App {
  private _express: Express;
  private env: string;
  private appState: string;
  private static application: App = undefined;

  private constructor() {
  }

  get express(): Express {
    return this._express;
  }

  set express(value: Express) {
    this._express = value;
  }

  static getApp(env: string): App {
    if (!this.application) {
      this.application = new App();
      this.application.env = env;
    }
    return this.application;
  }

  execute = async () => {
    if (this.appState === 'executed') {
      return;
    }
    const database = Database;

    database.authenticate({})
      .then(() => {
        logger.info('Connection has been established successfully.');
      })
      .catch(error => {
        logger.error('Unable to connect to the database:', error);
      });

    this.appState = 'executed';
  };

  listen = async (port: number) => {
    return await new Promise((resolve, reject) => {
      this.express.listen(port, () => {
        logger.info(`App is running at http://localhost:${port} in ${this.env} mode`);
        resolve();
      });
    });
  };

}
