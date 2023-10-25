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
          // Add more assertions as needed
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
          // Add more assertions as needed
          done();
        });
    });

    it("should return an error if user token is missing", (done) => {
      chai
        .request(app)
        .get("/task")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          console.log("🚀 ~ file: test.test.js:282 ~ .end ~ res:", res)
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal("Please login again!");
          done();
        });
    });

    it("should return an error if user is not authenticated", (done) => {
      chai
        .request(app)
        .get("/task")
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.equal(false);
          expect(res.body.Error).to.equal(
            "Not authorized to access this route"
          );
          // Add more assertions as needed
          done();
        });
    });
  });
});