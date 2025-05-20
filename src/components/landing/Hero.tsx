
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

export default Hero;
