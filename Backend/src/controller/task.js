```javascript
// Backend/src/controller/task.test.js

const request = require('supertest'); // Import supertest library
const app = require('../app'); // Import your Express app

describe('Task Controller', () => {
  // Test case for the allTasks function
  describe('/api/tasks', () => {
    it('should return all tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2); // Adjust the length based on your test data
    });

    it('should return an error if user is not logged in', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.Error).toBe('**Please login again!**');
    });
  });

  // Test case for the addTask function
  describe('/api/tasks', () => {
    it('should add a new task', async () => {
      const task = {
        title: 'New Task',
        description: 'Description for the new task',
      };

      const res = await request(app).post('/api/tasks').send(task);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Task');
      expect(res.body.data.description).toBe('Description for the new task');
    });

    it('should return an error if title and description are missing', async () => {
      const task = {};

      const res = await request(app).post('/api/tasks').send(task);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.Error).toBe('**title & description are required!**');
    });

    it('should return an error if title or description length is too long', async () => {
      const task = {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quis',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quis',
      };

      const res = await request(app).post('/api/tasks').send(task);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.Error).toBe('**Title or description length too long!**');
    });
  });

  // Test case for the updateTask function
  describe('/api/tasks/:id', () => {
    it('should update the status of a task', async () => {
      const res = await request(app).put('/api/tasks/1').send({ status: 'Completed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Completed');
    });

    it('should return an error if task is not found', async () => {
      const res = await request(app).put('/api/tasks/9999').send({ status: 'Completed' });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Task not found!');
    });

    it('should return an error if status is missing in the body', async () => {
      const res = await request(app).put('/api/tasks/1').send({});

      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe('Please add status in body!');
    });
  });

  // Test case for the deleteTask function
  describe('/api/tasks/:id', () => {
    it('should delete a task', async () => {
      const res = await request(app).delete('/api/tasks/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(1);
    });

    it('should return an error if task is not found', async () => {
      const res = await request(app).delete('/api/tasks/9999');

      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.Error).toBe('Task not found!');
    });
  });
});
```