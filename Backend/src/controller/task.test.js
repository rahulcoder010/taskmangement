const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");
chai.use(chaiHttp);

describe("Task API", () => {
  describe("GET /tasks", () => {
    it("should return all tasks", async () => {
      const res = await chai.request(app).get("/tasks");
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.count).to.be.a("number");
      expect(res.body.data).to.be.an("array");
    });
  });

  describe("POST /tasks", () => {
    it("should add a new task", async () => {
      const task = {
        title: "New Task",
        description: "This is a new task",
      };
      const res = await chai.request(app).post("/tasks").send(task);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.title).to.equal(task.title);
      expect(res.body.data.description).to.equal(task.description);
    });

    it("should return an error message if title or description is missing", async () => {
      const task = {
        title: "",
        description: "This is a new task",
      };
      const res = await chai.request(app).post("/tasks").send(task);
      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.Error).to.equal("**title & description are required!**");
    });

    it("should return an error message if title or description length is too long", async () => {
      const task = {
        title: "This is a very long title that exceeds the character limit",
        description: "This is a new task",
      };
      const res = await chai.request(app).post("/tasks").send(task);
      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.Error).to.equal("**Title or description length too long!**");
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update the status of a task", async () => {
      const task = {
        status: "completed",
      };
      const res = await chai.request(app).put("/tasks/1").send(task);
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data.status).to.equal(task.status);
    });

    it("should return an error message if task is not found", async () => {
      const task = {
        status: "completed",
      };
      const res = await chai.request(app).put("/tasks/999").send(task);
      expect(res.status).to.equal(404);
      expect(res.body.status).to.be.false;
      expect(res.body.message).to.equal("Task not found!");
    });

    it("should return an error message if status is missing", async () => {
      const task = {};
      const res = await chai.request(app).put("/tasks/1").send(task);
      expect(res.status).to.equal(404);
      expect(res.body.status).to.be.false;
      expect(res.body.message).to.equal("Please add status in body!");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      const res = await chai.request(app).delete("/tasks/1");
      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.be.an("object");
    });

    it("should return an error message if task is not found", async () => {
      const res = await chai.request(app).delete("/tasks/999");
      expect(res.status).to.equal(404);
      expect(res.body.status).to.be.false;
      expect(res.body.Error).to.equal("Task not found!");
    });
  });
});