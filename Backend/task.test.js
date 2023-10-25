# Backend/task.test.js

```javascript
const Task = require('./task');

describe('Task', () => {
  describe('Constructor', () => {
    test('should create a Task object with the given title and description', () => {
      const title = 'Complete assignment';
      const description = 'Finish the coding assignment by tonight';

      const task = new Task(title, description);

      expect(task.title).toBe(title);
      expect(task.description).toBe(description);
    });

    test('should create a Task object with the given title and an empty description', () => {
      const title = 'Buy groceries';

      const task = new Task(title);

      expect(task.title).toBe(title);
      expect(task.description).toBe('');
    });
  });

  describe('updateDescription', () => {
    test('should update the description of the Task object', () => {
      const title = 'Write test cases';
      const description = 'Write unit tests for the Task class';

      const task = new Task(title);
      task.updateDescription(description);

      expect(task.description).toBe(description);
    });
  });
});
```