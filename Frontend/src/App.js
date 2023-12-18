import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={HomePage} />
        <Route path="/tasks" component={TaskPage} />
      </BrowserRouter>
    </div>
  );
}

export default App;