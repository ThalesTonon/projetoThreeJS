import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MuseumApp from "./MuseuApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MuseumApp />
  </StrictMode>
);
