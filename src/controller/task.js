const fs = require('fs');

const updateTaskFile = (filePath, newContent) => {
  fs.writeFileSync(filePath, newContent);
  return fs.readFileSync(filePath, 'utf-8');
};

const taskFilePath = 'src/controller/task.js';
const newTaskContent = 'Fix the tasks update the .';

const updatedFileContents = updateTaskFile(taskFilePath, newTaskContent);

updatedFileContents;