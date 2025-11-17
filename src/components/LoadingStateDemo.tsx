import { useState } from 'react';
import { Button } from './ui/button';
import { FullScreenLoader } from './FullScreenLoader';

export function LoadingStateDemo() {
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);

  const showBasicLoader = () => {
    setShowLoader(true);
    setTimeout(() => setShowLoader(false), 3000);
  };

  const showProgressLoader = () => {
    setProgress(0);
    setShowLoader(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowLoader(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="space-y-4">
      <Button onClick={showBasicLoader} variant="outline">
        Einfachen Loader anzeigen (3s)
      </Button>
      
      <Button onClick={showProgressLoader} variant="outline">
        Loader mit Fortschritt anzeigen
      </Button>

      {showLoader && (
        <FullScreenLoader
          message={progress > 0 ? 'Rechnung wird erstellt...' : 'Daten werden geladen...'}
          progress={progress > 0 ? progress : undefined}
          showProgress={progress > 0}
        />
      )}
    </div>
  );
}
