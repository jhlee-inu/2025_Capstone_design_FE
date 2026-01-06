import ChatbotAvatar from "../components/ChatbotAvatar";
import ChatbotSheet from "../components/ChatbotSheet";
import MapOverlay from "../components/MapOverlay";
import CameraOverlay from "../components/CameraOverlay";
import cafeMarker from "../assets/map/cafe_marker.png";
import foodMarker from "../assets/map/food_marker.png";
import randMarker from "../assets/map/rand_marker.png";
import malePin from "../assets/map/m_pin.png";
import femalePin from "../assets/map/w_pin.png";
import firstPin from "../assets/route pin/first.png";
import secondPin from "../assets/route pin/second.png";
import thirdPin from "../assets/route pin/third.png";
import fourthPin from "../assets/route pin/fourth.png";
import fifthPin from "../assets/route pin/fifth.png";
import { loadKakaoMap } from "../utils/loadKakaoMap";
import AppLayout from "../layouts/AppLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import useSignupStore from "../stores/useSignupStore";

const CATEGORY_MARKERS = {
  food: foodMarker,
  cafe: cafeMarker,
  place: randMarker,
};
const ROUTE_PINS = [firstPin, secondPin, thirdPin, fourthPin, fifthPin];

// const DUMMY_PLACES = [
//   {
//     id: "place-1",
//     name: "더몰트 하우스 인천송도점 ",
//     rating: 4.6,
//     address: "Songdo Central Park 3, 305, 180beon-gil 11, Incheon",
//     lat: 37.3953,
//     lng: 126.6376,
//     mapUrl: "https://maps.google.com/?q=37.3953,126.6376",
//     liked: false,
//     type: "food",
//   },
//   {
//     id: "place-2",
//     name: "Songdo Central Park Cafe",
//     rating: 4.4,
//     address: "Central Park-ro 123, Yeonsu-gu, Incheon",
//     lat: 37.3944,
//     lng: 126.6394,
//     mapUrl: "https://maps.google.com/?q=37.3944,126.6394",
//     liked: true,
//     type: "cafe",
//   },
//   {
//     id: "place-3",
//     name: "Incheon Landing Operation Memorial Hall",
//     rating: 4.5,
//     address: "Cheongnyang-ro 138, Yeonsu-gu, Incheon",
//     lat: 37.3876,
//     lng: 126.6347,
//     mapUrl: "https://maps.google.com/?q=37.3876,126.6347",
//     liked: false,
//     type: "place",
//   },
// ];

