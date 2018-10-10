import DataTypes, { QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return [
      queryInterface.addColumn('users', 'first_name', {
        allowNull: false,
        type: DataTypes.STRING,
      }),
      queryInterface.addColumn('users', 'last_name', {
        allowNull: false,
        type: DataTypes.STRING,
      }),
      queryInterface.addColumn('users', 'email', {
        allowNull: false,
        type: DataTypes.STRING,
      }),
      queryInterface.addColumn('users', 'role', {
        allowNull: false,
        type: DataTypes.STRING,
      }),
      queryInterface.addColumn('users', 'created_at', {
        allowNull: false,
        type: DataTypes.DATE,
      }),
      queryInterface.addColumn('users', 'updated_at', {
        allowNull: false,
        type: DataTypes.DATE,
      }),
    ];
  },

  down: (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return [
      queryInterface.removeColumn('users', 'first_name'),
      queryInterface.removeColumn('users', 'last_name'),
      queryInterface.removeColumn('users', 'email'),
      queryInterface.removeColumn('users', 'role'),
      queryInterface.removeColumn('users', 'created_at'),
      queryInterface.removeColumn('users', 'updated_at'),
    ];
  }
};
