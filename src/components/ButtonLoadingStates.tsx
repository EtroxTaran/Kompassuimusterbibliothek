import { useState } from 'react';
import { Loader2, Save, Upload, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

export function ButtonLoadingStates() {
  const [loadingStates, setLoadingStates] = useState({
    primary: false,
    secondary: false,
    destructive: false,
    outline: false,
  });

  const simulateLoading = (buttonKey: keyof typeof loadingStates) => {
    setLoadingStates((prev) => ({ ...prev, [buttonKey]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [buttonKey]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4>Primary Button</h4>
        <Button
          onClick={() => simulateLoading('primary')}
          disabled={loadingStates.primary}
          className="min-w-[160px]"
        >
          {loadingStates.primary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loadingStates.primary ? 'Wird gespeichert...' : 'Kunde speichern'}
        </Button>
      </div>

      <div className="space-y-3">
        <h4>Secondary Button</h4>
        <Button
          onClick={() => simulateLoading('secondary')}
          disabled={loadingStates.secondary}
          variant="secondary"
          className="min-w-[160px]"
        >
          {loadingStates.secondary && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loadingStates.secondary ? 'Wird hochgeladen...' : 'Datei hochladen'}
        </Button>
      </div>

      <div className="space-y-3">
        <h4>Outline Button</h4>
        <Button
          onClick={() => simulateLoading('outline')}
          disabled={loadingStates.outline}
          variant="outline"
          className="min-w-[160px]"
        >
          {loadingStates.outline && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loadingStates.outline ? 'Wird aktualisiert...' : 'Projekt aktualisieren'}
        </Button>
      </div>

      <div className="space-y-3">
        <h4>Destructive Button</h4>
        <Button
          onClick={() => simulateLoading('destructive')}
          disabled={loadingStates.destructive}
          variant="destructive"
          className="min-w-[160px]"
        >
          {loadingStates.destructive && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loadingStates.destructive ? 'Wird gelöscht...' : 'Kunde löschen'}
        </Button>
      </div>
    </div>
  );
}
