import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';


function App() {

  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />
      // Star pattern code
      {Array.from({length: 5}).map((_, index) => (
        <div key={index}>{Array(index + 1).fill('*').join('')}</div>
      ))}
    </div>
  );
}

export default App;