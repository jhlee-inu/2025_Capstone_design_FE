import { useState } from "react";
import { BiSolidCoffeeAlt } from "react-icons/bi";
import { MdOutlineRestaurant } from "react-icons/md";
import { FaLandmark, FaCameraRetro } from "react-icons/fa6";
import { MdRoute, MdOutlineMyLocation } from "react-icons/md";

function MapOverlay({ onMoveToMyLocation, onToggleCamera, cameraOpen }) {
  const [routeActive, setRouteActive] = useState(false);
  const [locationActive, setLocationActive] = useState(false);

  const cameraActive = typeof cameraOpen === "boolean" ? cameraOpen : false;

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

  return (
    <>
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button
          type="button"
          className="px-3 py-1 bg-white font-medium rounded-full shadow text-sm"
        >
          <MdOutlineRestaurant className="inline-block mr-1 text-red-400" />
          음식점
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white font-medium rounded-full shadow text-sm"
        >
          <BiSolidCoffeeAlt className="inline-block mr-1 text-yellow-400" />
          카페
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white font-medium rounded-full shadow text-sm"
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
            routeActive ? "bg-orange-400" : "bg-white"
          }`}
          onClick={() => setRouteActive((prev) => !prev)}
        >
          <MdRoute
            size={25}
            className={routeActive ? "text-white" : "text-black"}
          />
        </button>
      </div>

      <div className="absolute right-4 bottom-5 flex flex-col gap-3 z-10">
        <button
          type="button"
          className={`w-11 h-11 rounded-full shadow flex items-center justify-center ${
            locationActive ? "bg-orange-400" : "bg-white"
          }`}
          onClick={handleLocationClick}
        >
          <MdOutlineMyLocation
            size={25}
            className={locationActive ? "text-white" : "text-black"}
          />
        </button>
      </div>
    </>
  );
}

export default MapOverlay;
