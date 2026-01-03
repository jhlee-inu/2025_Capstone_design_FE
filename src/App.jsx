import AppRouter from "./router/AppRouter";
import { LanguageProvider } from "./context/LanguageContext";
import { PersonaProvider } from "./context/PersonaContext";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    return () => {
      window.removeEventListener("resize", setAppHeight);
    };
  }, []);
  return (
    <div
      className="bg-gray-100"
      style={{ minHeight: "var(--app-height, 100vh)" }}
    >
      <div
        className="max-w-[430px] mx-auto bg-white"
        style={{ minHeight: "var(--app-height, 100vh)" }}
      >
        <LanguageProvider>
          <PersonaProvider>
            <AppRouter />
          </PersonaProvider>
        </LanguageProvider>
      </div>
    </div>
  );
}

export default App;
