import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { FaEdit, FaTrash, FaPlus, FaPen } from "react-icons/fa";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const token = localStorage.getItem("userInfo");
  const history = useHistory();
  const taskRef = useRef(tasks);
  const closeButtonRef = useRef();

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const formatStatus = (status) => {
    const lowercaseStatus = status.toLowerCase();
    return lowercaseStatus.charAt(0).toUpperCase() + lowercaseStatus.slice(1);
  };

  useEffect(() => {
    if (!token) {
      history.push("/");
    }
    const data = JSON.parse(token);
    setUser(data?.token);
    fetchTasks(data?.token);
  }, []);

  const handleLogout = async () => {
    const token = user;
    try {
      await axios.delete("http://localhost:5000/user/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("userInfo");
      history.push("/"); // Redirect to the login page or any other page
    } catch (error) {
      toast.error(error.response.data.Error);
    }
  };

  const fetchTasks = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const taskData = response?.data?.data
      const formattedTasks = taskData.map((task) => {
        return { ...task, status: formatStatus(task.status) };
      });
      setTasks(formattedTasks);
    } catch (error) {
      toast.error(error.response.data.Error);
      if (error.response.data.Error === "Please login again!") {
        localStorage.removeItem("userInfo");
        history.push("/");
      }
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const token = user;

      await axios.put(
        `http://localhost:5000/task/${taskId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: formatStatus(task.status) } : task
        )
      );
      toast.success("Task status updated!");
    } catch (error) {
      toast.error(error.response.data.Error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = user;
    try {
      await axios.delete(`/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task deleted!");
    } catch (error) {
      toast.error(error.response.data.Error);
    }
  };

  const handleStatusChange = (event, taskId) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = user;
    try {
      await axios.post("http://localhost:5000/task", newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      document.getElementById("addClose").click();
      setNewTask({ title: "", description: "" });
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error(error.response.data.Error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
    // Handle "connect" event
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("updateTask", (data) => {
      const temp = taskRef.current.map((task) => {
        return data.id === task.id ? data : task;
      });
      setTasks(temp);
    });

    socket.on("addTask", (data) => {
      taskRef.current.push(data);
      const temp = taskRef.current;
      setTasks(temp);
      fetchTasks(user);
    });

    socket.on("deleteTask", (data) => {
      setTasks(taskRef.current.filter((task) => task.id !== data.id));
      fetchTasks(user);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    taskRef.current = tasks;
  }, [tasks]);

  return (
<div>
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-10">
              <div className="card rounded-3">
                <div className="card-header">
                  <h1 className="text-end">
                    <button className="btn btn-primary" onClick={handleLogout}>
                      Logout
                    </button>
                  </h1>
                </div>
                <div className="card-body p-4">
                  <h4 className="text-center my-3 pb-3">To Do App</h4>
                  <form
                    className="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2"
                    onSubmit={(e) => handleCreateTask(e)}
                  >
                    <button
                      type="button"
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <FaPlus style={{ marginRight: "5px" }} /> Add task
                    </button>

                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              create task
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="mb-3">
                              {/* <label for="exampleInputEmail1" className="form-label">Email address</label> */}
                              <input
                                type="text"
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                placeholder="Enter a task title"
                                value={newTask.title}
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    title: e.target.value,
                                  })
                                }
                              />
                              {/* <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div> */}
                            </div>
                            <div className="mb-3">
                              {/* <label for="exampleInputPassword1" className="form-label">Password</label> */}
                              <input
                                type="text"
                                className="form-control"
                                id="exampleInputPassword1"
                                placeholder="Enter a task description"
                                value={newTask.description}
                                onChange={(e) =>
                                  setNewTask({
                                    ...newTask,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                id="addClose"
                              >
                                Close
                              </button>
                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <table className="table mb-4">
                    <thead>
                      <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
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
                            
                              <FaPen />
                            </button>
                            <div
                              className="modal fade"
                              id={`exampleModal${i}`}
                              tabIndex="-1"
                              aria-labelledby="exampleModalLabel"
                              aria-hidden="true"
                            >
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h1
                                      className="modal-title fs-5"
                                      id="exampleModalLabel"
                                    >
                                      {truncateText(task.title, 42)}
                                    </h1>
                                    <button
                                      type="button"
                                      className="btn-close"
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <label
                                      htmlFor="cars"
                                      style={{ margin: " 20px 10px" }}
                                    >
                                      Status:{" "}
                                    </label>
                                    <select
                                      class="form-select"
                                      aria-label="Default select example"
                                      style={{ marginRight: "10px" }}
                                      id="status"
                                      value={selectedStatus}
                                      onChange={(event) =>
                                        handleStatusChange(event, task.id)
                                      }
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="in progress">
                                        In_Progress
                                      </option>
                                      <option value="completed">
                                        Completed
                                      </option>
                                    </select>
                                  </div>

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
                                        handleUpdateStatus(
                                          task.id,
                                          selectedStatus
                                        );
                                        document
                                          .getElementById(`testsing${i}`)
                                          .click();
                                      }}
                                    >
                                      Save changes
                                    </button>
                                  </div>
                                </div>
                              </div>
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
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default TaskPage;