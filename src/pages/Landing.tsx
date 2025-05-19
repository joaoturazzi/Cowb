import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts';
import { Clock, Check, Brain } from 'lucide-react';

// Header component for the landing page
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="py-4 px-6 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center">
        <img 
          src="https://i.postimg.cc/K8MMNVLZ/Mazul-1.png" 
          alt="Mazul Logo" 
          className="h-10"
        />
      </div>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <Button onClick={() => navigate('/')} variant="default">
            Ir para o App
          </Button>
        ) : (
          <>
            <Button onClick={() => navigate('/login')} variant="ghost">
              Entrar
            </Button>
            <Button onClick={() => navigate('/login')} variant="default">
              Começar agora
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

// Hero section component
const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          A maneira mais simples e divertida de organizar suas tarefas e manter o foco.
        </h1>
        <p className="text-xl text-muted-foreground">
          Desenvolvido especialmente para quem tem TDAH.
        </p>
        <Button 
          size="lg" 
          className="mt-8" 
          onClick={() => navigate('/login')}
        >
          Teste Grátis
        </Button>
      </div>
      <div className="md:w-1/2 mt-8 md:mt-0 px-4">
        <div className="bg-card border rounded-lg shadow-lg p-4">
          <img 
            src="https://i.postimg.cc/XJym7nBR/Chat-GPT-Image-30-de-abr-de-2025-11-19-44.png" 
            alt="App Cowb em uso" 
            className="w-full rounded-md"
          />
        </div>
      </div>
    </section>
  );
};

// Benefits section component
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

// How it works section component
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

// Features section component
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

// Final CTA section component
const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-6 text-center max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Pronto para experimentar a diferença Cowb?</h2>
      <Button 
        size="lg" 
        className="mt-6" 
        onClick={() => navigate('/login')}
      >
        Começar Agora Gratuitamente
      </Button>
    </section>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="py-8 border-t">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-4">
          <img 
            src="https://i.postimg.cc/K8MMNVLZ/Mazul-1.png" 
            alt="Mazul Logo" 
            className="h-10 mx-auto"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Direitos reservados Cowb © 2025
        </p>
      </div>
    </footer>
  );
};

// Main Landing Page component
const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
