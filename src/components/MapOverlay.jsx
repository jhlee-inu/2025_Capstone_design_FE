import { BiSolidCoffeeAlt } from "react-icons/bi"; //cafe icon
import { MdOutlineRestaurant } from "react-icons/md"; //restaurant icon
import { FaLandmark } from "react-icons/fa6"; //landmark icon
import { FaCameraRetro } from "react-icons/fa6"; //camera icon
import { MdRoute } from "react-icons/md"; //route icon
function MapOverlay() {
  return (
    <>
      {/* 상단 카테고리 */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button className="px-3 py-1 bg-white rounded-full shadow text-sm">
          <MdOutlineRestaurant className="inline-block mr-1 text-red-400"/>
          음식점
        </button>
        <button className="px-3 py-1 bg-white rounded-full shadow text-sm">
          <BiSolidCoffeeAlt className="inline-block mr-1 text-yellow-400 "/>
          카페
        </button>
        <button className="px-3 py-1 bg-white rounded-full shadow text-sm">
          <FaLandmark className="inline-block mr-1 text-blue-500"/>
          관광지
        </button>
      </div>


{/* 우측 플로팅 버튼 */}
<div className="absolute right-4 top-20 flex flex-col gap-3 z-10">
  <button className="w-12 h-12 bg-white rounded-full shadow
                     flex items-center justify-center">
    <FaCameraRetro size={22} />
  </button>
  <button className="w-12 h-12 bg-white rounded-full shadow
                     flex items-center justify-center">
    <MdRoute size={25} />
  </button>
</div>
    </>
  );
}

export default MapOverlay;
