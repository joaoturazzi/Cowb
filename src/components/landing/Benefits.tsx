
import React from 'react';
import { Clock, Check, Brain } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Foco sem distração",
      description: "Temporizador Pomodoro visual, limpo e intuitivo."
    },
    {
      icon: <Check className="h-8 w-8 text-primary" />,
      title: "Gestão de tarefas inteligente",
      description: "Organização automática e alerta amigável."
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Motivação contínua",
      description: "Emojis divertidos e mensagens motivacionais."
    }
  ];
  
  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Benefícios-chave</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-card border rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
