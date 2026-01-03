import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera } from "react-icons/fi";
import { usePersona } from "../context/PersonaContext";
import AppLayout from "../layouts/AppLayout";
import bearAvatar from "../assets/persona/bear scarf.png";
import catAvatar from "../assets/persona/cat camera.png";
import pandaAvatar from "../assets/persona/panda map.png";
import rabbitAvatar from "../assets/persona/rabbit bag.png";

const personaImages = {
  bear: bearAvatar,
  cat: catAvatar,
  panda: pandaAvatar,
  rabbit: rabbitAvatar,
};

function MyPageEdit() {
  const navigate = useNavigate();
  const { persona } = usePersona();
  const avatarSrc = personaImages[persona] || personaImages.bear;

  return (
    <AppLayout
      header={
        <header className="relative h-14 flex items-center justify-center border-b bg-white z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <IoIosArrowBack size={28} />
          </button>
          <h1 className="text-lg font-bold">내 정보 수정</h1>
        </header>
      }
    >
      <div className="min-h-full bg-gray-50 px-4 py-6 font-medium">
        <section className="rounded-3xl bg-white px-6 py-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="h-20 w-20 object-contain"
                />
              </div>
              <button
                type="button"
                className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow text-orange-500"
                aria-label="edit profile photo"
              >
                <FiCamera size={16} />
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500">
                닉네임
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
                placeholder="사용자1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">나이</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
                placeholder="111111"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">MBTI</label>
              <input
                className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-300"
                placeholder="ISFP"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500">
                사상체질
              </label>
              <button
                type="button"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                사상의학 테스트
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default MyPageEdit;
