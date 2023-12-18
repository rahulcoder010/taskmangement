const db = require("../models/index.js");
const Tasks = db.Task;

exports.allTasks = async (req, res) => {
  try {
    if (!req.user.token) {
      return res.status(400).json({
        success: false,
        Error: "**Please login again!**",
      });
    }
    const tasks = await Tasks.findAll({
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

exports.addTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        Error: "**title & description are required!**",
      });
    }
    if (title.length >= 50 || description.length >= 200) {
      return res.status(400).json({
        success: false,
        Error: "**Title or description length too long!**",
      });
    }

    const task = await Tasks.create({ title, description });

    req.mainData = {
      success: true,
      data: task,
      method: "addTask",
    };
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Tasks.findByPk(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found!" });
    }
    if (!status) {
      return res
        .status(404)
        .json({ status: false, message: "Please add status in body!" });
    }
    task.status = status;
    await task.save();

    req.mainData = {
      success: true,
      data: task,
      method: "updateTask",
    };
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Tasks.findByPk(id);

    if (!task) {
      return res.status(404).json({
        status: false,
        Error: "Task not found!",
      });
    }
    await task.destroy();

    req.mainData = {
      success: true,
      data: task,
      method: "deleteTask",
    };
    next();
  } catch (error) {
    res.status(404).json({
      success: false,
      Error: error.message,
    });
  }
};

// Test cases for task.js using chai and mocha

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Task Controller', function() {
  describe('allTasks', function() {
    it('should return all tasks', function(done) {
      chai
        .request('http://localhost:3000')
        .get('/tasks')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.count).to.equal(res.body.data.length);
          done();
        });
    });

    it('should return error if user token is missing', function(done) {
      chai
        .request('http://localhost:3000')
        .get('/tasks')
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.equal('**Please login again!**');
          done();
        });
    });
  });

  describe('addTask', function() {
    it('should add a new task', function(done) {
      chai
        .request('http://localhost:3000')
        .post('/tasks')
        .send({ title: 'Task 1', description: 'Task 1 description' })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.exist;
          expect(res.body.data.title).to.equal('Task 1');
          expect(res.body.data.description).to.equal('Task 1 description');
          done();
        });
    });

    it('should return error if title or description is missing', function(done) {
      chai
        .request('http://localhost:3000')
        .post('/tasks')
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.equal('**title & description are required!**');
          done();
        });
    });

    it('should return error if title length is too long', function(done) {
      chai
        .request('http://localhost:3000')
        .post('/tasks')
        .send({ title: 'Task 1'.repeat(10), description: 'Task 1 description' })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.success).to.be.false;
          expect(res.body.Error).to.equal('**Title or description length too long!**');
          done();
        });
    });
  });

  describe('updateTask', function() {
    it('should update the status of a task', function(done) {
      chai
        .request('http://localhost:3000')
        .put('/tasks/1')
        .send({ status: 'completed' })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.exist;
          expect(res.body.data.status).to.equal('completed');
          done();
        });
    });

    it('should return error if task is not found', function(done) {
      chai
        .request('http://localhost:3000')
        .put('/tasks/999')
        .send({ status: 'completed' })
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.false;
          expect(res.body.message).to.equal('Task not found!');
          done();
        });
    });

    it('should return error if status is missing', function(done) {
      chai
        .request('http://localhost:3000')
        .put('/tasks/1')
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.false;
          expect(res.body.message).to.equal('Please add status in body!');
          done();
        });
    });
  });

  describe('deleteTask', function() {
    it('should delete a task', function(done) {
      chai
        .request('http://localhost:3000')
        .delete('/tasks/1')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.exist;
          done();
        });
    });

    it('should return error if task is not found', function(done) {
      chai
        .request('http://localhost:3000')
        .delete('/tasks/999')
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.false;
          expect(res.body.Error).to.equal('Task not found!');
          done();
        });
    });
  });
});