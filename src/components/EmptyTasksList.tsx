
import React from 'react';

const EmptyTasksList: React.FC = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>Nenhuma tarefa para hoje.</p>
      <p className="text-sm">Adicione tarefas para começar.</p>
    </div>
  );
};

export default EmptyTasksList;
