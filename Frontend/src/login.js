import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';
import LoginPage from './Pages/LoginPage'; // New import for LoginPage

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />
      <Route path="/login" component={LoginPage} /> // New route for LoginPage
    </div>
  );
}

export default App;