import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';
import LoginPage from './Pages/LoginPage'; // Import Login Page

function App() {

  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />
      <Route path="/login" component={LoginPage} /> // Add Login Page route
    </div>
  );
}

export default App;