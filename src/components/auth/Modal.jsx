import React from "react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl font-bold text-gray-500"
            aria-label="close"
          >
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
