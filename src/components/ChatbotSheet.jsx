import { motion } from "framer-motion";
import { usePersona } from "../context/PersonaContext";

function ChatbotSheet({ onClose }) {
  const { persona } = usePersona();

  const chatpersonaImages = {
    bear: "/src/assets/chat bear.png",
    cat: "/src/assets/chat cat.png",
    panda: "/src/assets/chat panda.png",
    rabbit: "/src/assets/chat rabbit.png",
  };

  const avatarSrc = chatpersonaImages[persona] || "/src/assets/bear.png";
  return (
    // 배경
    <motion.div
      className="fixed inset-0 z-30 bg-black/30"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 시트 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 max-w-[430px] mx-auto
                   bg-white rounded-t-2xl
                   flex flex-col"
        style={{ height: "93%" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 300 }}
        dragElastic={0.2}
        onDragEnd={(e, info) => {
          if (info.offset.y > 120) {
            onClose(); // 아래로 충분히 끌면 닫힘
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div className="h-12 flex items-center justify-center border-b">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* 본문 */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* 챗봇 메시지 */}
          <div className="flex items-start space-x-2 mb-4">
            <img
              src="/src/assets/chat bear.png"
              alt="Persona"
              className="w-10 h-10 object-contain"
            />
            <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 max-w-xs">
              인천의 궁금한 곳에 대해 물어봐!
            </div>
          </div>
          <div className="flex items-start space-x-2 mb-4">
            <img
              src="/src/assets/chat bear.png"
              alt="Persona"
              className="w-10 h-10 object-contain"
            />
            <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 max-w-xs">
              태양인 타입에 맞는 여행코스도 만들어 줄 수 있어!
            </div>
          </div>
          {/* 사용자 메시지 */}
          <div className="flex items-start space-x-2 mb-4 justify-end">
            <div className="bg-blue-100 p-3 rounded-lg text-sm text-gray-700 max-w-xs">
              인천 맛집 추천해줘!
            </div>
            {/* <img src="/src/assets/react.svg" alt="User" className="w-8 h-8 rounded-full" /> */}
          </div>
        </div>

        {/* 입력창 */}
        <div className="p-4 border-t">
          <input
            className="w-full px-4 py-2 rounded-full bg-orange-100 text-sm outline-none"
            placeholder="인천에 대해 물어보세요."
          />
        </div>

        {/* 닫기 버튼 */}
      </motion.div>
    </motion.div>
  );
}

export default ChatbotSheet;
