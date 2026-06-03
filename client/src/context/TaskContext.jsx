import {
  createContext,
  useState,
} from "react";

import {
  getLists,
  createTask,
  updateTask as apiUpdateTask,
  toggleTask as apiToggleTask,
  deleteTask,
} from "../services/api";

export const TaskContext =
  createContext();

export function TaskProvider({
  children,
}) {
  const [tasks, setTasks] =
    useState([]);

  async function loadTasks(
    listaId
  ) {
    try {
      const listas =
        await getLists();

      const lista =
        listas.find(
          (item) =>
            item.id === listaId
        );

      setTasks(
        lista?.tarefas || []
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function addTask(
    listaId,
    task
  ) {
    try {
      const novaTask =
        await createTask(
          listaId,
          task
        );

      setTasks((prev) => [
        ...prev,
        novaTask,
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleTask(
    listaId,
    tarefaId
  ) {
    try {
      const updated =
        await apiToggleTask(
          listaId,
          tarefaId
        );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === tarefaId
            ? updated
            : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function removeTask(
    listaId,
    tarefaId
  ) {
    try {
      await deleteTask(
        listaId,
        tarefaId
      );

      setTasks((prev) =>
        prev.filter(
          (task) =>
            task.id !== tarefaId
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function updateTask(
    listaId,
    tarefaId,
    data
  ) {
    try {
      const updated =
        await apiUpdateTask(
          listaId,
          tarefaId,
          data
        );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === tarefaId
            ? updated
            : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadTasks,
        addTask,
        toggleTask,
        removeTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}