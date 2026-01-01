function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function CompanionSelector({
  value,
  setValue,
  options = ["혼자", "가족", "연인", "친구"],
}) {
  return (
    <div>
      <div className="mt-6 mb-2 text-sm font-extrabold">
        동반자
      </div>
      <div className="flex gap-2">
        {options.map((c) => {
          const selected = value === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setValue(c)}
              className={clsx(
                "flex-1 h-12 rounded-2xl border text-sm font-extrabold transition bg-white",
                selected
                  ? "border-blue-500 text-blue-600"
                  : "border-gray-200 text-gray-700"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
