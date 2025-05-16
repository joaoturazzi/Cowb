
import { supabase } from '../../../integrations/supabase/client';
import { Tag, TaskTag } from '../types/tagTypes';

/**
 * Obter todas as tags do usuário
 */
export const fetchTags = async (userId: string): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    throw error;
  }
};

/**
 * Criar uma nova tag
 */
export const createTag = async (tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    throw error;
  }
};

/**
 * Excluir uma tag
 */
export const deleteTag = async (tagId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao excluir tag:', error);
    throw error;
  }
};

/**
 * Atualizar uma tag existente
 */
export const updateTag = async (tagId: string, updates: Partial<Omit<Tag, 'id' | 'created_at'>>): Promise<Tag> => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', tagId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    throw error;
  }
};

/**
 * Obter tags de uma tarefa específica
 */
export const getTaskTags = async (taskId: string): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase
      .from('task_tags')
      .select('tag_id')
      .eq('task_id', taskId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    const tagIds = data.map(item => item.tag_id);
    
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .in('id', tagIds);
    
    if (tagsError) throw tagsError;
    
    return tags || [];
  } catch (error) {
    console.error('Erro ao buscar tags da tarefa:', error);
    throw error;
  }
};

/**
 * Associar tags a uma tarefa
 */
export const assignTagsToTask = async (taskId: string, tagIds: string[]): Promise<void> => {
  try {
    // Primeiro removemos todas as associações existentes
    const { error: deleteError } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId);
    
    if (deleteError) throw deleteError;
    
    // Se não há tags para adicionar, retornamos
    if (!tagIds.length) return;
    
    // Criamos os objetos de relacionamento
    const taskTags: TaskTag[] = tagIds.map(tagId => ({
      task_id: taskId,
      tag_id: tagId
    }));
    
    // Inserimos os novos relacionamentos
    const { error } = await supabase
      .from('task_tags')
      .insert(taskTags);
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Erro ao associar tags à tarefa:', error);
    throw error;
  }
};
