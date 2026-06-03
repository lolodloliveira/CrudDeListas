import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import { Router } from "./routes/Router";

import { ProjectProvider } from "./context/ProjectContext";
import { TaskProvider } from "./context/TaskContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProjectProvider>
      <TaskProvider>
        <Router /> 
      </TaskProvider>
    </ProjectProvider>
  </React.StrictMode>
);