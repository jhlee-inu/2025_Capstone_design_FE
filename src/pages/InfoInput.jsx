import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Modal from "../components/auth/Modal";
import NicknameField from "../components/auth/NicknameField";
import BirthField from "../components/auth/BirthField";
import MbtiField from "../components/auth/MbtiField";
import PhotoUpload from "../components/auth/PhotoUpload";
import CompanionSelector from "../components/auth/CompanionSelector";
import SasangTestButton from "../components/auth/SasangTestButton";
import PersonaButton from "../components/auth/PersonaButton";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function InfoInput() {
  const navigate = useNavigate();
  const location = useLocation();

  // ===== 입력값 =====
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(null);

  const [birth, setBirth] = useState("");
  const [mbti, setMbti] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [skipPhoto, setSkipPhoto] = useState(false);

  const companions = ["혼자", "가족", "연인", "친구"];
  const [companion, setCompanion] = useState("");

  const [sasangResult, setSasangResult] = useState("");
  const [persona, setPersona] = useState("");

  const [active, setActive] = useState("");
  const [sasangOpen, setSasangOpen] = useState(false);

  // ===== persona 페이지에서 돌아올 때 =====
  useEffect(() => {
    const selectedPersona = location.state?.persona;
    if (selectedPersona) {
      setPersona(selectedPersona);

      // state 중복 적용 방지
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // ===== validation =====
  const nicknameValid = nickname.trim().length >= 2;
  const birthValid = /^\d{6}$/.test(birth);
  const mbtiValid = /^[EI][NS][FT][PJ]$/i.test(mbti.trim());

  const onNicknameChange = (v) => {
    setNickname(v);
    setNicknameChecked(false);
    setNicknameAvailable(null);
  };

  const checkNickname = () => {
    if (!nicknameValid) return;
    setNicknameChecked(true);

    // 중복 검사
    const ok = !nickname.includes("사용자");
    setNicknameAvailable(ok);
  };

  const canSubmit = useMemo(() => {
    const nicknameOk =
      nicknameValid && nicknameChecked && nicknameAvailable === true;

    return (
      nicknameOk &&
      birthValid &&
      mbtiValid &&
      !!companion &&
      !!sasangResult &&
      !!persona
    );
  }, [
    nicknameValid,
    nicknameChecked,
    nicknameAvailable,
    birthValid,
    mbtiValid,
    companion,
    sasangResult,
    persona,
  ]);

  const onSubmit = () => {
    if (!canSubmit) return;

    // 가입 정보 POST
    navigate("/home");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단 */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-2xl font-bold"
        >
          ←
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
          setValue={setBirth}
          active={active === "birth"}
          onFocus={() => setActive("birth")}
          onBlur={() => setActive("")}
          valid={birthValid}
        />

        <MbtiField
          value={mbti}
          setValue={setMbti}
          active={active === "mbti"}
          onFocus={() => setActive("mbti")}
          onBlur={() => setActive("")}
          valid={mbtiValid}
        />

        <PhotoUpload
          photoFile={photoFile}
          setPhotoFile={setPhotoFile}
          skipPhoto={skipPhoto}
          setSkipPhoto={setSkipPhoto}
        />

        <CompanionSelector
          companions={companions}
          value={companion}
          setValue={setCompanion}
        />

        <SasangTestButton
          value={sasangResult}
          onClick={() => setSasangOpen(true)}
        />

        {/* 페이지 이동 */}
        <PersonaButton
          value={persona}
          onClick={() =>
            navigate("/persona", {
              state: { selected: persona },
            })
          }
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

      {/* 사상의학 모달 (유지) */}
      {sasangOpen && (
        <Modal title="사상의학 테스트" onClose={() => setSasangOpen(false)}>
          <div className="grid grid-cols-2 gap-2">
            {["태양인", "태음인", "소양인", "소음인"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setSasangResult(v);
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
