import fs from 'fs';
import yargs from 'yargs';
import logger from '../util/logger';
import _ from 'lodash';
import path from 'path';

function format(i: number): string {
  return i < 10 ? '0' + i : i + '';
}

function getCurrentYYYYMMDDHHmms(): string {
  const date = new Date();
  return [
    format(date.getUTCFullYear()),
    format(date.getUTCMonth() + 1),
    format(date.getUTCDate()),
    format(date.getUTCHours()),
    format(date.getUTCMinutes()),
    format(date.getUTCSeconds()),
  ].join('');
}

let migrationName = yargs.argv.name;

if (!migrationName) {
  logger.error('--name option not provided');
  process.exit(1);
}

migrationName = _.kebabCase(getCurrentYYYYMMDDHHmms() + migrationName) + '.ts';

const template: string = `import DataTypes, { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface, sequelize: Sequelize) => {
    // return queryInterface.createTable('users', {
    //   id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true
    //   }
    // });
  },

  down: (queryInterface: QueryInterface, sequelize: Sequelize) => {
    // return queryInterface.dropTable('users');
  }
};
`;
fs.writeFileSync(path.resolve('src', 'database', 'migrations', migrationName), template);
