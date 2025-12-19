import AppRouter from "./router/AppRouter";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[430px] mx-auto min-h-screen bg-white">
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </div>
    </div>
  );
}

export default App;
