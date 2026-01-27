import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePersona } from "../context/PersonaContext";
import { useLanguage } from "../context/LanguageContext";
import useSignupStore from "../stores/useSignupStore";

import NicknameField from "../components/auth/NicknameField";
import BirthField from "../components/auth/BirthField";
import GenderSelector from "../components/auth/GenderSelector";
import MbtiField from "../components/auth/MbtiField";
import PhotoUpload from "../components/auth/PhotoUpload";
import CompanionSelector from "../components/auth/CompanionSelector";
import SasangTestButton from "../components/auth/SasangTestButton";
import PersonaButton from "../components/auth/PersonaButton";
import { FaArrowLeft } from "react-icons/fa6";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function InfoInput() {
  const navigate = useNavigate();

  // ==== Context ====
  const { setPersona } = usePersona();
  const { language } = useLanguage();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // ==== zustand store 상태 ====
  const {
    nickname,
    nicknameChecked,
    nicknameAvailable,
    birth,
    gender,
    mbti,
    photoFile,
    skipPhoto,
    companion,
    sasangResult,
    personaKey,
    patch,
    resetForm,
  } = useSignupStore((s) => ({
    nickname: s.nickname,
    nicknameChecked: s.nicknameChecked,
    nicknameAvailable: s.nicknameAvailable,
    birth: s.birth,
    gender: s.gender,
    mbti: s.mbti,
    photoFile: s.photoFile,
    skipPhoto: s.skipPhoto,
    companion: s.companion,
    sasangResult: s.sasangResult,
    personaKey: s.personaKey,
    patch: s.patch,
    resetForm: s.resetForm,
  }));

  // ==== UI 로컬 상태 ====
  const [active, setActive] = useState("");

  const companions = ["혼자", "가족", "연인", "친구"];
  const companionCodeMap = {
    [companions[0]]: "SOLO",
    [companions[1]]: "FAMILY",
    [companions[2]]: "COUPLE",
    [companions[3]]: "FRIEND",
  };
  const sasangCodeMap = {
    태양인: "TAEYANG",
    소양인: "SOYANG",
    태음인: "TAEUM",
    소음인: "SOEUM",
  };

  // ===== validation =====
  const nicknameValid = nickname.trim().length >= 2;
  const birthValid = useMemo(() => {
    if (!/^\d{6}$/.test(birth)) return false;

    const year = parseInt(birth.substring(0, 2));
    const month = parseInt(birth.substring(2, 4));
    const day = parseInt(birth.substring(4, 6));

    if (month < 1 || month > 12) return false;

    if (day < 1 || day > 31) return false;

    const daysInMonth = new Date(year + 2000, month, 0).getDate();
    if (day > daysInMonth) return false;

    return true;
  }, [birth]);

  const mbtiValid = /^[EI][NS][FT][PJ]$/i.test(mbti.trim());

  const onNicknameChange = (v) => {
    patch({
      nickname: v,
      nicknameChecked: false,
      nicknameAvailable: null,
    });
  };

    const checkNickname = async () => {
      if (!nicknameValid) return;

      try {
        const accessToken = localStorage.getItem("accessToken") || "";
        const tokenType = localStorage.getItem("tokenType") || "Bearer";

        console.log("tokenType:", tokenType);
        console.log("accessToken length:", accessToken?.length);

        const response = await fetch(
          `${baseUrl}/api/onboarding/check?nickname=${encodeURIComponent(nickname)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
              ...(accessToken
                ? { Authorization: `${tokenType} ${accessToken}` }
                : {}),
            },
          },
        );

        console.log("status:", response.status);
        console.log("content-type:", response.headers.get("content-type"));

        const raw = await response.text();
        const title = raw.match(/<title>(.*?)<\/title>/i)?.[1];
        console.log("raw response:", raw.slice(0, 1000));
        console.log("HTML title:", title);

        // ✅ 여기서 raw를 JSON으로 다시 파싱
        const data = JSON.parse(raw);

        const available = data?.isOk === true;

        patch({
          nicknameChecked: true,
          nicknameAvailable: available,
        });
      } catch (e) {
        console.log("checkNickname error:", e);
        patch({
          nicknameChecked: true,
          nicknameAvailable: false,
        });
      }
    };

  // ===== 가입 가능 여부 =====
  const canSubmit = useMemo(() => {
    const nicknameOk =
      nicknameValid && nicknameChecked && nicknameAvailable === true;

    return (
      nicknameOk &&
      birthValid &&
      gender &&
      mbtiValid &&
      !!companion &&
      !!sasangResult &&
      !!personaKey
    );
  }, [
    nicknameValid,
    nicknameChecked,
    nicknameAvailable,
    birthValid,
    gender,
    mbtiValid,
    companion,
    sasangResult,
    personaKey,
  ]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    // PersonaContext에 반영
    setPersona(personaKey);

    const accessToken = localStorage.getItem("accessToken") || "";
    const tokenType = localStorage.getItem("tokenType") || "Bearer";
    const selectedPersona = personaKey
      ? personaKey.startsWith("persona_")
        ? personaKey
        : `${personaKey}`.toUpperCase()
      : "";
    const genderValue =
      gender === "M" ? "MALE" : gender === "F" ? "FEMALE" : gender;
    const profileImageURL =
      typeof photoFile === "string" && photoFile.length > 0 ? photoFile : null;

    const payload = {
      nickname: nickname.trim(),
      birthDate: birth,
      gender: genderValue,
      mbti: mbti.trim().toUpperCase(),
      profileImageURL,
      companion: companionCodeMap[companion] || companion,
      sasang: sasangCodeMap[sasangResult] || sasangResult,
      selectedPersona,
      lang: language === "ENG" ? "eng" : "kor",
    };

    try {
      const response = await fetch(`${baseUrl}/api/onboarding/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          ...(accessToken ? { Authorization: `${tokenType} ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("onboarding complete failed:", response.status, text);
        return;
      }
    } catch (e) {
      console.error("onboarding complete error:", e);
      return;
    }

    // 가입 정보 POST
    // 폼 초기화
    resetForm();
    navigate("/home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center"
        >
          <FaArrowLeft size={20} />
        </button>

        <h1 className="mt-5 text-lg font-extrabold">
          내 정보 입력을 완료해주세요
        </h1>
      </div>

      {/* 본문 */}
      <main className="flex-1 px-6 pt-6">
        <NicknameField
          value={nickname}
          onChange={onNicknameChange}
          active={active === "nickname"}
          onFocus={() => setActive("nickname")}
          onBlur={() => setActive("")}
          checked={nicknameChecked}
          available={nicknameAvailable}
          canCheck={nicknameValid}
          onCheck={checkNickname}
        />

        <BirthField
          value={birth}
          setValue={(v) => patch({ birth: v })}
          active={active === "birth"}
          onFocus={() => setActive("birth")}
          onBlur={() => setActive("")}
          valid={birthValid}
        />

        <GenderSelector value={gender} onChange={(v) => patch({ gender: v })} />

        <MbtiField
          value={mbti}
          setValue={(v) => patch({ mbti: v })}
          active={active === "mbti"}
          onFocus={() => setActive("mbti")}
          onBlur={() => setActive("")}
          valid={mbtiValid}
        />

        <PhotoUpload
          photoFile={photoFile}
          setPhotoFile={(f) => patch({ photoFile: f })}
          skipPhoto={skipPhoto}
          setSkipPhoto={(b) => patch({ skipPhoto: b })}
        />

        <CompanionSelector
          companions={companions}
          value={companion}
          setValue={(v) => patch({ companion: v })}
        />

        <SasangTestButton
          value={sasangResult}
          onClick={() => navigate("/sasang-test")}
        />

        {/* 페르소나 선택 페이지로 이동 */}
        <PersonaButton
          value={personaKey}
          onClick={() => navigate("/persona")}
        />

        <div className="h-10" />
      </main>

      {/* 하단 버튼 */}
      <div className="px-6 pb-14 pt-6">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className={clsx(
            "h-14 w-full rounded-2xl font-extrabold transition",
            canSubmit
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-white cursor-not-allowed",
          )}
        >
          가입 완료
        </button>
      </div>
    </div>
  );
}
