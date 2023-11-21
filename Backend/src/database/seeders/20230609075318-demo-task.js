"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Tasks", [
      {
        title: "Task 1",
        description: "This is task 1",
        status: "In_Progress",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Task 2",
        description: "This is task 2",
        status: "pending",
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
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tasks", null, {});
  },
};