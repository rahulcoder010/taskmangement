import { FaEdit, FaTrash } from "react-icons/fa";

// ... the remaining code ...

return (
  // ... the rest of the code ...
  {tasks.map((task, i) => (
    <tbody key={task.id}>
      <tr>
        <th scope="row" key={task.id}>
          {task.id}
        </th>
        <td style={{ maxWidth: "180px" }}>{task.title}</td>
        <td
          style={{
            maxWidth: "180px",
            wordWrap: "break-word",
          }}
        >
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
            <FaEdit />
          </button>
          {/* ... the rest of the code ... */}
          <button
            type="submit"
            className="btn btn-danger"
            onClick={() => handleDeleteTask(task.id)}
          >
            <FaTrash />
          </button>
          {/* ... the rest of the code ... */}
        </td>
      </tr>
    </tbody>
  ))}
  // ... the rest of the code ...
);
