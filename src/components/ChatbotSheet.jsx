function ChatbotSheet({ onClose }) {
  return (
    <div className="absolute inset-0 bg-white z-30 flex flex-col">
      <div className="h-12 flex items-center justify-center border-b">
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      <div className="flex-1 p-4 text-sm text-gray-700">
        인천의 궁금한 곳에 대해 물어봐!
        <br />
        태양인 타입에 맞는 여행코스도 만들어 줄 수 있어!
      </div>

      <div className="p-4 border-t">
        <input
          className="w-full px-4 py-2 rounded-full bg-orange-100 text-sm"
          placeholder="인천에 대해 물어보세요."
        />
      </div>

      <button
        className="absolute top-4 right-4"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
}

export default ChatbotSheet;
