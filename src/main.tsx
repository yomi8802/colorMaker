import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AppStateProvider } from "./AppStateContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>
);
