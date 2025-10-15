// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "./App";
import "./main.css";

const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

// Initial render:
root.render(<App />);
