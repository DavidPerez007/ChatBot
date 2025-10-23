import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './components/login'
import './App.css';
import SignUp from './components/signup';
import Error from './components/error';
import Chat from './components/chat'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Error />} />
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
    </Router>
  );
}

export default App;
