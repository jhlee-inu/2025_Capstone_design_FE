import Label from "./Label";
import InputBox from "./InputBox";

export default function MbtiField({
  value,
  setValue,
  active,
  onFocus,
  onBlur,
  valid,
}) {
  return (
    <div>
      <Label>MBTI</Label>
      <InputBox active={active || value} error={value && !valid}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 4))}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="MBTI 4글자"
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
