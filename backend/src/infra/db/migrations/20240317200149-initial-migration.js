'use strict';

const fs = require('fs');
const path = require('path');
const { QueryTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const schemaSql = fs
      .readFileSync(path.resolve(__dirname, '../../db/schema.sql'))
      .toString()
      .split(';');

    const dataSql = fs
      .readFileSync(path.resolve(__dirname, '../../db/data.sql'))
      .toString();

    const transaction = await queryInterface.sequelize.transaction();

    try {
      for (const query of schemaSql) {
        await queryInterface.sequelize.query(query, {
          transaction,
          type: QueryTypes.RAW,
        });
      }

      await queryInterface.sequelize.query(dataSql, {
        transaction,
        type: QueryTypes.RAW,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('chambers');
  },
};
