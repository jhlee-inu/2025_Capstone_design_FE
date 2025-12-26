import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTab from "../components/BottomTab";
import { MdOutlineRestaurant } from "react-icons/md"; //restaurant icon
import { FaLandmark } from "react-icons/fa6"; //landmark icon
function Trip() {
  const [tab, setTab] = useState("place");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="h-14 flex items-center justify-center border-b bg-white z-10">
        <h1 className="text-lg font-bold">여행 코스</h1>
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

        {/* 수정하기 버튼 */}
        <button
          onClick={() => navigate("/trip/edit")}
          className="px-3 py-1 font-medium rounded-full shadow text-sm
                     bg-gray-100 text-gray-600 flex items-center gap-1"
        >
          ✏️ 수정하기
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 p-4 bg-gray-50 space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl shadow-sm p-4 space-y-3"
          >
            {/* 카테고리 라벨 */}
            <div className="flex items-center gap-2 text-sm font-medium ">
              <span
                className="w-5 h-5 flex items-center justify-center
                         text-white rounded-md text-xs bg-orange-500 "
              >
                {tab === "place" ? (
                  <FaLandmark size={12} />
                ) : (
                  <MdOutlineRestaurant size={13} />
                )}
              </span>
              송월동 동화마을
            </div>

            {/* 이미지 영역 */}
            <div className="flex gap-2 overflow-hidden rounded-lg">
              <div className="h-28 w-1/2 bg-gray-200 rounded-lg" />
              <div className="h-28 w-1/2 bg-gray-200 rounded-lg" />
            </div>

            {/* 주소 */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              인천광역시 중구 송월동3가 자유공원서로45번길
            </div>

            {/* 태그 */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>상설전시, 요금</p>
              <p>근처맛집</p>
              <p>근처관광지</p>
            </div>

            {/* 링크 */}
            <div className="flex items-center gap-1 text-xs text-orange-400">
              🔗 링크
            </div>

            {/* 메모 */}
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-xs text-gray-400">
              메모
            </div>
          </div>
        ))}
      </main>

      <BottomTab />
    </div>
  );
}

export default Trip;
