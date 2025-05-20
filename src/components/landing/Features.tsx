
import React from 'react';

const Features = () => {
  const features = [
    "Prioridade visual de tarefas",
    "Reorganização automática das atividades não finalizadas",
    "Emojis interativos que celebram seu progresso",
    "Sugestões inteligentes de tempo baseadas em seu histórico",
    "Modo minimalista para evitar distrações"
  ];
  
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Recursos Criados Pensando em Você</h2>
      <div className="grid md:grid-cols-3 gap-y-4 gap-x-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="text-primary mt-1">✓</div>
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
