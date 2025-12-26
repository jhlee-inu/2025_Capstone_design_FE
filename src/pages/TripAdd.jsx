import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillPlusCircle } from "react-icons/ai";
function TripAdd({ type }) {
  const navigate = useNavigate();
  const title = type === "place" ? "여행지 추가" : "음식점 추가";

  return (
    <div className="flex flex-col min-h-screen bg-white-50 max-w-md mx-auto">
      {/* 헤더 */}
      <header className="relative h-14 flex items-center justify-center border-b bg-white">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <IoIosArrowBack size={30} />
        </button>
        <h1 className="text-lg font-bold">{title}</h1>
      </header>

      {/* 검색 */}
      <div className="px-4 py-6 bg-white ">
        <input
          className="w-full px-4 py-2 rounded-full border border-gray-300 outline-none text-sm focus:border-orange-500 focus:ring-inherit focus:ring-orange-500"
          placeholder="검색"
        />
      </div>

      {/* 리스트 */}
      <main className="flex-1 px-4 py-5 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-xl p-4 flex justify-between"
          >
            <div className="text-sm space-y-1">
              <p className="font-bold">더몰트하우스 인천송도점</p>
              <p className="text-xs text-gray-500">⭐ 4.6</p>
              <p className="text-xs text-gray-400">인천 연수구 센트럴로 305</p>
              <p className="text-xs text-orange-400">
                자세한 정보 (구글맵 링크)
              </p>
            </div>

            <button className="w-8 h-8 rounded-full text-orange-400 flex items-center justify-center shrink-0">
              <AiFillPlusCircle size={25} />
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default TripAdd;
