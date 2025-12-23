import React from "react";
import Label from "./Label";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function PersonaButton({ value, onClick }) {
  const selected = !!value;

  return (
    <div>
      <Label>페르소나</Label>

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
        {selected ? `페르소나 선택: ${value}` : "페르소나 선택"}
      </button>
    </div>
  );
}
