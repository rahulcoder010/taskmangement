import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />
    </div>
  );
}

export default App;