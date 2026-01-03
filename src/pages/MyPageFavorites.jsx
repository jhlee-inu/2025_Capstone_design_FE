import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { HiStar } from "react-icons/hi";
import { AiFillHeart } from "react-icons/ai";
import AppLayout from "../layouts/AppLayout";

const favorites = [
  {
    name: "더몰트하우스 인천송도점",
    rating: "4.6",
    address: "인천광역시 연수구 센트럴파크 3차 305호",
    link: "자세한 정보(구글맵 링크)",
  },
  {
    name: "더몰트하우스 인천송도점",
    rating: "4.6",
    address: "인천광역시 연수구 센트럴파크 3차 305호",
    link: "자세한 정보(구글맵 링크)",
  },
  {
    name: "더몰트하우스 인천송도점",
    rating: "4.6",
    address: "인천광역시 연수구 센트럴파크 3차 305호",
    link: "자세한 정보(구글맵 링크)",
  },
];

function MyPageFavorites() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("recent");

  return (
    <AppLayout
      header={
        <header className="relative h-14 flex items-center justify-center border-b bg-white z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <IoIosArrowBack size={28} />
          </button>
          <h1 className="text-lg font-bold">찜한 장소</h1>
        </header>
      }
    >
      <div className="min-h-full bg-white px-4 py-6 font-medium">
        <div className="flex items-center justify-between text-sm text-black">
          <span>전체 {favorites.length}</span>
          <div className="flex items-center gap-2">
            {["recent", "title"].map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-3 py-1 font-medium rounded-full shadow text-sm ${
                  tab === key
                    ? "bg-orange-300 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {key === "recent" ? "등록순" : "제목순"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3 text-black">
          {favorites.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="rounded-2xl bg-gray-100 px-4 py-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start text-black justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-gray-700">
                    <HiStar className="text-orange-400" />
                    <span>{item.rating}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-900">{item.address}</p>
                  <button
                    type="button"
                    className="mt-2 text-xs text-orange-400"
                  >
                    {item.link}
                  </button>
                </div>
                <AiFillHeart size={24} className="text-orange-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default MyPageFavorites;
