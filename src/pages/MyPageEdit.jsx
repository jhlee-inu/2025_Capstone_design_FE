import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera } from "react-icons/fi";
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

function MyPageEdit() {
  const navigate = useNavigate();
  const { persona } = usePersona();
  const avatarSrc = personaImages[persona] || personaImages.bear;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [profile, setProfile] = useState({
    nickname: "",
    birthDate: "",
    mbti: "",
    sasang: "",
    profileImageURL: "",
  });
  const [isSaving, setIsSaving] = useState(false);

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
          birthDate: data?.birthDate || "",
          mbti: data?.mbti || "",
          sasang: data?.sasang || "",
          profileImageURL: data?.profileImageURL || "",
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

  const sasangLabel = sasangLabelMap[profile.sasang] || profile.sasang || "";

  const handleSave = async () => {
    if (isSaving) return;
    if (!baseUrl) {
      console.warn("VITE_API_BASE_URL is not set.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken") || "";
    const tokenType = localStorage.getItem("tokenType") || "Bearer";
    const payload = {
      nickname: profile.nickname.trim(),
      birthdate: profile.birthDate,
      mbti: profile.mbti.trim().toUpperCase(),
      sasang: profile.sasang,
      profileImageURL: profile.profileImageURL || null,
    };

    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}/api/my-info/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          ...(accessToken
            ? { Authorization: `${tokenType} ${accessToken}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("my-info patch failed:", response.status, text);
        return;
      }

      navigate("/mypage");
    } catch (e) {
      console.error("my-info patch error:", e);
    } finally {
      setIsSaving(false);
    }
  };

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
          <h1 className="text-lg font-bold">내 정보 수정</h1>
        </header>
      }
    >
      <div className="min-h-full bg-gray-50 px-4 py-6 font-medium">
        <section className="rounded-3xl bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="h-20 w-20 object-contain"
                />
              </div>
              <button
                type="button"
                className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow text-orange-500"
                aria-label="edit profile photo"
              >
                <FiCamera size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">
                닉네임
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
                placeholder="사용자1"
                value={profile.nickname}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    nickname: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">나이</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
                placeholder="111111"
                value={profile.birthDate}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    birthDate: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">MBTI</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
                placeholder="ISFP"
                value={profile.mbti}
                onChange={(event) =>
                  setProfile((prev) => ({
                    ...prev,
                    mbti: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">
                사상체질
              </label>
              <button
                type="button"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                onClick={() =>
                  navigate("/sasang-test", {
                    state: { from: "/mypage/edit", mode: "edit" },
                  })
                }
              >
                {sasangLabel || "사상의학 테스트"}
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={[
              "h-12 w-full rounded-2xl font-extrabold transition",
              isSaving
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-blue-600 text-white",
            ].join(" ")}
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default MyPageEdit;
