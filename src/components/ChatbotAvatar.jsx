import { useState } from "react";
import ChatbotSheet from "./ChatbotSheet";
import { usePersona } from "../context/PersonaContext";

function ChatbotAvatar({ onOpen, showBubble = false, bubbleText = "" }) {
  const [open, setOpen] = useState(false);
  const { persona } = usePersona();

  const personaImages = {
    bear: "/src/assets/persona/bear scarf.png",
    cat: "/src/assets/persona/cat camera.png",
    panda: "/src/assets/persona/panda map.png",
    rabbit: "/src/assets/persona/rabbit bag.png",
  };

  const avatarSrc = personaImages[persona] || "/src/assets/rabbit.png";
  const handleOpen = () => {
    if (onOpen) {
      onOpen();
      return;
    }
    setOpen(true);
  };
  return (
    <>
      {/* 캐릭터 */}
      <div className="absolute bottom-5 left-4 z-20">
        {showBubble && bubbleText && (
          <div className="absolute left-20 bottom-16 pointer-events-none">
            <div className="relative w-max max-w-[70vw] sm:max-w-xs rounded-2xl bg-amber-100 px-4 py-3 text-sm font-medium text-gray-900 shadow break-keep whitespace-normal">
              <span className="absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-amber-100" />
              {bubbleText}
            </div>
          </div>
        )}
        <div className="cursor-pointer" onClick={handleOpen}>
          <img
            src={avatarSrc}
            alt="Persona avatar"
            className="w-20 h-32 object-contain"
          />
        </div>
      </div>

      {/* 챗봇 */}
      {open && !onOpen && <ChatbotSheet onClose={() => setOpen(false)} />}
    </>
  );
}

export default ChatbotAvatar;

