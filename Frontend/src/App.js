import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';


function App() {

  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route path="/tasks" component={TaskPage} />
      </Router>
    </div>
  );
}

export default App;