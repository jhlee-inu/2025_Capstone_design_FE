import Label from "./Label";

export default function PhotoUpload({
  photoFile,
  setPhotoFile,
  skipPhoto,
  setSkipPhoto,
}) {
  return (
    <div>
      <Label>프로필 사진 등록</Label>

      <div className="flex gap-3">
        <label
          className="flex-1 h-12 rounded-2xl border border-gray-200
                     grid place-items-center font-extrabold text-sm
                     text-gray-700 cursor-pointer"
        >
          사진 촬영
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPhotoFile(file);
                setSkipPhoto(false);
              }
            }}
          />
        </label>

        <button
          type="button"
          onClick={() => {
            setPhotoFile(null);
            setSkipPhoto(true);
          }}
          className={[
            "flex-1 h-12 rounded-2xl border grid place-items-center",
            "font-extrabold text-sm transition",
            skipPhoto
              ? "border-blue-500 text-blue-600"
              : "border-gray-200 text-gray-400",
          ].join(" ")}
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
