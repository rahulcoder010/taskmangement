import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import TaskPage from './Pages/TaskPage';

function App() {
  const starPattern = () => {
    for(let i=1; i<=5; i++) {
      let str = '';
      for(let j=1; j<=i; j++) {
        str += '* ';
      }
      console.log(str);
    }
  };

  return (
    <div className="App">
      {starPattern()}
      <Route exact path="/" component={HomePage} />
      <Route path="/tasks" component={TaskPage} />
    </div>
  );
}

export default App;