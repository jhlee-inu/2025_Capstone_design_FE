import { BiSolidCoffeeAlt } from "react-icons/bi"; //cafe icon
import { MdOutlineRestaurant } from "react-icons/md"; //restaurant icon
import { FaLandmark } from "react-icons/fa6"; //landmark icon
import { FaCameraRetro } from "react-icons/fa6"; //camera icon
import { MdRoute } from "react-icons/md"; //route icon
import { MdOutlineMyLocation } from "react-icons/md"; //my location icon
import { useState } from "react";

function MapOverlay() {
  const [activeButton, setActiveButton] = useState(null);

  return (
    <>
      {/* 상단 카테고리 */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button className="px-3 py-1 bg-white font-medium rounded-full shadow text-sm">
          <MdOutlineRestaurant className="inline-block mr-1 text-red-400" />
          음식점
        </button>
        <button className="px-3 py-1 bg-white font-medium rounded-full shadow text-sm">
          <BiSolidCoffeeAlt className="inline-block mr-1 text-yellow-400 " />
          카페
        </button>
        <button className="px-3 py-1 bg-white font-medium rounded-full shadow text-sm">
          <FaLandmark className="inline-block mr-1 text-blue-500" />
          관광지
        </button>
      </div>

      {/* 우측 플로팅 버튼 */}
      <div className="absolute right-4 top-20 flex flex-col gap-3 z-10">
        <button
          className={`w-11 h-11 rounded-full shadow flex items-center justify-center ${
            activeButton === "camera" ? "bg-orange-500" : "bg-white"
          }`}
          onClick={() =>
            setActiveButton(activeButton === "camera" ? null : "camera")
          }
        >
          <FaCameraRetro
            size={21}
            className={activeButton === "camera" ? "text-white" : "text-black"}
          />
        </button>
        <button
          className={`w-11 h-11 rounded-full shadow flex items-center justify-center ${
            activeButton === "route" ? "bg-orange-500" : "bg-white"
          }`}
          onClick={() =>
            setActiveButton(activeButton === "route" ? null : "route")
          }
        >
          <MdRoute
            size={25}
            className={activeButton === "route" ? "text-white" : "text-black"}
          />
        </button>
      </div>
      <div className="absolute right-4 bottom-5 flex flex-col gap-3 z-10">
        <button
          className={`w-11 h-11 rounded-full shadow flex items-center justify-center ${
            activeButton === "location" ? "bg-orange-500" : "bg-white"
          }`}
          onClick={() =>
            setActiveButton(activeButton === "location" ? null : "location")
          }
        >
          <MdOutlineMyLocation
            size={25}
            className={
              activeButton === "location" ? "text-white" : "text-black"
            }
          />
        </button>
      </div>
    </>
  );
}

export default MapOverlay;
