import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import AppLayout from "../layouts/AppLayout";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
function TripEdit() {
  const [tab, setTab] = useState("place");
  const navigate = useNavigate();

  const handleAdd = () => {
    if (tab === "place") {
      navigate("/trip/add/place");
    } else {
      navigate("/trip/add/food");
    }
  };

  return (
    <AppLayout
      header={
        <header className="relative h-14 flex items-center justify-center border-b bg-white z-10">
          <button
            onClick={() => navigate("/trip")}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <IoIosArrowBack size={30} />
          </button>
          <h1 className="text-lg font-bold">여행 코스 수정</h1>
        </header>
      }
    >
      <div className="relative min-h-full bg-white-50">
        {/* 탭 */}
        <div className="flex gap-2 px-4 py-3 bg-white">
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

        {/* 리스트 영역 */}
        <div className="px-4 py-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between
                       bg-gray-100 px-4 py-3 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-6 h-6 flex items-center justify-center
                           bg-orange-300 text-white font-medium rounded-md text-xs"
                >
                  {i}
                </span>
                <span className="text-sm font-medium">송월동 동화마을</span>
              </div>

              <button className="w-6 h-6 rounded-full text-red-500 flex items-center justify-center text-sm">
                <AiFillMinusCircle size={25} />
              </button>
            </div>
          ))}
        </div>

        {/* + 추가 버튼 */}
        <button
          onClick={handleAdd}
          className="absolute bottom-8 right-6 w-12 h-12"
        >
          <AiFillPlusCircle className="size-16 text-orange-400" />
        </button>
      </div>
    </AppLayout>
  );
}

export default TripEdit;
