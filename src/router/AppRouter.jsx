import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Agree from "../pages/Agree";
import OAuthCallback from "../pages/OAuthCallback";
import InfoInput from "../pages/InfoInput";
import SasangTest from "../pages/SasangTest";
import SasangResult from "../pages/SasangResult";
import Persona from "../pages/Persona";
import Mypage from "../pages/MyPage";
import Trip from "../pages/Trip";
import Direction from "../pages/Direction";
import TripEdit from "../pages/TripEdit";
import TripAdd from "../pages/TripAdd";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/agree" element={<Agree />} />
        <Route path="/InfoInput" element={<InfoInput />} />
        <Route path="/sasang-test" element={<SasangTest />} />
        <Route path="/sasang-result" element={<SasangResult />} />
        <Route path="/persona" element={<Persona />} />
        <Route path="/home" element={<Home />} />
        <Route path="/direction" element={<Direction />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/trip" element={<Trip />} />
        <Route path="/trip/edit" element={<TripEdit />} />
        <Route path="/trip/add/place" element={<TripAdd type="place" />} />
        <Route path="/trip/add/food" element={<TripAdd type="food" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
