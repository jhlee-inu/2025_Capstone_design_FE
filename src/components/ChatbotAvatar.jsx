import { useState } from "react";
import ChatbotSheet from "./ChatbotSheet";
import { usePersona } from "../context/PersonaContext";

function ChatbotAvatar() {
  const [open, setOpen] = useState(false);
  const { persona } = usePersona();

  const personaImages = {
    bear: "/src/assets/bear.png",
    cat: "/src/assets/cat.png",
    panda: "/src/assets/panda.png",
    rabbit: "/src/assets/rabbit.png",
    sasang: "/src/assets/sasang.png",
  };

  const avatarSrc = personaImages[persona] || "/src/assets/bear.png";

  return (
    <>
      {/* 캐릭터 */}
      <div
        className="absolute bottom-5 left-4 z-20 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <img src={avatarSrc} alt="Persona avatar" className="w-28 h-55" />
      </div>

      {/* 챗봇 */}
      {open && <ChatbotSheet onClose={() => setOpen(false)} />}
    </>
  );
}

export default ChatbotAvatar;
