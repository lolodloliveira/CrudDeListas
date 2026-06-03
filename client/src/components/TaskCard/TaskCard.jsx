export function TaskCard({ tarefa, onToggle }) {
  return (
    <li className={`item-tarefa ${tarefa.status === 'concluida' ? 'concluida' : ''}`}>
      <input 
        type="checkbox" 
        checked={tarefa.status === 'concluida'} 
        onChange={() => onToggle(tarefa.id)} // Dispara a alteração
      />
      
      <div className="corpo-tarefa">
        <span className="descricao">{tarefa.descricao}</span>
        
        <div className="meta-info">
          {tarefa.etiqueta && (
            <span className="etiqueta">{tarefa.etiqueta}</span>
          )}
          {tarefa.checklist?.length > 0 && (
            <span className="checklist">
              {tarefa.checklist.filter(c => c.concluido).length}/{tarefa.checklist.length}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}