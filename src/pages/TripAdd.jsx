import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

function TripAdd() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="relative h-14 flex items-center justify-center border-b bg-white z-10">
        <button
          onClick={() => navigate("/trip")}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <IoIosArrowBack size={30} />
        </button>

        <h1 className="text-lg font-bold">여행 코스 수정</h1>
      </header>
      {/* 리스트 */}
      <main className="flex-1 px-4 py-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow-sm
                       flex justify-between items-start"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">더몰트하우스 인천송도점</h3>
              <p className="text-xs text-gray-500">⭐ 4.6</p>
              <p className="text-xs text-gray-400">인천 연수구 센트럴로 305</p>
              <p className="text-xs text-orange-400">
                자세한 정보 (구글맵 링크)
              </p>
            </div>

            <button className="text-orange-400 text-2xl">+</button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default TripAdd;
