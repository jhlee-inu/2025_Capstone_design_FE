import { useState } from "react";
import ChatbotSheet from "./ChatbotSheet";
import bear from "../assets/bear.png";
function ChatbotAvatar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 캐릭터 */}
      <div
        className="absolute bottom-5 left-4 z-20 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <img src={bear} alt="bear avatar" className="w-28 h-55 " />
      </div>

      {/* 챗봇 */}
      {open && <ChatbotSheet onClose={() => setOpen(false)} />}
    </>
  );
}

export default ChatbotAvatar;
