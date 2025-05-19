
import { z } from 'zod';

// Define the form schema with zod
export const habitFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida').default('#9b87f5'),
  frequency_type: z.enum(['daily', 'weekly', 'specific_days']).default('daily'),
  frequency_days: z.array(z.number()).default([0, 1, 2, 3, 4, 5, 6]),
});

export type HabitFormData = z.infer<typeof habitFormSchema>;
