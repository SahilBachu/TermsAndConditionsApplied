// App root - sets up routing and wraps everything in the PolicyProvider
// Three pages: Input (landing), Result (analysis output), Chat (AI Q&A)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PolicyProvider } from "./context/PolicyContext";
import InputPage from "./pages/InputPage";
import ResultPage from "./pages/ResultPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <PolicyProvider>
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </PolicyProvider>
    </BrowserRouter>
  );
}

export default App;
