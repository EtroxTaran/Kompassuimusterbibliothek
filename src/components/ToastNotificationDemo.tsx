import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

export function ToastNotificationDemo() {
  const { toast } = useToast();

  const showErrorToast = () => {
    toast({
      variant: 'destructive',
      title: 'Fehler',
      description: 'Kunde konnte nicht gespeichert werden.',
    });
  };

  const showSuccessToast = () => {
    toast({
      title: 'Erfolgreich',
      description: 'Kunde wurde erfolgreich gespeichert.',
    });
  };

  const showWarningToast = () => {
    toast({
      title: 'Warnung',
      description: 'Einige Felder konnten nicht synchronisiert werden.',
      variant: 'default',
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={showErrorToast} variant="destructive">
        Fehler-Toast anzeigen
      </Button>
      <Button onClick={showSuccessToast} variant="default">
        Erfolgs-Toast anzeigen
      </Button>
      <Button onClick={showWarningToast} variant="outline">
        Warnungs-Toast anzeigen
      </Button>
    </div>
  );
}