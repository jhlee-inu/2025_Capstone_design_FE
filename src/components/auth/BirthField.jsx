import InputBox from "./InputBox";

export default function BirthField({
  value,
  setValue,
  active,
  onFocus,
  onBlur,
  valid,
}) {
  return (
    <div>
      <div className="mt-6 mb-2 text-sm font-extrabold">
        나이
      </div>
      <InputBox active={active || value} error={value && !valid}>
        <input
          value={value}
          onChange={(e) =>
            setValue(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="생년월일 6자리"
          inputMode="numeric"
          className="flex-1 outline-none bg-transparent text-sm font-semibold"
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-gray-400 text-xl"
          >
            ×
          </button>
        )}
      </InputBox>
    </div>
  );
}
