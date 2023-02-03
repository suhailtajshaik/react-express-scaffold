import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <div>Hello World!</div>;
};

const root = document.getElementById("root");
createRoot(root).render(<App />);
