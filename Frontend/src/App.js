import "./App.css";
import { Route } from "react-router-dom";
import React from "react";
import HomePage from "./Pages/HomePage";
import TaskPage from "./Pages/TaskPage";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={HomePage} />
        <Route path="/tasks" component={TaskPage} />
      </div>
    );
  }
}

export default App;