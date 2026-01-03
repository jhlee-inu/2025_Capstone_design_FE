import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePersona } from "../context/PersonaContext";
import useSignupStore from "../stores/useSignupStore";

import bearHero from "../assets/bear.png";
import rabbitHero from "../assets/rabbit.png";
import pandaHero from "../assets/panda.png";
import catHero from "../assets/cat.png";
import bearThumb from "../assets/bear chat.png";
import rabbitThumb from "../assets/rabbit chat.png";
import pandaThumb from "../assets/panda chat.png";
import catThumb from "../assets/cat chat.png";
import { FaArrowLeft } from "react-icons/fa6";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

const PERSONAS = [
  {
    id: "곰",
    desc1: "다정함, 차분한",
    heroBg: "bg-rose-200",
    thumbBg: "bg-rose-100",
    hero: bearHero,
    thumb: bearThumb,
    key: "bear",
  },
  {
    id: "토끼",
    desc1: "활발한, 사고적인",
    heroBg: "bg-yellow-100",
    thumbBg: "bg-yellow-50",
    hero: rabbitHero,
    thumb: rabbitThumb,
    key: "rabbit",
  },
  {
    id: "판다",
    desc1: "느긋한, 순한",
    heroBg: "bg-emerald-100",
    thumbBg: "bg-emerald-50",
    hero: pandaHero,
    thumb: pandaThumb,
    key: "panda",
  },
  {
    id: "고양이",
    desc1: "도도한, 호기심 많은",
    heroBg: "bg-purple-100",
    thumbBg: "bg-purple-50",
    hero: catHero,
    thumb: catThumb,
    key: "cat",
  },
];

export default function Persona() {
  const navigate = useNavigate();

  // ==== context & zustand store 상태 ====
  const { persona } = usePersona();
  const { personaKey, setPersonaKey } = useSignupStore((s) => ({
    personaKey: s.personaKey,
    setPersonaKey: s.setPersonaKey,
  }));

  // ==== UI 로컬 상태 ====
  const initialKey = personaKey || persona || PERSONAS[0].key;
  const [selectedKey, setSelectedKey] = useState(initialKey);

  const hero = useMemo(
    () => PERSONAS.find((p) => p.key === selectedKey) || PERSONAS[0],
    [selectedKey]
  );

  const onConfirm = () => {
    if (!selectedKey) return;

    // 선택한 페르소나 저장 후 이전 페이지로 이동
    setPersonaKey(selectedKey);
    navigate(-1, { state: { persona: hero.id, personaKey: selectedKey } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 상단바 */}
      <header className="h-12 flex items-center px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center font-extrabold">페르소나 선택</h1>
        <div className="w-8" />
      </header>

      {/* 상단 영역 */}
      <section
        className={clsx(
          "h-56 w-full flex items-center justify-center",
          hero.heroBg
        )}
      >
        <img
          src={hero.hero}
          alt={`${hero.id} hero`}
          className="h-44 w-44 object-contain"
        />
      </section>

      {/* 카드 영역 */}
      <main className="flex-1 px-6 mt-10">
        <div className="grid grid-cols-2 gap-4">
          {PERSONAS.map((p) => {
            const isSelected = p.key === selectedKey;

            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setSelectedKey(p.key)}
                className={clsx(
                  "rounded-3xl bg-white shadow-sm border transition p-5",
                  isSelected ? "border-blue-500" : "border-transparent"
                )}
              >
                {/* 원형 배경 + 얼굴 아이콘 */}
                <div className="flex justify-center">
                  <div
                    className={clsx(
                      "h-16 w-16 rounded-full grid place-items-center",
                      p.thumbBg
                    )}
                  >
                    <img
                      src={p.thumb}
                      alt={`${p.id} thumb`}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <div className="text-base font-extrabold">{p.id}</div>
                  <div className="mt-1 text-xs text-gray-500 font-semibold">
                    {p.desc1}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="px-6 pb-14">
        <button
          type="button"
          onClick={onConfirm}
          className="h-14 w-full rounded-2xl bg-blue-600 text-white font-extrabold"
        >
          선택하기
        </button>
      </div>
    </div>
  );
}
