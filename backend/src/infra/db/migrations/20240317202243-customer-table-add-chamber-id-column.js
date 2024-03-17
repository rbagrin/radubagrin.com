'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('customer', 'chamber_id', {
      type: DataTypes.STRING(10),
      references: {
        model: 'chambers',
        key: 'id',
      },
      allowNull: true,
      onDelete: 'restrict',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('customer', 'chamber_id');
  },
};
