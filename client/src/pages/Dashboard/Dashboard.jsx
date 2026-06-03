import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";
import { TaskCard } from "../../components/TaskCard/TaskCard";

export default function Dashboard() {
  const { projects, toggleTaskCompletion } = useContext(ProjectContext);
  const { id } = useParams();

  const activeList = id 
    ? projects.find((p) => String(p.id) === String(id)) 
    : projects[0];

  if (!projects || projects.length === 0) {
    return <main className="conteudo">Carregando listas...</main>;
  }

  if (!activeList) {
    return <main className="conteudo">Selecione uma lista.</main>;
  }

  return (
    <main className="conteudo">
      <div className="cabecalho-projeto">
        <span className="bolinha" style={{ background: activeList.cor_hex }}></span>
        <h2>{activeList.titulo}</h2>
      </div>

      <form className="form-tarefa">
        <input type="text" placeholder="O que precisa ser feito?" />
        <button type="submit">Adicionar</button>
      </form>

      <ul className="tarefas">
        {activeList.tarefas?.map((tarefa) => (
          <TaskCard 
            key={tarefa.id} 
            tarefa={tarefa}
            onToggle={() => toggleTaskCompletion(activeList.id, tarefa.id)}
          />
        ))}
      </ul>
    </main>
  );
}