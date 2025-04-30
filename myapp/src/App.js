// import logo from './logo.svg';
import './App.css';
import SignUp from './Screens/SignUp';
import SignIn from './Screens/SignIn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
