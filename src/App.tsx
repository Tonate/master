import "./App.css";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { TonatePage } from "./components/TonatePage";
import "@twa-dev/sdk";

function App() {
  return (
    <div className="app">
      <TonatePage></TonatePage>
    </div>
  );
}

export default App;
