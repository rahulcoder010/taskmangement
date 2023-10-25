const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe, it } = require("mocha");
const { expect } = chai;
chai.use(chaiHttp);
const db = require("./src/models/index.js");
const Users = db.User;
const app = require("./app");

let token;
let taskId;

describe("Users Controller Test", () => {
  describe("GET /api/users", () => {
    it("should return all users", (done) => {
      chai
        .request(app)
        .get("/user")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("array");
          done();
        });
    });
  });
});

describe("Tasks Controller Test", () => {
  describe("GET /api/tasks", () => {
    it("should return all tasks", (done) => {
      chai
        .request(app)
        .get("/task")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(true);
          expect(res.body.data).to.be.an("array");
          done();
        });
    });
  });
});