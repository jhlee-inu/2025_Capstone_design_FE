import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgreeItem from "../components/auth/AgreeItem";

function Agree() {
  const navigate = useNavigate();

  // 개별 동의
  const [terms, setTerms] = useState(false);     // [필수] 서비스 이용약관
  const [privacy, setPrivacy] = useState(false); // [필수] 개인정보 수집 및 이용
  const [location, setLocation] = useState(false); // [선택] 위치기반

  // 전체 동의(필수, 선택 포함)
  const allChecked = useMemo(() => terms && privacy && location, [terms, privacy, location]);

  // 필수 동의 완료 여부 (버튼 활성화 조건)
  const requiredChecked = useMemo(() => terms && privacy, [terms, privacy]);

  const toggleAll = (checked) => {
    setTerms(checked);
    setPrivacy(checked);
    setLocation(checked);
  };

  const onSubmit = () => {
    if (!requiredChecked) return;
    // API 
    navigate("/InfoInput");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <header className="h-14 flex items-center px-4 pt-3 border-b bg-white">
        <h1 className="text-lg font-bold">Incheon Mate</h1>
      </header>

      {/* 본문 */}
      <main className="flex-1 px-6 pt-8">
        <h2 className="text-xl font-extrabold leading-snug">
          서비스 이용을 위해 <br />
          약관에 동의해주세요
        </h2>

        {/* 전체 동의 */}
        <div className="mt-8">
          <label className="flex items-center gap-3 py-4">
            <input
              type="checkbox"
              className="h-5 w-5 accent-blue-600"
              checked={allChecked}
              onChange={(e) => toggleAll(e.target.checked)}
            />
            <span className="font-semibold">전체 동의하기</span>
          </label>
        </div>

        <div className="h-3 bg-gray-100 -mx-6" />

        {/* 개별 동의 리스트 */}
        <div className="mt-4 space-y-5">
          <AgreeItem
            required
            label="서비스 이용약관 동의"
            checked={terms}
            onChange={setTerms}
          />

          <AgreeItem
            required
            label="개인정보 수집 및 이용 동의"
            checked={privacy}
            onChange={setPrivacy}
          />

          <AgreeItem
            required={false}
            label="위치기반 서비스 이용약관 동의"
            checked={location}
            onChange={setLocation}
          />
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="px-6 pb-14">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!requiredChecked}
          className={[
            "h-14 w-full rounded-2xl font-extrabold transition",
            requiredChecked
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-white cursor-not-allowed",
          ].join(" ")}
        >
          동의하고 가입하기
        </button>
      </div>
    </div>
  );
}

export default Agree;
