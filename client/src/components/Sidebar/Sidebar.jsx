import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ProjectContext } from '../../context/ProjectContext';

export function Sidebar() {
  const { projects } = useContext(ProjectContext);

  return (
    <aside className="sidebar">
      <div className="logo" style={{ fontWeight: 'bold' }}>Minhas Listas</div>
      <input className="busca" placeholder="Buscar tarefas..." />
      
      <ul className="listas">
        {projects.map((project) => (
          <li key={project.id}>
            <NavLink 
              to={`/lista/${project.id}`} 
              className={({ isActive }) => isActive ? "item-lista ativa" : "item-lista"}
            >
              {/* Bolinha com a cor do projeto vinda do contexto */}
              <span className="bolinha" style={{ background: project.cor_hex || '#4F86C6' }}></span>
              <span className="nome">{project.titulo}</span>
              <span className="contador">{project.tarefas?.length || 0}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Formulário de Nova Lista com o botão estilizado */}
      <form className="form-lista">
        <input type="text" placeholder="Nova lista..." />
        <button type="submit">+</button>
      </form>
    </aside>
  );
}