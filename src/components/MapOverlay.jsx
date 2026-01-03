import { useState } from "react";
import { BiSolidCoffeeAlt } from "react-icons/bi";
import { MdOutlineRestaurant } from "react-icons/md";
import { FaLandmark, FaCameraRetro } from "react-icons/fa6";
import { MdRoute, MdOutlineMyLocation } from "react-icons/md";

function MapOverlay({
  onMoveToMyLocation,
  onToggleCamera,
  cameraOpen,
  onToggleRoute,
  routeActive = false,
  activeCategory,
  onSelectCategory,
  locating = false,
}) {
  const [locationActive, setLocationActive] = useState(false);

  const cameraActive = typeof cameraOpen === "boolean" ? cameraOpen : false;
  const routeEnabled = typeof routeActive === "boolean" ? routeActive : false;

  const handleCameraClick = () => {
    const next = !cameraActive;
    if (onToggleCamera) {
      onToggleCamera(next);
    }
  };

  const handleLocationClick = () => {
    const next = !locationActive;
    setLocationActive(next);
    if (onMoveToMyLocation) {
      onMoveToMyLocation(next);
    }
  };

  const handleRouteClick = () => {
    const next = !routeEnabled;
    if (onToggleRoute) {
      onToggleRoute(next);
    }
  };

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  const isCategoryActive = (category) => activeCategory === category;

  return (
    <>
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button
          type="button"
          className={`px-3 py-1 bg-white font-medium rounded-full shadow text-sm border transition ${
            isCategoryActive("food")
              ? "border-orange-400 text-orange-600"
              : "border-transparent text-gray-800"
          }`}
          onClick={() => handleCategoryClick("food")}
          aria-pressed={isCategoryActive("food")}
        >
          <MdOutlineRestaurant className="inline-block mr-1 text-red-400" />
          음식점
        </button>
        <button
          type="button"
          className={`px-3 py-1 bg-white font-medium rounded-full shadow text-sm border transition ${
            isCategoryActive("cafe")
              ? "border-orange-400 text-orange-600"
              : "border-transparent text-gray-800"
          }`}
          onClick={() => handleCategoryClick("cafe")}
          aria-pressed={isCategoryActive("cafe")}
        >
          <BiSolidCoffeeAlt className="inline-block mr-1 text-yellow-400" />
          카페
        </button>
        <button
          type="button"
          className={`px-3 py-1 bg-white font-medium rounded-full shadow text-sm border transition ${
            isCategoryActive("place")
              ? "border-orange-400 text-orange-600"
              : "border-transparent text-gray-800"
          }`}
          onClick={() => handleCategoryClick("place")}
          aria-pressed={isCategoryActive("place")}
        >
          <FaLandmark className="inline-block mr-1 text-blue-500" />
          관광지
        </button>
      </div>

      <div className="absolute right-4 top-20 flex flex-col gap-3 z-10">
        <button
          type="button"
          className={`w-11 h-11 rounded-full shadow flex items-center justify-center ${
            cameraActive ? "bg-orange-400" : "bg-white"
          }`}
          onClick={handleCameraClick}
        >
          <FaCameraRetro
            size={21}
            className={cameraActive ? "text-white" : "text-black"}
          />
        </button>

        <button
          type="button"
          className={`w-11 h-11 rounded-full shadow flex items-center justify-center ${
            routeEnabled ? "bg-orange-400" : "bg-white"
          }`}
          onClick={handleRouteClick}
        >
          <MdRoute
            size={25}
            className={routeEnabled ? "text-white" : "text-black"}
          />
        </button>
      </div>

      <div className="absolute right-4 bottom-5 flex flex-col gap-3 z-10">
        <div className="relative flex items-center justify-end">
          {locating && (
            <div className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white shadow">
              내 위치 찾는 중...
            </div>
          )}
          <button
            type="button"
            className={`relative w-11 h-11 rounded-full shadow flex items-center justify-center ${
              locationActive ? "bg-orange-400" : "bg-white"
            }`}
            onClick={handleLocationClick}
          >
            {locating && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-400" />
              </span>
            )}
            <MdOutlineMyLocation
              size={25}
              className={locationActive ? "text-white" : "text-black"}
            />
          </button>
        </div>
      </div>
    </>
  );
}

export default MapOverlay;
