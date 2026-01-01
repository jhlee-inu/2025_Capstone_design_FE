function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

const PERSONA_LABEL = {
  rabbit: "토끼",
  bear: "곰",
  cat: "고양이",
  panda: "판다",
};

export default function PersonaButton({ value, onClick }) {
  const selected = !!value;

  return (
    <div>
      <div className="mt-6 mb-2 text-sm font-extrabold">
        페르소나
      </div>

      <button
        type="button"
        onClick={onClick}
        className={clsx(
          "h-12 w-full rounded-2xl border font-extrabold text-sm transition bg-white",
          selected
            ? "border-blue-500 text-blue-600"
            : "border-gray-200 text-gray-900"
        )}
      >
        {selected ? `페르소나 선택: ${PERSONA_LABEL[value]}` : "페르소나 선택"}
      </button>
    </div>
  );
}
