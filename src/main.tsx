import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {  } from "react-router-dom";

import "./index.scss";
import "./main.scss"
createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <div className="container">
      <div className="menu">
        <img src="/logotype.webp"></img>
      </div>
      <div className="content">
        <Switch>
          
        </Switch>
        
    <App />
    </div>
    </div>
  </StrictMode>
);
