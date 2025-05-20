
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Crie suas tarefas",
      description: "Liste as atividades do dia com estimativa de tempo."
    },
    {
      number: "02",
      title: "Defina seu ciclo Pomodoro",
      description: "Escolha o melhor ritmo para você (25/5, 50/10, etc)."
    },
    {
      number: "03",
      title: "Mantenha o foco",
      description: "Cowb ajuda você com notificações suaves e visuais intuitivos."
    },
    {
      number: "04",
      title: "Termine com satisfação",
      description: "Veja o progresso das suas tarefas e sinta o prazer de realizar tudo."
    }
  ];
  
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Como Funciona?</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="text-3xl font-bold text-primary">{step.number}</div>
            <div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
