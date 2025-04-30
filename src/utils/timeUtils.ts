
/**
 * Formats minutes into a human-readable string
 * @param mins Minutes to format
 * @returns Formatted string like "5m" or "2h 30m"
 */
export const formatMinutes = (mins: number): string => {
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
};

/**
 * Formats minutes into a more detailed display format
 * @param minutes Minutes to format
 * @returns Formatted string like "5 minutos" or "2 horas 30 minutos"
 */
export const formatTimeForDisplay = (minutes: number): string => {
  if (minutes < 60) return `${minutes} minutos`;
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${mins}min`;
};
