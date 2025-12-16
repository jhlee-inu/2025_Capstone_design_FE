import AppRouter from "./router/AppRouter";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[430px] mx-auto min-h-screen bg-white">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
