import Label from "./Label";
import InputBox from "./InputBox";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

export default function NicknameField({
  value,
  onChange,
  active,
  onFocus,
  onBlur,
  checked,
  available,
  canCheck,
  onCheck,
}) {
  const error = checked && available === false;

  return (
    <div>
      <Label>닉네임</Label>

      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <InputBox active={active || value.length > 0} error={error}>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="사용자"
              className="flex-1 outline-none bg-transparent text-sm font-semibold"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="ml-2 text-gray-400 text-xl"
              >
                ×
              </button>
            )}
          </InputBox>

          <div className="mt-1 min-h-[16px]">
            {checked && available === false && (
              <p className="text-xs font-semibold text-red-500">
                사용할 수 없는 아이디입니다.
              </p>
            )}
            {checked && available === true && (
              <p className="text-xs font-semibold text-blue-600">
                사용할 수 있는 아이디입니다.
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={!canCheck}
          onClick={onCheck}
          className={clsx(
            "h-12 px-4 rounded-2xl border text-sm font-extrabold",
            canCheck
              ? "border-blue-500 text-blue-600"
              : "border-gray-200 text-gray-400"
          )}
        >
          중복확인
        </button>
      </div>
    </div>
  );
}
