import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';

function App() {

  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />

      {/* Write code for star pattern below */}
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i}>
            {'*'.repeat(i + 1)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;