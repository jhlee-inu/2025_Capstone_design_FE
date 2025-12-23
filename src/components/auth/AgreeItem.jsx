function AgreeItem({ checked, onChange, required, label }) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 accent-blue-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm font-medium text-gray-900">
        <span className="font-bold">
          [{required ? "필수" : "선택"}]
        </span>{" "}
        {label}
      </span>
    </label>
  );
}

export default AgreeItem;
