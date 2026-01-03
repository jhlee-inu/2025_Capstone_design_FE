import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import { BsChatLeftTextFill } from "react-icons/bs";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import AppLayout from "../layouts/AppLayout";

const chatHistory = [
  "11/10 채팅",
  "11/10 채팅",
  "11/10 채팅",
  "11/10 채팅",
];

function MyPageChat() {
  const navigate = useNavigate();

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
          <h1 className="text-lg font-bold">채팅 기록</h1>
        </header>
      }
    >
      <div className="min-h-full bg-gray-50 px-4 py-6 font-medium">
        <div className="rounded-2xl border border-orange-200 bg-white px-3 py-2 flex items-center gap-2">
          <FiSearch className="text-orange-400" />
          <input
            className="w-full text-sm outline-none placeholder:text-gray-400"
            placeholder="키워드 검색"
          />
        </div>

        <div className="mt-4 space-y-3">
          {chatHistory.map((item, index) => (
            <button
              key={`${item}-${index}`}
              type="button"
              className="w-full flex items-center justify-between rounded-2xl bg-orange-100 px-4 py-3 text-sm text-gray-900 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BsChatLeftTextFill className="text-orange-400" />
                <span>{item}</span>
              </div>
              <FiChevronRight className="text-gray-600" />
            </button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default MyPageChat;
