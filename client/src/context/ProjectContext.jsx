import { createContext, useEffect, useState } from "react";
import { getLists, toggleTask } from "../services/api";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);

  async function loadProjects() {
    try {
      const data = await getLists();
      setProjects(data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  async function toggleTaskCompletion(listaId, tarefaId) {
    try {
      await toggleTask(listaId, tarefaId);
      await loadProjects(); 
    } catch (error) {
      console.error("Erro ao alternar status da tarefa:", error);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, loadProjects, toggleTaskCompletion }}>
      {children}
    </ProjectContext.Provider>
  );
}