import { NavLink } from "react-router-dom";
import { FiMap } from "react-icons/fi"; //trip icon
import { FaMapMarkerAlt } from "react-icons/fa"; //direction icon
import { GoHomeFill } from "react-icons/go"; //home icon
import { IoPersonSharp } from "react-icons/io5"; //mypage icon
function BottomTab() {
  const tabStyle = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 gap-1
     ${isActive ? "text-black" : "text-gray-400"}`;

  return (
    <nav className="h-16 border-t bg-white flex">
      <NavLink to="/home" className={tabStyle}>
        <GoHomeFill size={22} />
        <span className="text-xs">홈</span>
      </NavLink>

      <NavLink to="/trip" className={tabStyle}>
        <FiMap size={22} />
        <span className="text-xs">여행 코스</span>
      </NavLink>

      <NavLink to="/direction" className={tabStyle}>
        <FaMapMarkerAlt size={22} />
        <span className="text-xs">길 찾기</span>
      </NavLink>

      <NavLink to="/mypage" className={tabStyle}>
        <IoPersonSharp size={22} />
        <span className="text-xs">마이</span>
      </NavLink>
    </nav>
  );
}

export default BottomTab;
