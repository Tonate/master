import "./App.css";
import "@twa-dev/sdk";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { TonatePage } from "@/pages/TonatePage";
import { SendTonPage } from "@/pages/SendTonPage";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TonatePage />}></Route>
          <Route path="/send" element={<SendTonPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
