```javascript
const formatStatus = (status) => {
  const lowercaseStatus = status.toLowerCase();
  return lowercaseStatus.charAt(0).toUpperCase() + lowercaseStatus.slice(1);
};

const formattedTasks = tasks.map((task) => {
  return { ...task, status: formatStatus(task.status) };
});

setTasks(formattedTasks);
```