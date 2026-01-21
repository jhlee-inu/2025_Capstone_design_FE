import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSignupStore from "../stores/useSignupStore";
import { FaArrowLeft } from "react-icons/fa6";

const QUESTIONS = [
  // 1~4: 외모와 체형
  {
    id: 1,
    category: "외모와 체형",
    title: "1. 당신의 체격은 ?",
    options: [
      "허리와 배가 발달되고 상체가 약한 편이다.",
      "상체보다 하체가 발달되어 있다.",
      "가슴이 발달되고 허리 밑부분이 빈약한 편이다.",
      "머리와 목덜미가 발달되고 허리 부분이 약하다.",
    ],
  },
  {
    id: 2,
    category: "외모와 체형",
    title: "2. 당신의 얼굴은 다음 중 어디에 가까운가?",
    options: [
      "얼굴의 윤곽이 뚜렷하고 의젓하다.",
      "얼굴의 윤곽이 갸름하고 둥글다.",
      "얼굴이 다소 길고 머리가 앞뒤로 나와 있다.",
      "머리가 크고 정수리가 솟아 있다.",
    ],
  },
  {
    id: 3,
    category: "외모와 체형",
    title: "3. 당신의 얼굴은 다음 중 어디에 해당하는가?",
    options: [
      "이목구비가 크고 입술이 두껍다.",
      "눈, 코, 입이 대체로 작고 섬세한 편이다.",
      "입이 크지 않고 턱이 뾰족한 편이다.",
      "이마가 넓고 광대뼈가 나와 있다.",
    ],
  },
  {
    id: 4,
    category: "외모와 체형",
    title: "4. 당신의 눈빛은 다음 중 어디에 가장 가깝나?",
    options: [
      "눈빛이 맑지 않고 침침하다.",
      "눈빛이 순하고 눈웃음을 잘 짓는다.",
      "눈빛이 반사적이고 예리하다.",
      "눈에서 빛이 난다.",
    ],
  },

  // 5~6: 신체 반응
  {
    id: 5,
    category: "신체 반응",
    title: "5. 당신은 다음 중 어디에 해당되는가?",
    options: [
      "평소에 땀이 많고 땀을 흘리면 오히려 상쾌해진다.",
      "평소에 땀이 많지 않고 조금만 땀을 내도 피곤하다.",
      "땀이 특별히 많은 편이 아니며 땀을 흘려도 그다지 피곤하지 않다.",
      "땀이 많은 편이며 조금만 땀을 내도 피곤하다.",
    ],
  },
  {
    id: 6,
    category: "신체 반응",
    title: "6. 당신의 손과 발은?",
    options: [
      "손발이 따뜻하나 겨울에 잘 튼다.",
      "손발이 차고 겨울에 잘 트지 않는다.",
      "손발이 따뜻한 편이다.",
      "손발이 무척 따뜻한 편이다.",
    ],
  },

  // 7~9: 성격
  {
    id: 7,
    category: "성격",
    title: "7. 말을 할 때 평소 습관은 ?",
    options: [
      "말수가 적고 이따금 더듬는다.",
      "말이 많지 않으나 가까운 사이는 말을 많이 하는 편이다.",
      "말이 많고 함부로 막하는 편이다.",
      "수다스럽지는 않지만 누구한테 건 거리낌 없이 말을 한다.",
    ],
  },
  {
    id: 8,
    category: "성격",
    title: "8. 나의 성격 중 장점이라고 생각하는 것은?",
    options: [
      "매사에 신중하고 예의가 바르며, 끈기와 인내심이 강해 믿음직하다.",
      "침착하고 꼼꼼한 성격이며, 생각이 깊고 판단이 빠르다.",
      "활동적이고 열정적이며, 솔직하고 인정이 많아 봉사 정신이 강하다.",
      "적극적이고 결단력이 있으며, 시원시원한 성격으로 누구와도 잘 어울린다.",
    ],
  },
  {
    id: 9,
    category: "성격",
    title: "9. 나의 성격 중 단점이라고 생각하는 것은?",
    options: [
      "변화를 싫어하고 보수적이며, 활동하는 것보다 편하게 쉬는 것을 좋아한다.",
      "낯을 가리고 내성적이며, 한번 마음이 상하면 쉽게 풀리지 않고 오래간다.",
      "성격이 급해 실수가 잦고, 싫증을 잘 느껴 시작에 비해 마무리가 부족하다.",
      "계획 없이 일을 벌이는 편이고, 뜻대로 안 되면 화를 잘 내며 세심함이 부족하다.",
    ],
  },

  // 10~13: 음식
  {
    id: 10,
    category: "음식",
    title: "10. 다음 중 본인이 좋아하는 음식이 가장 많이 포함된 항목은?",
    options: [
      "밀가루 음식(빵/면), 콩, 고구마, 땅콩, 설탕, 소고기, 우유, 버터, 치즈, 장어, 당근, 버섯, 미역, 김.",
      "감자, 닭고기, 꿀, 흰살 생선, 시금치, 양배추, 파, 카레, 후추, 마늘.",
      "보리, 돼지고기, 계란, 오리고기, 굴, 새우, 게, 랍스터, 배추, 오이, 상추, 호박, 가지, 맥주, 아이스크림.",
      "메밀, 새우, 게, 조개류(굴, 전복 등), 해산물 위주의 식단.",
    ],
  },
  {
    id: 11,
    category: "음식",
    title: "11. 다음 중 본인이 좋아하는 과일이 가장 많이 포함된 항목은?",
    options: [
      "밤, 호두, 배, 자두, 살구.",
      "사과, 귤(오렌지), 토마토, 복숭아.",
      "수박, 멜론, 딸기, 바나나, 파인애플.",
      "포도, 감, 체리.",
    ],
  },
  {
    id: 12,
    category: "음식",
    title: "12. 본인에게 맞지 않거나 불편함을 주는 음식이 있는 항목은?",
    options: [
      "닭고기, 달걀, 돼지고기, 사과, 커피, 인삼, 꿀, 생강.",
      "냉면, 맥주, 아이스크림, 멜론, 수박, 찬 우유, 돼지고기, 오징어, 밀가루 음식.",
      "맵고 짠 음식, 닭고기, 꿀, 인삼, 땅콩.",
      "맵고 짠 음식, 뜨거운 음식, 기름진 음식, 무, 설탕, 소고기.",
    ],
  },
  {
    id: 13,
    category: "음식",
    title: "13. 음식물에 대한 당신의 기호는?",
    options: [
      "뜨거운 음식을 좋아한다.",
      "더운 음식을 좋아한다.",
      "찬 음식을 좋아한다.",
      "시원한 음식을 좋아한다.",
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
