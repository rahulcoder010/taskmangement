import React from 'react';
import './App.css';
import { Route, Redirect } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';
import LoginPage from './Pages/LoginPage';

function App() {
  const isAuthenticated = // logic to check if user is authenticated or not

  return (
    <div className="App">
      <Route exact path="/">
        {isAuthenticated ? <Redirect to="/tasks" /> : <HomePage />}
      </Route>
      <Route path="/login" component={LoginPage} />
      <Route path="/tasks" component={TaskPage} />
    </div>
  );
}

export default App;