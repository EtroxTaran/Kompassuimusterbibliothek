import { useEffect, useState } from 'react';

export function InlineLoadingText() {
  const [dots, setDots] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="border border-border rounded-lg p-6 bg-card">
        <p className="text-muted-foreground">
          Wird geladen{'.'.repeat(dots)}
        </p>
      </div>

      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded animate-pulse" />
          <p className="text-muted-foreground">
            Weitere Inhalte werden geladen{'.'.repeat(dots)}
          </p>
        </div>
      </div>

      <div className="border border-dashed border-border rounded-lg p-6 bg-muted/20">
        <p className="text-center text-muted-foreground">
          Scrollen Sie nach unten für mehr{'.'.repeat(dots)}
        </p>
      </div>
    </div>
  );
}
