import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';


function App() {

  return (
    <div className="App">
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />

      {/* Start of code for star pattern */}
      {
        Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
            {'*'.repeat(i + 1)}
          </div>
        ))
      }
      {/* End of code for star pattern */}

    </div>
  );
}

export default App;