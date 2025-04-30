
import React from 'react';

interface OfflineWarningProps {
  isOnline: boolean;
}

const OfflineWarning: React.FC<OfflineWarningProps> = ({ isOnline }) => {
  if (isOnline) return null;
  
  return (
    <div className="mb-4 px-3 py-2 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-200 text-sm">
      Modo offline. Suas alterações serão sincronizadas quando a conexão for restabelecida.
    </div>
  );
};

export default OfflineWarning;
