import React from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';
import LoginPage from './Pages/LoginPage';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />
      <Route path="/login" component={LoginPage} />
    </div>
  );
}

export default App;