function Home() {
  const mapRef = useRef(null); //카카오 맵 객체
  const kakaoRef = useRef(null); //카카오 맵 객체
  const markerRef = useRef(null); //내 위치 마커
  const markersRef = useRef([]); //마커 배열
  const overlaysRef = useRef(new Map()); //오버레이 맵
  const activeOverlayRef = useRef(null); //현재 활성 오버레이
  const locationWatchRef = useRef(null);
  const locationTimeoutRef = useRef(null);
  const cameraPromptTimeoutRef = useRef(null);
  const routeMarkersRef = useRef([]);
  const [cameraOpen, setCameraOpen] = useState(false); //카메라 오버레이 열림 여부
  const [cameraPromptOpen, setCameraPromptOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); //챗봇 시트 열림 여부
  const [chatPrompt, setChatPrompt] = useState(""); //챗봇 초기 프롬프트
  const [mapReady, setMapReady] = useState(false); //지도 준비 여부
  const [activeCategory, setActiveCategory] = useState(null); //음식점 카페 관광지 카테고리
  const [routeActive, setRouteActive] = useState(false);
  const gender = useSignupStore((s) => s.gender);

  const sampleRoute = [
    { lat: 37.3882, lng: 126.6425 },
    { lat: 37.3896, lng: 126.644 },
    { lat: 37.3887, lng: 126.6453 },
    { lat: 37.3871, lng: 126.6446 },
    { lat: 37.3864, lng: 126.6432 },
  ];

  useEffect(() => {
    //카카오 맵 로드 및 초기화
    let mounted = true;

    loadKakaoMap().then((kakao) => {
      if (!mounted) return;

      kakaoRef.current = kakao;
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        //시작 위치 및 레벨
        center: new kakao.maps.LatLng(37.3875, 126.643), //송도로 시작
        level: 5,
        draggable: true,
      };

      mapRef.current = new kakao.maps.Map(container, options);

      // kakao.maps.event.addListener(mapRef.current, "click", () => {
      //   //지도  아무공간이나 클릭 시 오버레이 닫기
      //   if (activeOverlayRef.current) {
      //     activeOverlayRef.current.setMap(null);
      //     activeOverlayRef.current = null;
      //   }
      // });
      setMapReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (locationWatchRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
        locationWatchRef.current = null;
      }
      if (locationTimeoutRef.current) {
        window.clearTimeout(locationTimeoutRef.current);
        locationTimeoutRef.current = null;
      }
      if (cameraPromptTimeoutRef.current) {
        window.clearTimeout(cameraPromptTimeoutRef.current);
        cameraPromptTimeoutRef.current = null;
      }
      if (routeMarkersRef.current.length) {
        routeMarkersRef.current.forEach((overlay) => overlay.setMap(null));
        routeMarkersRef.current = [];
      }
    };
  }, []);

  const openChat = useCallback((prompt = "") => {
    setChatPrompt(prompt); //챗봇 프롬프트 설정 객체
    setChatOpen(true);
  }, []);

  const handleCategorySelect = useCallback((category) => {
    //카테고리 선택 토글 객체
    setActiveCategory((prev) => (prev === category ? null : category));
  }, []);

  const handleCameraToggle = (next) => {
    if (!next) {
      setCameraPromptOpen(false);
      setCameraOpen(false);
      if (cameraPromptTimeoutRef.current) {
        window.clearTimeout(cameraPromptTimeoutRef.current);
        cameraPromptTimeoutRef.current = null;
      }
      return;
    }

    setCameraOpen(false);
    setCameraPromptOpen(true);
    if (cameraPromptTimeoutRef.current) {
      window.clearTimeout(cameraPromptTimeoutRef.current);
    }

    cameraPromptTimeoutRef.current = window.setTimeout(() => {
      setCameraPromptOpen(false);
      setCameraOpen(true);
      cameraPromptTimeoutRef.current = null;
    }, 2000);
  };

  const clearRouteMarkers = useCallback(() => {
    if (routeMarkersRef.current.length) {
      routeMarkersRef.current.forEach((overlay) => overlay.setMap(null));
      routeMarkersRef.current = [];
    }
  }, []);

  const renderRouteMarkers = useCallback(() => { //경로 마커 렌더링
    if (!kakaoRef.current || !mapRef.current) return;
    clearRouteMarkers();

    const kakao = kakaoRef.current;
    const map = mapRef.current;

    sampleRoute.forEach((point, index) => { 
      const position = new kakao.maps.LatLng(point.lat, point.lng);
      const imageSrc = ROUTE_PINS[index] || ROUTE_PINS[ROUTE_PINS.length - 1];
      const imageSize = new kakao.maps.Size(32, 32);
      const imageOption = { offset: new kakao.maps.Point(20, 16) };
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const marker = new kakao.maps.Marker({
        position,
        image: markerImage,
        map,
      });
      routeMarkersRef.current.push(marker);
    });
  }, [clearRouteMarkers, sampleRoute]);

  useEffect(() => {
    if (!mapReady) return;
    if (routeActive) {
      renderRouteMarkers();
    } else {
      clearRouteMarkers();
    }
  }, [clearRouteMarkers, mapReady, renderRouteMarkers, routeActive]);

  const createPlaceOverlayContent = useCallback(
    //인포윈도우 생성 객체
    (place) => {
      const container = document.createElement("div");
      container.style.cssText = [
        "position: relative",
        "background: #ffffff",
        "border-radius: 14px",
        "padding: 10px 12px",
        "min-width: 200px",
        "max-width: 200px",

        // 크기 및 박스 모델
        "width: fit-content",
        "height: fit-content",
        "box-sizing: border-box",

        // 텍스트 처리
        "word-break: break-word",
        "overflow-wrap: break-word",
        "white-space: normal",

        "box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18)",
        "font-size: 12px",
        "line-height: 1.45",
        "color: #111827",
      ].join(";");

      container.addEventListener("click", (event) => event.stopPropagation());

      const header = document.createElement("div");
      header.style.cssText = "display:flex;align-items:center;gap:8px;";

      const title = document.createElement("div"); // 장소 이름
      title.textContent = place.name;
      title.style.cssText = [
        "flex:1",
        "font-weight:700",
        "font-size:13px",
        "line-height:1.3",
        "word-break:break-word",
        "overflow-wrap:break-word",
      ].join(";");

      const heartButton = document.createElement("button");
      heartButton.type = "button";
      heartButton.style.cssText =
        "border:none;background:transparent;font-size:14px;cursor:pointer;";

      const updateHeart = (liked) => {
        // 하트 아이콘 업데이트
        heartButton.textContent = liked ? "\u2665" : "\u2661"; // 채워진 하트 또는 빈 하트
        heartButton.style.color = liked ? "#f97316" : "#9ca3af"; // 주황색 또는 회색
      };

      let liked = !!place.liked;
      updateHeart(liked);
      heartButton.addEventListener("click", (event) => {
        event.stopPropagation();
        liked = !liked;
        updateHeart(liked);
      });

      header.appendChild(title);
      header.appendChild(heartButton);

      const ratingRow = document.createElement("div"); // 평점
      ratingRow.textContent = `\u2605 ${place.rating}`;
      ratingRow.style.cssText = "margin-top:6px;font-weight:600;color:#f59e0b;";

      const addressRow = document.createElement("div"); // 주소
      addressRow.textContent = place.address;
      addressRow.style.cssText = [
        "margin-top:6px",
        "color:#6b7280",
        "line-height:1.4",
        "word-break:break-word",
        "overflow-wrap:break-word",
        "white-space:normal",
      ].join(";");

      const linkRow = document.createElement("a");
      linkRow.href = place.mapUrl;
      linkRow.target = "_blank";
      linkRow.rel = "noreferrer";
      linkRow.textContent = "자세히 보기 (카카오 맵)";
      linkRow.style.cssText = [
        "display:block",
        "padding:3px 0", // 클릭 영역 확보
        "color:#2563eb",
        "text-decoration:none",
        "font-weight:600",
        "white-space:normal",
      ].join(";");

      // 챗봇 버튼
      const askButton = document.createElement("button");
      askButton.type = "button";
      askButton.textContent = "챗봇에게 물어보기";
      askButton.style.cssText = [
        "display:block",
        "padding:3px 0", // 클릭 영역 확보
        "border:none",
        "background:transparent",
        "color:#f97316",
        "font-weight:700",
        "cursor:pointer",
        "white-space:normal",
        "text-align:left",
      ].join(";");

      askButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const prompt = `${place.name} - ${place.address}가 궁금해.`;
        openChat(prompt);
      });

      const actionBox = document.createElement("div");
      actionBox.style.cssText = [
        "display:flex",
        "flex-direction:column",
        "gap:6px",
        "margin-top:8px",
      ].join(";");

      actionBox.appendChild(linkRow);
      actionBox.appendChild(askButton);

      const tail = document.createElement("div");
      tail.style.cssText = [
        //인포윈도우 꼬리
        "position:absolute",
        "left:50%",
        "transform:translateX(-50%)",
        "bottom:-8px",
        "width:0",
        "height:0",
        "border-left:8px solid transparent",
        "border-right:8px solid transparent",
        "border-top:8px solid #ffffff",
        "filter:drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
      ].join(";");

      container.appendChild(header);
      container.appendChild(ratingRow);
      container.appendChild(addressRow);
      container.appendChild(actionBox);
      container.appendChild(tail);

      return container;
    },
    [openChat]
  );

  const KAKAO_CATEGORY = {
    //카카오 맵 카테고리 코드
    food: "FD6", // 음식점
    cafe: "CE7", // 카페
    place: "AT4", // 관광명소
  };

  useEffect(() => {
    //카테고리 변경 시 마커 및 오버레이 처리
    if (!mapReady || !mapRef.current || !kakaoRef.current) return;

    const kakao = kakaoRef.current;
    const map = mapRef.current;

    // 🔹 카테고리 선택 안 했으면 전부 제거
    if (!activeCategory) {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current.clear();
      activeOverlayRef.current = null;
      return;
    }

    // 🔹 기존 마커/오버레이 정리
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current.clear();
    activeOverlayRef.current = null;

    // 🔹 카카오 장소 서비스
    const placesService = new kakao.maps.services.Places();

    // 🔹 인천 영역 bounds 설정 (대략)
    // const incheonBounds = new kakao.maps.LatLngBounds(
    //   new kakao.maps.LatLng(36.8, 125.9), // 남서 (옹진 남쪽 바다 포함)
    //   new kakao.maps.LatLng(37.9, 126.9) // 북동 (강화 북단 포함)
    // );
    const bounds = map.getBounds(); // 현재 지도 영역 기준으로 생성

    const markerSize = new kakao.maps.Size(33, 33);
    const markerOffset = new kakao.maps.Point(16, 33);
    const markerImage = new kakao.maps.MarkerImage(
      CATEGORY_MARKERS[activeCategory],
      markerSize,
      { offset: markerOffset }
    );

    placesService.categorySearch(
      KAKAO_CATEGORY[activeCategory], // 카테고리 코드 넘김
      (result, status) => {
        if (status !== kakao.maps.services.Status.OK) return;

        result.forEach((place, index) => {
          const position = new kakao.maps.LatLng(place.y, place.x);

          const marker = new kakao.maps.Marker({
            position,
            image: markerImage,
            map,
          });

          markersRef.current.push(marker);

          const overlay = new kakao.maps.CustomOverlay({
            position,
            content: createPlaceOverlayContent({
              id: place.id ?? index,
              name: place.place_name,
              address: place.road_address_name || place.address_name,
              rating: place.rating ?? "",
              lat: place.y,
              lng: place.x,
              mapUrl: place.place_url,
              liked: false,
            }),
            xAnchor: 0.5,
            yAnchor: 1.24,
            zIndex: 3,
          });

          overlaysRef.current.set(place.id, overlay);

          kakao.maps.event.addListener(marker, "click", () => {
            //마커 클릭 시 오버레이 토글

            map.panTo(position); // 🔹 지도 중심 살짝 이동

            if (
              activeOverlayRef.current &&
              activeOverlayRef.current !== overlay
            ) {
              activeOverlayRef.current.setMap(null);
            }

            if (overlay.getMap()) {
              overlay.setMap(null);
              activeOverlayRef.current = null;
            } else {
              overlay.setMap(map);
              activeOverlayRef.current = overlay;
            }
          });
        });
      },
      {
        bounds: bounds, // 현재 지도구역으로 한정
        size: 15, // 한 번에 가져올 장소 수
      }
    );
  }, [activeCategory, createPlaceOverlayContent, mapReady]);

  const handleMoveToMyLocation = (active = true) => {
    if (!active) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      setLocating(false);
      if (locationWatchRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
        locationWatchRef.current = null;
      }
      if (locationTimeoutRef.current) {
        window.clearTimeout(locationTimeoutRef.current);
        locationTimeoutRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      window.alert("Geolocation is not supported in this browser.");
      setLocating(false);
      return;
    }

    if (!mapRef.current || !kakaoRef.current) {
      window.alert("Map is not ready yet.");
      setLocating(false);
      return;
    }

    if (locationWatchRef.current !== null) {
      navigator.geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
    if (locationTimeoutRef.current) {
      window.clearTimeout(locationTimeoutRef.current);
      locationTimeoutRef.current = null;
    }

    setLocating(true);
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };
    const MAX_TRIES = 12;
    const TARGET_ACCURACY = 10;
    const MAX_WAIT_MS = 30000;
    let tries = 0;
    let best = null;
    let hasFirstFix = false;

    const kakao = kakaoRef.current;
    const map = mapRef.current;

    const updateMarker = () => {
      if (!best || !kakao || !map) return;
      const { latitude, longitude } = best;
      const latlng = new kakao.maps.LatLng(latitude, longitude);
      const imageSrc = gender === "F" ? femalePin : malePin;
      const imageSize = new kakao.maps.Size(47, 60); // 마커 이미지 크기
      const imageOption = { offset: new kakao.maps.Point(24, 60) }; // 마커 이미지 기준점
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      map.setCenter(latlng);
      map.setLevel(3);

      if (markerRef.current) {
        markerRef.current.setPosition(latlng);
      } else {
        markerRef.current = new kakao.maps.Marker({
          position: latlng,
          image: markerImage,
          map,
        });
      }
    };

    locationWatchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        tries += 1;
        const { latitude, longitude, accuracy } = position.coords;

        if (!best || accuracy < best.accuracy) {
          best = { latitude, longitude, accuracy };
          updateMarker();
          if (!hasFirstFix) {
            hasFirstFix = true;
            setLocating(false);
          }
        }

        if (accuracy <= TARGET_ACCURACY || tries >= MAX_TRIES) {
          navigator.geolocation.clearWatch(locationWatchRef.current);
          locationWatchRef.current = null;
          if (locationTimeoutRef.current) {
            window.clearTimeout(locationTimeoutRef.current);
            locationTimeoutRef.current = null;
          }
          setLocating(false);
          updateMarker();
        }
      },
      () => {
        window.alert("Location permission is required.");
        setLocating(false);
        if (locationWatchRef.current !== null) {
          navigator.geolocation.clearWatch(locationWatchRef.current);
          locationWatchRef.current = null;
        }
        if (locationTimeoutRef.current) {
          window.clearTimeout(locationTimeoutRef.current);
          locationTimeoutRef.current = null;
        }
      },
      options
    );

    locationTimeoutRef.current = window.setTimeout(() => {
      if (locationWatchRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
        locationWatchRef.current = null;
      }
      updateMarker();
      setLocating(false);
      locationTimeoutRef.current = null;
    }, MAX_WAIT_MS);
  };

  return (
    <AppLayout
      header={
        <header className="font-sans h-14 flex items-center px-4 pt-3 border-b bg-white z-10">
          <h1 className="text-lg font-bold">Incheon Mate</h1>
        </header>
      }
    >
      {/* 🔥 지도 기준 컨테이너 */}
      <div className="relative w-full h-full overflow-hidden">
        {/* 지도 */}
        <div id="map" className="w-full h-full" />
        {!mapReady && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500" />
            <p className="mt-2 text-sm text-gray-600">지도 로딩 중...</p>
          </div>
        )}
        {/* 오버레이 및 챗봇 */}
        <MapOverlay
          onMoveToMyLocation={handleMoveToMyLocation}
          onToggleCamera={handleCameraToggle}
          cameraOpen={cameraOpen || cameraPromptOpen}
          onToggleRoute={setRouteActive}
          routeActive={routeActive}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          locating={locating}
        />
        <ChatbotAvatar
          onOpen={() => openChat("")}
          showBubble={cameraPromptOpen}
          bubbleText="같이 인증샷 찍을까?"
        />
        {chatOpen && (
          <ChatbotSheet
            onClose={() => setChatOpen(false)}
            initialPrompt={chatPrompt}
          />
        )}
        {cameraOpen && <CameraOverlay onClose={() => setCameraOpen(false)} />}
      </div>
    </AppLayout>
  );
}
export default Home;
