import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePersona } from "../context/PersonaContext";
import useSignupStore from "../stores/useSignupStore";

import Modal from "../components/auth/Modal";
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
  const [sasangOpen, setSasangOpen] = useState(false);

  const companions = ["혼자", "가족", "연인", "친구"];

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

  const checkNickname = () => {
    if (!nicknameValid) return;

    // 중복검사 (임시)
    const ok = !nickname.includes("사용자");

    patch({
      nicknameChecked: true,
      nicknameAvailable: ok,
    });
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

  const onSubmit = () => {
    if (!canSubmit) return;

    // PersonaContext에 반영
    setPersona(personaKey);

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

        <GenderSelector
          value={gender}
          onChange={(v) => patch({ gender: v })}
        />

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
          onClick={() => setSasangOpen(true)}
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
              : "bg-gray-300 text-white cursor-not-allowed"
          )}
        >
          가입 완료
        </button>
      </div>

      {/* 사상의학 모달 */}
      {sasangOpen && (
        <Modal title="사상의학 테스트" onClose={() => setSasangOpen(false)}>
          <div className="grid grid-cols-2 gap-2">
            {["태양인", "태음인", "소양인", "소음인"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  patch({ sasangResult: v });
                  setSasangOpen(false);
                }}
                className="h-12 rounded-2xl border font-extrabold"
              >
                {v}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
