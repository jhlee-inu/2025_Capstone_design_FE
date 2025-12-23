import React from "react";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

/**
 * variant:
 * - "primary": 파란 배경
 * - "outline": 테두리
 * - "disabled": 비활성(회색)
 */
export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  variant = "outline",
}) {
  const base = "rounded-2xl font-extrabold transition";
  const styles = {
    primary: "bg-blue-600 text-white",
    outline: "border border-gray-200 bg-white text-gray-900",
    disabled: "bg-gray-300 text-white cursor-not-allowed",
  };

  const v = disabled ? "disabled" : variant;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, styles[v], className)}
    >
      {children}
    </button>
  );
}
