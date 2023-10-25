const user = require("../routes/users.js");
const task = require("../routes/tasks.js");

module.exports = function (app) {
  app.use("/user", user);
  app.use("/task", task);
};
