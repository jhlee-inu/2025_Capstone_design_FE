import BottomTab from "../components/BottomTab";
import ChatbotAvatar from "../components/ChatbotAvatar";
import MapOverlay from "../components/MapOverlay";
import CameraOverlay from "../components/CameraOverlay";
import { loadKakaoMap } from "../utils/loadKakaoMap";
import { useEffect, useRef, useState } from "react";

function Home() {
  const mapRef = useRef(null);
  const kakaoRef = useRef(null);
  const markerRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadKakaoMap().then((kakao) => {
      if (!mounted) return;

      kakaoRef.current = kakao;

      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new kakao.maps.LatLng(37.4563, 126.7052),
        level: 4,
        draggable: true,
      };

      mapRef.current = new kakao.maps.Map(container, options);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleMoveToMyLocation = (active = true) => {
    if (!active) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      window.alert("Geolocation is not supported in this browser.");
      return;
    }

    if (!mapRef.current || !kakaoRef.current) {
      window.alert("Map is not ready yet.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const kakao = kakaoRef.current;
        const map = mapRef.current;

        if (!kakao || !map) return;

        const latlng = new kakao.maps.LatLng(latitude, longitude);
        map.setCenter(latlng);

        if (markerRef.current) {
          markerRef.current.setPosition(latlng);
        } else {
          markerRef.current = new kakao.maps.Marker({
            position: latlng,
            map,
          });
        }
      },
      () => {
        window.alert("Location permission is required.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="h-14 flex items-center px-4 pt-3 border-b bg-white z-10">
        <h1 className="text-lg font-bold">Incheon Mate</h1>
      </header>
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <div id="map" className="w-full h-full touch-none" />
        </div>

        <MapOverlay
          onMoveToMyLocation={handleMoveToMyLocation}
          onToggleCamera={setCameraOpen}
          cameraOpen={cameraOpen}
        />

        <ChatbotAvatar />
      </main>
      <BottomTab />

      {cameraOpen && (
        <CameraOverlay onClose={() => setCameraOpen(false)} />
      )}
    </div>
  );
}

export default Home;
