const formatStatus = (status) => {
  const lowercaseStatus = status.toLowerCase();
  return lowercaseStatus.charAt(0).toUpperCase() + lowercaseStatus.slice(1);
};

// Update the fetchTasks function
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

// Update the handleUpdateStatus function
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