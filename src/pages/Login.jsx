import sasang from "../assets/sasang.png";
import kakaoIcon from "../assets/kakao.png";
import googleIcon from "../assets/google.png";
import { MdLanguage } from "react-icons/md";
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const TEXT = {
  KOR: {
    title: "Incheon Mate",
    subtitle: "나의 여행메이트와\n함께하는 인천여행",
    kakao: "카카오로 시작하기",
    google: "구글로 시작하기",
  },
  ENG: {
    title: "Incheon Mate",
    subtitle: "Travel In Incheon\nWith Your Travel Mate",
    kakao: "Start with Kakao",
    google: "Start with Google",
  },
};


function Login() {
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
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
            <div className="absolute right-0 mt-2 w-20 rounded-xl border bg-white shadow-md">
              {["KOR", "ENG"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setLangOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-xl last:rounded-b-xl"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 본문 */}
      <main className="px-6 flex-1">
        {/* 제목 */}
        <section className="pt-20 text-center">
          <h2 className="text-4xl font-extrabold">{TEXT[language].title}</h2>
          <p className="mt-4 text-lg font-semibold leading-snug whitespace-pre-line">
            {TEXT[language].subtitle}
          </p>
        </section>

        <section className="mt-14 flex justify-center">
          <img src={sasang} alt="avatar" className="h-41 w-41 object-contain" />
        </section>

        {/* 로그인 버튼 */}
        <div className="mt-16 flex flex-col gap-3 pb-10">
          {/* Kakao */}
          <button
            type="button"
            className="h-12 w-full rounded-2xl bg-[#FEE500]
                   flex items-center justify-center gap-2
                   font-extrabold active:scale-[0.99]"
          >
            <img src={kakaoIcon} alt="Kakao" className="h-4 w-4" />
            {TEXT[language].kakao}
          </button>

          {/* Google */}
          <button
            type="button"
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white
                   flex items-center justify-center gap-2
                   font-extrabold active:scale-[0.99]"
          >
            <img src={googleIcon} alt="Google" className="h-4 w-4" />
            {TEXT[language].google}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Login;
