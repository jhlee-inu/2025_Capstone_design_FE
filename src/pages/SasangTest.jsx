import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSignupStore from "../stores/useSignupStore";
import { FaArrowLeft } from "react-icons/fa6";

const QUESTIONS = [
  // 1~4: 외모와 체형
  {
    id: 1,
    category: "외모와 체형",
    title: "1. 나의 체형은 어떤 편인가요?",
    options: [
      "허리와 복부가 발달한 편이고, 상체는 비교적 약한 편이에요.",
      "상체보다 하체가 더 발달한 편이에요.",
      "가슴이 발달한 편이고, 허리 아래쪽은 비교적 빈약한 편이에요.",
      "머리와 목덜미가 발달한 편이고, 허리 쪽은 약한 편이에요.",
    ],
  },
  {
    id: 2,
    category: "외모와 체형",
    title: "2. 내 얼굴형과 가장 비슷한 것은 무엇인가요?",
    options: [
      "얼굴 윤곽이 뚜렷하고 전체적으로 의젓한 인상이에요.",
      "얼굴 윤곽이 갸름하면서도 둥근 편이에요.",
      "얼굴이 비교적 길고, 머리가 앞뒤로 나온 편이에요.",
      "머리가 큰 편이고, 정수리가 솟아 있는 느낌이에요.",
    ],
  },
  {
    id: 3,
    category: "외모와 체형",
    title: "3. 내 이목구비 특징과 가까운 것은 무엇인가요?",
    options: [
      "이목구비가 비교적 크고, 입술이 도톰한 편이에요.",
      "눈·코·입이 전반적으로 작고 섬세한 편이에요.",
      "입이 크지 않고, 턱이 비교적 뾰족한 편이에요.",
      "이마가 넓고, 광대뼈가 도드라져 보여요.",
    ],
  },
  {
    id: 4,
    category: "외모와 체형",
    title: "4. 내 눈빛/인상과 가장 가까운 것은 무엇인가요?",
    options: [
      "눈빛이 또렷하기보다는 조금 침침한 느낌이 있어요.",
      "눈빛이 부드럽고, 눈웃음을 잘 짓는 편이에요.",
      "반응이 빠르고 예리한 눈빛이라는 말을 들어요.",
      "눈빛이 강하고, 눈에서 에너지가 느껴진다는 말을 들어요.",
    ],
  },

  // 5~6: 신체 반응
  {
    id: 5,
    category: "신체 반응",
    title: "5. 평소 땀과 컨디션은 어떤 편인가요?",
    options: [
      "땀이 많은 편이고, 땀을 흘리고 나면 오히려 개운해요.",
      "땀은 많지 않은 편인데, 조금만 땀을 흘려도 쉽게 피곤해져요.",
      "땀이 특별히 많지는 않고, 땀을 흘려도 크게 피곤하지 않아요.",
      "땀이 많은 편이고, 조금만 땀을 흘려도 쉽게 지쳐요.",
    ],
  },
  {
    id: 6,
    category: "신체 반응",
    title: "6. 손발 온도는 어떤 편인가요?",
    options: [
      "손발은 따뜻한 편이지만, 겨울에는 잘 트는 편이에요.",
      "손발이 차가운 편이고, 겨울에도 잘 트지 않아요.",
      "손발이 대체로 따뜻한 편이에요.",
      "손발이 매우 따뜻한 편이에요.",
    ],
  },

  // 7~9: 성격
  {
    id: 7,
    category: "성격",
    title: "7. 평소 말하는 스타일은 어떤 편인가요?",
    options: [
      "말수가 적은 편이고, 가끔 말이 더듬어질 때가 있어요.",
      "말은 많지 않지만, 친한 사람들과 있을 때는 많이 하는 편이에요.",
      "말이 많은 편이고, 직설적으로 표현하는 편이에요.",
      "수다스러운 편은 아니지만, 누구에게든 편하게 말하는 편이에요.",
    ],
  },
  {
    id: 8,
    category: "성격",
    title: "8. 내 성격의 장점이라고 생각하는 것은 무엇인가요?",
    options: [
      "신중하고 예의 바르며, 끈기와 인내심이 강한 편이에요.",
      "침착하고 꼼꼼하며, 생각이 깊고 판단이 빠른 편이에요.",
      "활동적이고 열정적이며, 솔직하고 인정이 많은 편이에요.",
      "적극적이고 결단력이 있으며, 시원시원한 성격으로 잘 어울리는 편이에요.",
    ],
  },
  {
    id: 9,
    category: "성격",
    title: "9. 내 성격의 아쉬운 점(단점)에 가까운 것은 무엇인가요?",
    options: [
      "변화를 크게 좋아하지 않고, 활동보다는 편하게 쉬는 걸 선호해요.",
      "낯을 가리는 편이고, 마음이 상하면 쉽게 풀리지 않는 편이에요.",
      "성격이 급해 실수가 생기기도 하고, 마무리가 약해질 때가 있어요.",
      "계획 없이 일을 벌이기도 하고, 뜻대로 안 되면 화가 나는 편이에요.",
    ],
  },

  // 10~13: 음식
  {
    id: 10,
    category: "음식",
    title: "10. 내가 좋아하는 음식이 가장 많이 포함된 항목은 무엇인가요?",
    options: [
      "밀가루 음식(빵/면), 콩, 고구마, 땅콩, 설탕, 소고기, 우유, 버터, 치즈, 장어, 당근, 버섯, 미역, 김",
      "감자, 닭고기, 꿀, 흰살 생선, 시금치, 양배추, 파, 카레, 후추, 마늘",
      "보리, 돼지고기, 계란, 오리고기, 굴, 새우, 게, 랍스터, 배추, 오이, 상추, 호박, 가지, 맥주, 아이스크림",
      "메밀, 새우, 게, 조개류(굴, 전복 등), 해산물 위주의 식단",
    ],
  },
  {
    id: 11,
    category: "음식",
    title: "11. 내가 좋아하는 과일이 가장 많이 포함된 항목은 무엇인가요?",
    options: [
      "밤, 호두, 배, 자두, 살구",
      "사과, 귤(오렌지), 토마토, 복숭아",
      "수박, 멜론, 딸기, 바나나, 파인애플",
      "포도, 감, 체리",
    ],
  },
  {
    id: 12,
    category: "음식",
    title: "12. 먹었을 때 잘 맞지 않았던 음식이 포함된 항목은 무엇인가요?",
    options: [
      "닭고기, 달걀, 돼지고기, 사과, 커피, 인삼, 꿀, 생강",
      "냉면, 맥주, 아이스크림, 멜론, 수박, 찬 우유, 돼지고기, 오징어, 밀가루 음식",
      "맵고 짠 음식, 닭고기, 꿀, 인삼, 땅콩",
      "맵고 짠 음식, 뜨거운 음식, 기름진 음식, 무, 설탕, 소고기",
    ],
  },
  {
    id: 13,
    category: "음식",
    title: "13. 평소 음식 온도에 대한 내 취향은 어떤 편인가요?",
    options: [
      "따뜻하고 뜨거운 음식을 좋아해요.",
      "따뜻한 음식을 좋아하는 편이에요.",
      "차가운 음식을 좋아하는 편이에요.",
      "시원한 음식을 좋아해요.",
    ],
  },
];

