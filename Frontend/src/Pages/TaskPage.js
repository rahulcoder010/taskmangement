Below is the updated code to change the style of the buttons, add icons with text for Add, Update, and Delete task buttons:

In the TaskPage.js file:
```javascript
<button
    type="button"
    className="btn btn-warning"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
>
    <FaPlus /> Add Task
</button>

...

<button
    style={{ marginRight: "10px" }}
    type="button"
    className="btn btn-primary btn-success ms-1"
    data-bs-toggle="modal"
    data-bs-target={`#exampleModal${i}`}
>
    <FaEdit /> Update
</button>

...

<button
    type="submit"
    className="btn btn-danger"
    onClick={() => handleDeleteTask(task.id)}
>
    <FaTrash /> Delete
</button>
```

This code adds the icons (`FaPlus`, `FaEdit`, and `FaTrash`) and the corresponding text to the buttons.