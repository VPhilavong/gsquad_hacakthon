import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/'/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