function SasangTest() {
  const navigate = useNavigate();
  const location = useLocation();
  const patch = useSignupStore((state) => state.patch);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [answers, setAnswers] = useState(() => Array(QUESTIONS.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAllAnswered = useMemo(() => answers.every((v) => v !== null), [answers]);
  const isEditFlow = location.state?.mode === "edit";
  const returnPath =
    location.state?.from || (isEditFlow ? "/mypage/edit" : "/InfoInput");
  const sasangLabelMap = {
    TAEYANG: "태양인",
    SOYANG: "소양인",
    TAEUM: "태음인",
    SOEUM: "소음인",
  };

  const handleSelect = (qIndex, optIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!isAllAnswered || isSubmitting) return;

    if (!baseUrl) {
      console.warn("VITE_API_BASE_URL is not set.");
      return;
    }

    const payload = {
      answers: QUESTIONS.map((q, i) => ({
        questionId: q.id,
        answer: answers[i] + 1,
      })),
    };

    try {
      setIsSubmitting(true);
      const accessToken = localStorage.getItem("accessToken") || "";
      const tokenType = localStorage.getItem("tokenType") || "Bearer";

      const endpoint = isEditFlow
        ? `${baseUrl}/api/my-info/profile/sasang`
        : `${baseUrl}/api/onboarding/sasang/result`;
      const method = isEditFlow ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
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
        console.error("sasang result failed:", response.status, text);
        return;
      }

      const data = await response.json();
      const rawType =
        data?.sasangType ||
        data?.sasang ||
        data?.type ||
        data?.result?.sasangType ||
        data?.result?.sasang ||
        data?.result?.type;
      const message = data?.message || data?.result?.message || "";
      const normalizedType = sasangLabelMap[rawType] || rawType || "";

      if (normalizedType && !isEditFlow) {
        patch({ sasangResult: normalizedType });
      }

      navigate("/sasang-result", {
        state: {
          sasangResult: {
            type: normalizedType,
            message,
          },
          from: returnPath,
        },
      });
    } catch (e) {
      console.error("sasang result error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <header className="h-12 flex items-center px-4">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center font-extrabold">사상의학 테스트</h1>
        <div className="w-8" />
      </header>

      {/* 질문 */}
      <main className="flex-1 px-6 pt-8">
        {QUESTIONS.map((q, qIndex) => (
          <section key={q.id} className="mb-5">
            <p className="text-sm font-bold mb-2">{q.title}</p>

            <div className="flex flex-col gap-2">
              {q.options.map((opt, optIndex) => {
                const selected = answers[qIndex] === optIndex;

                return (
                  <label
                    key={`${q.id}-${optIndex}`}
                    className={[
                      "w-full min-h-[44px] py-3 px-4 rounded-xl border flex items-center justify-between",
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white",
                    ].join(" ")}
                  >
                    {/* radio input */}
                    <input
                      type="radio"
                      checked={selected}
                      onChange={() => handleSelect(qIndex, optIndex)}
                      className="sr-only"
                    />

                    {/* 텍스트 */}
                    <span className="text-sm text-left flex-1 leading-relaxed break-keep">{opt}</span>

                    {/* 체크 영역 */}
                    <span className="w-6 ml-2 flex items-center justify-center shrink-0">
                      {selected ? (
                      <span className="text-blue-500 font-extrabold">✓</span>
                    ) : (
                      <span className="w-4" />
                    )}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
        <div className="h-16" />
      </main>

      {/* 하단 버튼 */}
      <div className="px-6 pb-14">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isAllAnswered || isSubmitting}
          className={[
            "h-14 w-full rounded-2xl font-extrabold transition-colors",
            isAllAnswered && !isSubmitting
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-white cursor-not-allowed",
          ].join(" ")}
        >
          {isSubmitting ? "계산 중..." : "결과 보기"}
        </button>
      </div>
    </div>
  );
}

export default SasangTest;
