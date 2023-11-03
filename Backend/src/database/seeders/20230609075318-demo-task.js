"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert("Tasks", [
        {
          title: "Task 1",
          description: "This is task 1",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Task 2",
          description: "This is task 2",
          status: "In_Progress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Task 3",
          description: "This is task 3",
          status: "Completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], { transaction: t });

      throw new Error('In_Progress error');
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tasks", null, {});
  },
};