import React from "react";
import Label from "./Label";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function SasangTestButton({ value, onClick }) {
  const selected = !!value;

  return (
    <div>
      <Label>사상의학</Label>

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
        {selected ? `사상의학 테스트: ${value}` : "사상의학 테스트"}
      </button>
    </div>
  );
}
