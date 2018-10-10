import { POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '../config/secrets';
import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';

export class Database {
  private static instance: Database;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize({
      database: POSTGRES_DATABASE,
      dialect: 'postgres',
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      modelPaths: [path.join(__dirname + '/models/')],
    });
  }

  public static get db(): Sequelize {
    if (!this.instance) {
      this.instance = new Database();
    }

    return this.instance.sequelize;
  }
}

const DB = Database.db;

export default DB;
