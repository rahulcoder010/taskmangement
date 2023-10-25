const TaskPage = () => {
  // ...

  return (
    <div>
      {/* ... */}
      <tbody key={task.id}>
        <tr>
          <th scope="row" key={task.id}>
            {task.id}
          </th>
          <td style={{ maxWidth: "180px" }}>{task.title}</td>
          <td style={{ maxWidth: "180px", wordWrap: "break-word" }}>
            {task.description}
          </td>
          <td>{task.status}</td>
          <td>
            <button
              style={{ marginRight: "10px" }}
              type="button"
              className="btn btn-primary btn-success ms-1"
              data-bs-toggle="modal"
              data-bs-target={`#exampleModal${i}`}
            >
              <i className="fas fa-edit"></i>
            </button>
            {/* ... */}
            <button
              type="submit"
              className="btn btn-danger"
              onClick={() => handleDeleteTask(task.id)}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </tbody>
      {/* ... */}
    </div>
  );
};

export default TaskPage;