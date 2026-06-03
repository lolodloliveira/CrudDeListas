import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

/* LISTAS */

export const getLists = async () => {
  const { data } = await api.get("/listas");
  return data;
};

export const createList = async (body) => {
  const { data } = await api.post(
    "/listas",
    body
  );

  return data;
};

export const updateList = async (
  id,
  body
) => {
  const { data } = await api.put(
    `/listas/${id}`,
    body
  );

  return data;
};

export const deleteList = async (
  id
) => {
  await api.delete(
    `/listas/${id}`
  );
};

/* TAREFAS */

export const createTask = async (
  listaId,
  body
) => {
  const { data } = await api.post(
    `/listas/${listaId}/tarefas`,
    body
  );

  return data;
};

export const updateTask = async (
  listaId,
  tarefaId,
  body
) => {
  const { data } = await api.put(
    `/listas/${listaId}/tarefas/${tarefaId}`,
    body
  );

  return data;
};

export const toggleTask = async (
  listaId,
  tarefaId
) => {
  const { data } =
    await api.patch(
      `/listas/${listaId}/tarefas/${tarefaId}/status`
    );

  return data;
};

export const deleteTask = async (
  listaId,
  tarefaId
) => {
  await api.delete(
    `/listas/${listaId}/tarefas/${tarefaId}`
  );
};

/* CHECKLIST */

export const createChecklistItem =
  async (
    listaId,
    tarefaId,
    body
  ) => {
    const { data } =
      await api.post(
        `/listas/${listaId}/tarefas/${tarefaId}/checklist`,
        body
      );

    return data;
  };

export const toggleChecklistItem =
  async (
    listaId,
    tarefaId,
    itemId
  ) => {
    const { data } =
      await api.patch(
        `/listas/${listaId}/tarefas/${tarefaId}/checklist/${itemId}`
      );

    return data;
  };

export const deleteChecklistItem =
  async (
    listaId,
    tarefaId,
    itemId
  ) => {
    await api.delete(
      `/listas/${listaId}/tarefas/${tarefaId}/checklist/${itemId}`
    );
  };

export default api;