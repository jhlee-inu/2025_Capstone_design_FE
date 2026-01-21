import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { usePersona } from "../context/PersonaContext";
import AppLayout from "../layouts/AppLayout";
import bearAvatar from "../assets/persona/bear scarf.png";
import catAvatar from "../assets/persona/cat camera.png";
import pandaAvatar from "../assets/persona/panda map.png";
import rabbitAvatar from "../assets/persona/rabbit bag.png";

const personaImages = {
  bear: bearAvatar,
  cat: catAvatar,
  panda: pandaAvatar,
  rabbit: rabbitAvatar,
};

function MyPage() {
  const navigate = useNavigate();
  const { persona } = usePersona();
  const avatarSrc = personaImages[persona] || personaImages.bear;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [profile, setProfile] = useState({
    nickname: "",
    mbti: "",
    sasang: "",
  });

  const sasangLabelMap = {
    TAEYANG: "태양인",
    SOYANG: "소양인",
    TAEUM: "태음인",
    SOEUM: "소음인",
  };

  useEffect(() => {
    let active = true;

    const fetchOnboarding = async () => {
      if (!baseUrl) {
        console.warn("VITE_API_BASE_URL is not set.");
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken") || "";
        const tokenType = localStorage.getItem("tokenType") || "Bearer";

        const response = await fetch(`${baseUrl}/api/onboarding`, {
          method: "GET",
          headers: {    
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            ...(accessToken
              ? { Authorization: `${tokenType} ${accessToken}` }
              : {}),
          },
        });

        if (!response.ok) {
          console.error("onboarding fetch failed:", response.status);
          return;
        }

        const data = await response.json();
        if (!active) return;

        setProfile({
          nickname: data?.nickname || "",
          mbti: data?.mbti || "",
          sasang: data?.sasang || "",
        });
      } catch (e) {
        console.error("onboarding fetch error:", e);
      }
    };

    fetchOnboarding();

    return () => {
      active = false;
    };
  }, [baseUrl]);

  const sasangLabel = sasangLabelMap[profile.sasang] || profile.sasang || "-";
  const mbtiLabel = profile.mbti || "-";
  const nicknameLabel = profile.nickname || "닉네임";

  return (
    <AppLayout
      header={
        <header className="h-14 flex items-center px-4 pt-3 border-b bg-white z-10">
          <h1 className="text-lg font-bold">my info</h1>
        </header>
      }
    >
      <div className="min-h-full bg-gray-50 px-4 py-6 font-medium">
        <section className="rounded-3xl bg-white px-5 py-6 shadow-sm">
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full  px-3 py-1 text-xs font-semibold text-orange-500"
              onClick={() => navigate("/mypage/edit")}
            >
              <IoMdSettings />
              정보 수정
            </button>
          </div>

          <div className="mt-5 flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
              <img
                src={avatarSrc}
                alt="profile"
                className="h-20 w-20 object-contain"
              />
            </div>
            <p className="mt-3 text-base font-semibold text-gray-900">
              {nicknameLabel}
            </p>
            <div className="mt-3 flex w-full max-w-[240px] divide-x overflow-hidden rounded-2xl bg-gray-100 text-center text-xs text-gray-600">
              <div className="flex-1 py-2">
                <p className="text-[10px] text-gray-400">사상의학</p>
                <p className="mt-1 text-base font-semibold text-gray-700">
                  {sasangLabel}
                </p>
              </div>
              <div className="flex-1 py-2">
                <p className="text-[10px] text-gray-400">MBTI</p>
                <p className="mt-1 text-base font-semibold text-gray-700">
                  {mbtiLabel}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-3">
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-orange-100 py-4 text-sm font-semibold text-gray-700 shadow-sm"
            onClick={() => navigate("/mypage/chats")}
          >
            <BsChatLeftTextFill className="text-lg text-orange-400" />
            채팅 기록
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-orange-100 py-4 text-sm font-semibold text-gray-700 shadow-sm"
            onClick={() => navigate("/mypage/favorites")}
          >
            <FaHeart className="text-lg text-orange-400" />
            찜한 장소
          </button>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-orange-100 py-4 text-sm font-semibold text-gray-700 shadow-sm"
          >
            <FaWallet className="text-lg text-orange-400" />
            나의 지갑
          </button>
        </section>
      </div>
    </AppLayout>
  );
}

export default MyPage;
