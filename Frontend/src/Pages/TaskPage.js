const TaskPage = () => {
  // ...other code

  return (
    <div>
      {/* ...other code */}
      {tasks.map((task, i) => (
        <tbody key={task.id}>
          <tr>
            {/* ...other code */}
            <td>
              {/* ...other code */}
              <button
                style={{ marginRight: "10px" }}
                type="button"
                className="btn btn-primary btn-success ms-1"
                data-bs-toggle="modal"
                data-bs-target={`#exampleModal${i}`}
              >
                <FaEdit />
              </button>
              <div
                className="modal fade"
                id={`exampleModal${i}`}
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                {/* ...other code */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeButtonRef}
                    id={`testsing${i}`}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      handleUpdateStatus(task.id, selectedStatus);
                      document
                        .getElementById(`testsing${i}`)
                        .click();
                    }}
                  >
                    Save changes
                  </button>
                </div>
                {/* ...other code */}
              </div>

              <button
                type="submit"
                className="btn btn-danger"
                onClick={() => handleDeleteTask(task.id)}
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        </tbody>
      ))}
      {/* ...other code */}
    </div>
  );
};

export default TaskPage;