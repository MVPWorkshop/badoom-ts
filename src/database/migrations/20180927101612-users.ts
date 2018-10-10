import DataTypes, { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true
      }
    });
  },

  down: (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
