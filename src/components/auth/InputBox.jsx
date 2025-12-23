function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function InputBox({ active, error, children }) {
  return (
    <div
      className={clsx(
        "h-12 w-full rounded-2xl px-4 flex items-center border transition bg-white",
        active ? "border-blue-500" : "border-gray-200",
        error && "border-red-500"
      )}
    >
      {children}
    </div>
  );
}
