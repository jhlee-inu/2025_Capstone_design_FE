import sasang from "../assets/sasang.png";
import kakaoIcon from "../assets/kakao.png";
import googleIcon from "../assets/google.png";
import { useLanguage } from "../context/LanguageContext";
//import { useNavigate } from "react-router-dom";
import LoginHeader from "../components/auth/LoginHeader";

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

const baseUrl = import.meta.env.VITE_API_BASE_URL;
function Login() {
  const { language } = useLanguage();
  // const navigate = useNavigate();

  // const handleKakao = () => navigate("/agree");
  // const handleGoogle = () => navigate("/agree");
  const handleKakao = () => {
    const redirectUri = `${baseUrl}/oauth/callback/kakao`;
    if (window.Kakao?.Auth && window.Kakao.isInitialized()) {
      window.Kakao.Auth.authorize({ redirectUri });
      return;
    }

    window.location.href = `${baseUrl}/oauth2/authorization/kakao`;
  };

  const handleGoogle = () => {
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 */}
      <LoginHeader />

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
            onClick={handleKakao}
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
            onClick={handleGoogle}
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
