import { Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';

interface FullScreenLoaderProps {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export function FullScreenLoader({
  message = 'Daten werden geladen...',
  progress,
  showProgress = false,
}: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 max-w-sm w-full px-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground text-center">{message}</p>
        {showProgress && progress !== undefined && (
          <div className="w-full space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-muted-foreground text-center">
              {progress}% abgeschlossen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
