function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function GenderSelector({ value, onChange }) {
  return (
    <div>
      <div className="mt-6 mb-2 text-sm font-extrabold">성별</div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "M", label: "남" },
          { key: "F", label: "여" },
        ].map((g) => {
          const selected = value === g.key;

          return (
            <button
              key={g.key}
              type="button"
              onClick={() => onChange(g.key)}
              className={clsx(
                "h-12 rounded-2xl border text-sm font-extrabold transition bg-white",
                selected
                  ? "border-blue-500 text-blue-600"
                  : "border-gray-200 text-gray-700"
              )}
            >
              {g.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
