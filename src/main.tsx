import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router"

import App from "./App";
import Layout from "./layout";


import "./index.scss";
import "./main.scss"
createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<App />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
