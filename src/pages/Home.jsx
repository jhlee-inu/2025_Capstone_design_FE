import BottomTab from "../components/BottomTab";
import ChatbotAvatar from "../components/ChatbotAvatar";
import MapOverlay from "../components/MapOverlay";
import { loadKakaoMap } from "../utils/loadKakaoMap";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    loadKakaoMap().then((kakao) => {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new kakao.maps.LatLng(37.4563, 126.7052), // 인천
        level: 4,
        //draggable: true,
      };

      new kakao.maps.Map(container, options);
    });
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <header className="h-14 flex items-center px-4 pt-3 border-b bg-white z-10">
        <h1 className="text-lg font-bold">Incheon Mate</h1>
      </header>
      {/* 지도 영역 */}
      <main className="flex-1 relative">
        {/* 실제 지도 들어갈 자리 */}
        <div className="absolute inset-0">
          <div id="map" className="w-full h-full touch-none" />
        </div>
        {/* <div className="absolute inset-0 bg-gray-200"> */}

        {/* 지도 위 UI 오버레이 */}
        <MapOverlay />

        {/* 좌측 하단 페르소나 (챗봇 트리거) */}
        <ChatbotAvatar />
      </main>
      {/* 하단 탭 */}
      <BottomTab />
    </div>
  );
}

export default Home;
