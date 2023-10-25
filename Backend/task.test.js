const mongoose = require('mongoose');
const Task = require('../models/Task');

describe('Task Model Test', () => {
    // It's just a good idea to wipe the database before each test
    beforeEach(async () => {
        await Task.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('has a module', () => {
        expect(Task).toBeDefined();
    });

    describe('get task', () => {
        it('can get a task', async () => {
            const taskData = { title: 'Test Task', description: 'This is a test task' };
            await Task.create(taskData);

            const foundTask = await Task.findOne({ title: 'Test Task' });
            const expected = 'This is a test task';
            const actual = foundTask.description;
            expect(actual).toEqual(expected);
        });
    });

    describe('post task', () => {
        it('can post a task', async () => {
            const taskData = { title: 'New Task', description: 'This is a new task' };
            await Task.create(taskData);

            const foundTask = await Task.findOne({ title: 'New Task' });
            const expected = 'This is a new task';
            const actual = foundTask.description;
            expect(actual).toEqual(expected);
        });
    });
});