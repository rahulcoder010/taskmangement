import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';


function App() {

  return (
    <div className="App">
      { // Start of code for star pattern
        {
          Array.from({length: 5}, (_, i) => (
            <div key={i}>
              {Array.from({length: i + 1}, (_, j) => (
                <span key={j}>*</span>
              ))}
            </div>
          ))
        }
      }
      // End of code for star pattern

      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />
    </div>
  );
}

export default App;