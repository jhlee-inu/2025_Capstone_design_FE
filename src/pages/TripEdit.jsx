import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTab from "../components/BottomTab";
import { IoIosArrowBack } from "react-icons/io";
function TripEdit() {
  const [tab, setTab] = useState("place");
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
      {/* 탭 + 수정하기 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        {/* 왼쪽 탭 */}
        <div className="flex gap-2">
          {["place", "food"].map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-1 font-medium rounded-full shadow text-sm
                  ${
                    tab === key
                      ? "bg-orange-300 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
            >
              {key === "place" ? "여행지" : "음식점"}
            </button>
          ))}
        </div>
      </div>
      {/* 콘텐츠 영역 */}
      <main className="flex-1 p-4 bg-gray-50">
        <button onClick={() => navigate("/trip/add")} className="mb-4 px-4 py-2 bg-orange-400 text-white rounded-full shadow text-sm">
          + 여행지 추가하기
        </button>
        <p className="text-sm text-gray-500">
          여행코스 수정할 콘텐츠가 여기에 표시됩니다.
        </p>
      </main>
      <BottomTab />
    </div>
  );
}

export default TripEdit;
