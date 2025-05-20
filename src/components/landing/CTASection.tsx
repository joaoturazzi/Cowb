
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

export default CTASection;
