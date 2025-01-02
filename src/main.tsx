import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.scss";
import "./main.scss"
createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div className="container">
      <div className="menu">
        menu
      </div>
      <div className="content">
        
    <App />
    </div>
    </div>
  </StrictMode>
);
