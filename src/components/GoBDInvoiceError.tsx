import { AlertTriangle, FileText } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';

export function GoBDInvoiceError() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Rechnung bearbeiten (GoBD-Fehler)</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-chart-3/10 p-4">
              <AlertTriangle className="h-12 w-12 text-chart-3" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">Rechnung ist abgeschlossen</AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4">
            <p>
              Diese Rechnung wurde bereits finalisiert und kann gemäß GoBD-Vorschriften nicht mehr
              geändert werden.
            </p>
            <p>
              Für Korrekturen erstellen Sie bitte eine Stornorechnung.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          <Button variant="outline" className="w-full gap-2">
            <FileText className="h-4 w-4" />
            Änderungsprotokoll anzeigen
          </Button>
          <AlertDialogAction className="w-full">Verstanden</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
