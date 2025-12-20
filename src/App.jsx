import AppRouter from "./router/AppRouter";
import { LanguageProvider } from "./context/LanguageContext";
import { PersonaProvider } from "./context/PersonaContext";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[430px] mx-auto min-h-screen bg-white">
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
