import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Agree from '../pages/Agree';
import SasangTest from '../pages/SasangTest';
import Persona from '../pages/Persona';
import Mypage from '../pages/MyPage';
import Trip from '../pages/Trip';  
import Direction from '../pages/Direction';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agree" element={<Agree />} />
        <Route path="/sasang-test" element={<SasangTest />} />
        <Route path="/persona" element={<Persona />} />
        <Route path="/home" element={<Home />} />
        <Route path="/trip" element={<Trip/>} />
        <Route path="/direction" element={<Direction />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;