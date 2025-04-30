import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask, useAuth } from '../contexts';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeft, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const AddTask = () => {
  const { addTask } = useTask();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('25');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para a tarefa",
        variant: "destructive"
      });
      return;
    }
    
    addTask({
      name: name.trim(),
      estimatedTime: parseInt(estimatedTime, 10),
      priority
    });
    
    toast({
      title: "Tarefa adicionada",
      description: "A tarefa foi adicionada com sucesso",
    });
    
    navigate('/');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-60">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Nova tarefa</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da tarefa</Label>
          <Input
            id="name"
            placeholder="O que você precisa fazer?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedTime">Tempo estimado (minutos)</Label>
          <Select
            value={estimatedTime}
            onValueChange={(value) => setEstimatedTime(value)}
          >
            <SelectTrigger id="estimatedTime">
              <SelectValue placeholder="Selecione o tempo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutos</SelectItem>
              <SelectItem value="10">10 minutos</SelectItem>
              <SelectItem value="15">15 minutos</SelectItem>
              <SelectItem value="25">25 minutos</SelectItem>
              <SelectItem value="30">30 minutos</SelectItem>
              <SelectItem value="45">45 minutos</SelectItem>
              <SelectItem value="60">1 hora</SelectItem>
              <SelectItem value="90">1.5 horas</SelectItem>
              <SelectItem value="120">2 horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full" size="lg">
          <Plus className="h-4 w-4 mr-2" /> Adicionar tarefa
        </Button>
      </form>
    </Layout>
  );
};

export default AddTask;
