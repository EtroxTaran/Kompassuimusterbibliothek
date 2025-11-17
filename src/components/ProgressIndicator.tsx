import { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export function ProgressIndicator() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsRunning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startProgress = () => {
    setProgress(0);
    setIsRunning(true);
  };

  const cancelProgress = () => {
    setIsRunning(false);
    setProgress(0);
  };

  const totalItems = 500;
  const completedItems = Math.floor((progress / 100) * totalItems);
  const remainingMinutes = Math.ceil((100 - progress) / 10);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="mb-1">Kunden werden importiert...</h4>
            <p className="text-muted-foreground">
              {completedItems} von {totalItems} Kunden importiert
            </p>
          </div>
          {isRunning && (
            <Button variant="outline" size="sm" onClick={cancelProgress} className="gap-2">
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
          )}
        </div>

        <Progress value={progress} className="w-full" />

        <div className="flex items-center justify-between text-muted-foreground">
          <span>{progress}% abgeschlossen</span>
          {isRunning && progress < 100 && (
            <span>Geschätzte verbleibende Zeit: {remainingMinutes} Minuten</span>
          )}
          {progress === 100 && <span className="text-chart-2">Import abgeschlossen</span>}
        </div>
      </div>

      {!isRunning && progress === 0 && (
        <Button onClick={startProgress}>Bulk-Import starten</Button>
      )}

      {progress === 100 && (
        <Button onClick={() => setProgress(0)} variant="outline">
          Zurücksetzen
        </Button>
      )}
    </div>
  );
}
