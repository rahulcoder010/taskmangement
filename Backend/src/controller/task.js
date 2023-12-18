const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;

describe('Task API', () => {
  it('should return all tasks', async () => {
    const res = await chai
      .request('http://localhost:3000')
      .get('/tasks');

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success').to.be.true;
    expect(res.body).to.have.property('count').to.be.a('number');
    expect(res.body).to.have.property('data').to.be.an('array');
  });

  it('should add a task', async () => {
    const task = {
      title: 'New Task',
      description: 'Task Description',
    };

    const res = await chai
      .request('http://localhost:3000')
      .post('/tasks')
      .send(task);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success').to.be.true;
    expect(res.body).to.have.property('data').to.be.an('object');
  });

  it('should not add a task without title', async () => {
    const task = {
      description: 'Task Description',
    };

    const res = await chai
      .request('http://localhost:3000')
      .post('/tasks')
      .send(task);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('success').to.be.false;
    expect(res.body).to.have.property('Error');
  });

  it('should not add a task with long title or description', async () => {
    const task = {
      title: 'This is a very long title that exceeds the limit.',
      description:
        'This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters. This is a very long description with more than 200 characters.',
    };

    const res = await chai
      .request('http://localhost:3000')
      .post('/tasks')
      .send(task);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('success').to.be.false;
    expect(res.body).to.have.property('Error');
  });

  it('should update a task', async () => {
    const task = {
      status: 'completed',
    };

    const res = await chai
      .request('http://localhost:3000')
      .put('/tasks/1')
      .send(task);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success').to.be.true;
    expect(res.body).to.have.property('data').to.be.an('object');
  });

  it('should not update a task without status', async () => {
    const task = {};

    const res = await chai
      .request('http://localhost:3000')
      .put('/tasks/1')
      .send(task);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('success').to.be.false;
    expect(res.body).to.have.property('message');
  });

  it('should delete a task', async () => {
    const res = await chai
      .request('http://localhost:3000')
      .delete('/tasks/1');

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('success').to.be.true;
    expect(res.body).to.have.property('data').to.be.an('object');
  });
});