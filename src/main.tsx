import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router"
import Layout from "~/layouts/default";
import Old from "~/pages/Old";
import Home from "~pages/Home";

import "./index.scss";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />}></Route>
          <Route path="/old" element={<Old />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
