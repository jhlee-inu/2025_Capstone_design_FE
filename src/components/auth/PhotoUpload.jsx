import { useEffect, useMemo } from "react";

export default function PhotoUpload({
  photoFile,
  setPhotoFile,
  skipPhoto,
  setSkipPhoto,
}) {
  const previewUrl = useMemo(() => {
    if (!photoFile) return null;
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div>
      <div className="mt-6 mb-3 text-sm font-extrabold">프로필 사진 등록</div>

      {/* 버튼 위 미리보기 영역 */}
      <div className="w-full rounded-3xl border-gray-100 p-6 mb-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 grid place-items-center">
            {previewUrl && !skipPhoto ? (
              <img
                src={previewUrl}
                alt="프로필 미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              // 유저 아이콘(placeholder)
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 text-gray-500"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.2 0-7.5 2.1-7.5 4.125V21h15v-2.625c0-2.025-3.3-4.125-7.5-4.125Z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-3">
        <label
          className="flex-1 h-12 rounded-2xl border border-gray-200
                     grid place-items-center font-extrabold text-sm
                     text-gray-700 cursor-pointer active:scale-[0.99] transition"
        >
          사진 추가
          <input
            type="file"
            accept="image/*"
            capture="user"
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
            "font-extrabold text-sm transition active:scale-[0.99]",
            skipPhoto
              ? "border-blue-500 text-blue-600"
              : "border-gray-200 text-gray-700 bg-white",
          ].join(" ")}
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}
