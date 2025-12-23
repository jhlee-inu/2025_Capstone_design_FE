import { useState } from "react";
import { MdLanguage } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";

function LoginHeader() {
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <header className="h-14 flex items-center justify-between px-4 pt-3 border-b bg-white relative">
      <h1 className="text-lg font-bold">Incheon Mate</h1>

      <div className="relative">
        <button
          onClick={() => setLangOpen((prev) => !prev)}
          className="flex items-center gap-1 text-sm font-semibold"
        >
          <MdLanguage size={22} />
          {language}
        </button>

        {langOpen && (
          <div className="absolute right-0 mt-2 w-20 rounded-xl border bg-white shadow-md z-10">
            {["KOR", "ENG"].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setLangOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100
                           first:rounded-t-xl last:rounded-b-xl"
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default LoginHeader;
