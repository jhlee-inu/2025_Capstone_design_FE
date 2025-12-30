import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const QUESTIONS = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: `질문${i + 1}`,
  options: ["선택1", "선택2", "선택3", "선택4"],
}));

function SasangTest() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState(() =>
    Array(QUESTIONS.length).fill(null)
  );

  const isAllAnswered = useMemo(
    () => answers.every((v) => v !== null),
    [answers]
  );

  const handleSelect = (qIndex, optIndex) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!isAllAnswered) return;

    const payload = QUESTIONS.map((q, i) => ({
      questionId: q.id,
      title: q.title,
      selectedIndex: answers[i],
      selectedText: q.options[answers[i]],
    }));

    navigate("/sasang-result", { state: { sasangResult: payload } });
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
        <h1 className="flex-1 text-center font-extrabold">사상의학 테스트</h1>
        <div className="w-8" />
      </header>

      {/* 질문 리스트 */}
      <main className="flex-1 px-6 pt-8">
        {QUESTIONS.map((q, qIndex) => (
          <section key={q.id} className="mb-5">
            <p className="text-sm font-bold mb-2">{q.title}</p>

            <div className="flex flex-col gap-2">
              {q.options.map((opt, optIndex) => {
                const selected = answers[qIndex] === optIndex;

                return (
                  <button
                    key={`${q.id}-${optIndex}`}
                    type="button"
                    onClick={() => handleSelect(qIndex, optIndex)}
                    className={[
                      "h-11 px-4 rounded-xl border flex items-center justify-between",
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white",
                    ].join(" ")}
                  >
                    <span className="text-sm">{opt}</span>
                    {selected ? (
                      <span className="text-blue-500 font-extrabold">✓</span>
                    ) : (
                      <span className="w-4" />
                    )}
                  </button>
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
          disabled={!isAllAnswered}
          className={[
            "h-14 w-full rounded-2xl font-extrabold transition-colors",
            isAllAnswered
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-white cursor-not-allowed",
          ].join(" ")}
        >
          결과 보기
        </button>
      </div>
    </div>
  );
}

export default SasangTest;
