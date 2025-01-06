import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppWrapper from "~app-wrapper";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
