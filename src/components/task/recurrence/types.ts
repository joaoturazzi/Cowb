
import { Dispatch, SetStateAction } from 'react';

export interface RecurrenceOptions {
  enabled: boolean;
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate: Date | null;
}

export interface RecurrenceSelectorProps {
  value: RecurrenceOptions;
  onChange: (value: RecurrenceOptions) => void;
}

export const recurrenceLabels = {
  daily: 'Diária',
  weekly: 'Semanal',
  monthly: 'Mensal'
};

export type RecurrenceDescriptionProps = {
  options: RecurrenceOptions;
};

export type RecurrenceToggleProps = {
  enabled: boolean;
  onToggle: (checked: boolean) => void;
};

export type RecurrenceTypeProps = {
  type: 'daily' | 'weekly' | 'monthly';
  onTypeChange: (type: 'daily' | 'weekly' | 'monthly') => void;
};

export type RecurrenceIntervalProps = {
  interval: number;
  type: 'daily' | 'weekly' | 'monthly';
  onIntervalChange: (interval: number) => void;
};

export type RecurrenceEndDateProps = {
  endDate: Date | null;
  onEndDateChange: Dispatch<SetStateAction<Date | null>>;
};
