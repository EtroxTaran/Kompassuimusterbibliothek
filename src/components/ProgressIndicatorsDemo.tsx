import { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
  Loader2,
  Check,
  X,
  Upload,
  FileText,
  AlertCircle,
  Cloud,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from './ui/utils';

// Linear Progress Bar - Determinate with Label
function DeterminateProgressBar() {
  const [progress, setProgress] = useState(45);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const handleStart = () => {
    setProgress(0);
    setStatus('loading');
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleError = () => {
    setStatus('error');
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Linearer Fortschrittsbalken (Bestimmt)</h4>

      {/* Standard Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Wird hochgeladen...</span>
          <span>{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className={cn(
            status === 'error' && '[&>div]:bg-destructive',
            status === 'success' && '[&>div]:bg-green-600'
          )}
        />
        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-sm">Erfolgreich</span>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Fehler beim Hochladen</span>
          </div>
        )}
      </div>

      {/* With File Details */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center justify-between">
          <span>customers.csv</span>
          <span className="text-sm text-muted-foreground">2.5 MB von 10 MB</span>
        </div>
        <Progress value={25} />
        <p className="text-sm text-muted-foreground">
          Geschätzte verbleibende Zeit: 2 Minuten
        </p>
      </div>

      {/* Bulk Import Example */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center justify-between">
          <span>Kunden werden importiert...</span>
          <span>25%</span>
        </div>
        <Progress value={25} />
        <p className="text-sm text-muted-foreground">
          127 von 500 Kunden importiert
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleStart} size="sm">
          Fortschritt starten
        </Button>
        <Button onClick={handleError} variant="destructive" size="sm">
          Fehler simulieren
        </Button>
      </div>
    </div>
  );
}

// Progress Bar Size Variants
function ProgressSizeVariants() {
  return (
    <div className="space-y-6">
      <h4 className="mb-4">Größenvarianten</h4>

      {/* Small */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Klein (6px)</span>
          <span>60%</span>
        </div>
        <Progress value={60} className="h-1.5" />
      </div>

      {/* Medium (Default) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Mittel (8px)</span>
          <span>60%</span>
        </div>
        <Progress value={60} />
      </div>

      {/* Large */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Groß (12px)</span>
          <span>60%</span>
        </div>
        <Progress value={60} className="h-3" />
      </div>
    </div>
  );
}

// Indeterminate Progress Bar
function IndeterminateProgressBar() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Linearer Fortschrittsbalken (Unbestimmt)</h4>

      <div className="space-y-2">
        <span>Wird verarbeitet...</span>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-[progress_2s_ease-in-out_infinite] bg-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <span>Wird importiert...</span>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-[progress_2s_ease-in-out_infinite] bg-primary" />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </div>
  );
}

// Circular Progress - Determinate
function CircularProgress({ value, size = 48, strokeWidth = 4 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm" style={{ fontSize: size / 4 }}>
        {value}%
      </span>
    </div>
  );
}

function CircularProgressDemo() {
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h4 className="mb-4">Kreisförmiger Fortschritt (Bestimmt)</h4>

      <div className="flex items-center gap-8">
        {/* Small */}
        <div className="text-center space-y-2">
          <CircularProgress value={progress} size={32} strokeWidth={3} />
          <p className="text-sm text-muted-foreground">Klein (32px)</p>
        </div>

        {/* Medium */}
        <div className="text-center space-y-2">
          <CircularProgress value={progress} size={48} strokeWidth={4} />
          <p className="text-sm text-muted-foreground">Mittel (48px)</p>
        </div>

        {/* Large */}
        <div className="text-center space-y-2">
          <CircularProgress value={progress} size={64} strokeWidth={5} />
          <p className="text-sm text-muted-foreground">Groß (64px)</p>
        </div>

        {/* Complete State */}
        <div className="text-center space-y-2">
          <div className="relative inline-flex items-center justify-center">
            <svg width={48} height={48} className="-rotate-90">
              <circle
                cx={24}
                cy={24}
                r={20}
                stroke="currentColor"
                strokeWidth={4}
                fill="none"
                className="text-green-600"
              />
            </svg>
            <Check className="absolute h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-muted-foreground">Abgeschlossen</p>
        </div>
      </div>
    </div>
  );
}

// Spinners - Indeterminate
function SpinnersDemo() {
  return (
    <div className="space-y-6">
      <h4 className="mb-4">Spinner (Unbestimmt)</h4>

      {/* Icon Spinner */}
      <div className="space-y-3">
        <h4 className="text-sm">Icon-Spinner</h4>
        <div className="flex items-center gap-6">
          <div className="text-center space-y-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Klein (16px)</p>
          </div>
          <div className="text-center space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Mittel (24px)</p>
          </div>
          <div className="text-center space-y-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Groß (48px)</p>
          </div>
        </div>
      </div>

      {/* Dots Spinner */}
      <div className="space-y-3">
        <h4 className="text-sm">Punkte-Spinner</h4>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-[bounce_1s_ease-in-out_infinite]" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-[bounce_1s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>

      {/* Ring Spinner */}
      <div className="space-y-3">
        <h4 className="text-sm">Ring-Spinner</h4>
        <div className="relative inline-flex items-center justify-center">
          <svg width={24} height={24} className="animate-spin">
            <circle
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
              className="text-muted"
              strokeDasharray="60 40"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* In Button */}
      <div className="space-y-3">
        <h4 className="text-sm">In Buttons</h4>
        <div className="flex gap-2">
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird geladen...
          </Button>
          <Button variant="outline" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Wird verarbeitet...
          </Button>
        </div>
      </div>
    </div>
  );
}

// Multi-Step Progress - Horizontal
function HorizontalStepper() {
  const [currentStep, setCurrentStep] = useState(2);
  const steps = [
    { id: 1, label: 'Grunddaten', description: 'Name und Kontaktdaten' },
    { id: 2, label: 'Adresse', description: 'Standort und Lieferadresse' },
    { id: 3, label: 'Details', description: 'Zusätzliche Informationen' },
    { id: 4, label: 'Zusammenfassung', description: 'Überprüfen und abschließen' },
  ];

  const getStepState = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      <h4 className="mb-4">Horizontaler Stepper</h4>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const state = getStepState(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    state === 'completed' && 'border-primary bg-primary text-primary-foreground',
                    state === 'active' && 'border-primary bg-background text-primary',
                    state === 'upcoming' && 'border-muted-foreground/30 bg-background text-muted-foreground'
                  )}
                >
                  {state === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                {/* Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm',
                      state === 'active' && 'text-primary',
                      state === 'upcoming' && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-colors',
                    step.id < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Zurück
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
        >
          {currentStep === steps.length ? 'Abschließen' : 'Weiter'}
        </Button>
      </div>
    </div>
  );
}

// Multi-Step Progress - Vertical
function VerticalStepper() {
  const [currentStep, setCurrentStep] = useState(2);
  const steps = [
    { id: 1, label: 'Grunddaten', description: 'Name und Kontaktdaten eingeben' },
    { id: 2, label: 'Adresse', description: 'Standort und Lieferadresse hinzufügen' },
    { id: 3, label: 'Details', description: 'Zusätzliche Informationen' },
    { id: 4, label: 'Zusammenfassung', description: 'Überprüfen und abschließen' },
  ];

  const getStepState = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      <h4 className="mb-4">Vertikaler Stepper</h4>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const state = getStepState(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Circle and Line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors shrink-0',
                    state === 'completed' && 'border-primary bg-primary text-primary-foreground',
                    state === 'active' && 'border-primary bg-background text-primary',
                    state === 'upcoming' && 'border-muted-foreground/30 bg-background text-muted-foreground'
                  )}
                >
                  {state === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'my-1 w-0.5 flex-1 min-h-[40px] transition-colors',
                      step.id < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-8">
                <p
                  className={cn(
                    state === 'active' && 'text-primary',
                    state === 'upcoming' && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Zurück
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
        >
          {currentStep === steps.length ? 'Abschließen' : 'Weiter'}
        </Button>
      </div>
    </div>
  );
}

// File Upload Progress
function FileUploadProgress() {
  const [files, setFiles] = useState([
    { id: 1, name: 'customers.csv', size: 10, uploaded: 2.5, status: 'uploading' as const },
    { id: 2, name: 'projects.xlsx', size: 5, uploaded: 5, status: 'complete' as const },
    { id: 3, name: 'invoices.pdf', size: 8, uploaded: 0.8, status: 'error' as const },
    { id: 4, name: 'contacts.vcf', size: 2, uploaded: 0, status: 'pending' as const },
  ]);

  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === 'complete').length;

  return (
    <div className="space-y-6">
      <h4 className="mb-4">Datei-Upload-Fortschritt</h4>

      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Dateien werden hochgeladen...</span>
          <span className="text-sm text-muted-foreground">
            {completedFiles} von {totalFiles} abgeschlossen
          </span>
        </div>
        <Progress value={(completedFiles / totalFiles) * 100} />
      </div>

      <Separator />

      {/* Individual Files */}
      <div className="space-y-4">
        {files.map((file) => {
          const progress = file.size > 0 ? (file.uploaded / file.size) * 100 : 0;

          return (
            <div key={file.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate">{file.name}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {file.status === 'uploading' && (
                        <span className="text-sm text-muted-foreground">
                          {file.uploaded.toFixed(1)} MB von {file.size} MB
                        </span>
                      )}
                      {file.status === 'complete' && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                      {file.status === 'error' && (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  {file.status === 'uploading' && (
                    <Progress value={progress} className="h-1" />
                  )}
                  {file.status === 'error' && (
                    <p className="text-sm text-destructive">Upload fehlgeschlagen</p>
                  )}
                </div>
                {file.status === 'uploading' && (
                  <Button variant="ghost" size="sm">
                    Abbrechen
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Bulk Operation Progress
function BulkOperationProgress() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const startOperation = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsRunning(false), 2000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const itemsProcessed = Math.floor((progress / 100) * 500);
  const totalItems = 500;
  const timeRemaining = Math.max(0, Math.ceil(((100 - progress) / 100) * 120));

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Massenoperation-Fortschritt</h4>

      {!isRunning ? (
        <Button onClick={startOperation}>
          Import starten
        </Button>
      ) : (
        <div className="border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4>Kunden werden importiert...</h4>
            {progress < 100 && (
              <Button variant="outline" size="sm">
                Abbrechen
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {itemsProcessed} von {totalItems} Kunden importiert
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
            {progress < 100 && timeRemaining > 0 && (
              <p className="text-sm text-muted-foreground">
                Geschätzte verbleibende Zeit: {timeRemaining} Sekunden
              </p>
            )}
            {progress === 100 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Import erfolgreich abgeschlossen</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sync Progress Indicator
function SyncProgressIndicator() {
  const [status, setStatus] = useState<'syncing' | 'complete' | 'error'>('syncing');
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    if (status === 'syncing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStatus('complete');
            return 100;
          }
          return prev + 5;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Synchronisations-Fortschrittsanzeige</h4>

      <div className="border border-border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Status Icon with Progress */}
            <div className="relative">
              {status === 'syncing' && (
                <>
                  <Cloud className="h-5 w-5 text-primary" />
                  <svg className="absolute inset-0 h-5 w-5 -rotate-90">
                    <circle
                      cx={10}
                      cy={10}
                      r={8}
                      stroke="currentColor"
                      strokeWidth={2}
                      fill="none"
                      strokeDasharray={50.26}
                      strokeDashoffset={50.26 - (progress / 100) * 50.26}
                      className="text-primary transition-all"
                    />
                  </svg>
                </>
              )}
              {status === 'complete' && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
              {status === 'error' && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>

            {/* Status Text */}
            <div>
              {status === 'syncing' && (
                <>
                  <p className="text-sm">Wird synchronisiert...</p>
                  <p className="text-xs text-muted-foreground">3 Änderungen</p>
                </>
              )}
              {status === 'complete' && (
                <p className="text-sm text-green-600">Synchronisiert</p>
              )}
              {status === 'error' && (
                <p className="text-sm text-destructive">Synchronisierungsfehler</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus('syncing');
                setProgress(0);
              }}
            >
              Erneut synchronisieren
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus('error')}
            >
              Fehler simulieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Project Progress Card
function ProjectProgressCard() {
  const progress = 65;
  const completedMilestones = 3;
  const totalMilestones = 5;

  return (
    <div className="space-y-4">
      <h4 className="mb-4">Projekt-Fortschrittskarte</h4>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Büroumbau Musterstraße 123</CardTitle>
            <Badge variant={progress >= 70 ? 'default' : 'secondary'}>
              {progress >= 70 ? 'Auf Kurs' : 'In Arbeit'}
            </Badge>
          </div>
          <CardDescription>Planung und Ausführung</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Large Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <CircularProgress value={progress} size={120} strokeWidth={8} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl">{progress}%</span>
                <span className="text-xs text-muted-foreground">Abgeschlossen</span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Meilensteine</span>
              <span className="text-sm text-muted-foreground">
                {completedMilestones} von {totalMilestones} abgeschlossen
              </span>
            </div>
            <Progress value={(completedMilestones / totalMilestones) * 100} className="h-2" />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Startdatum</p>
              <p>01.09.2024</p>
            </div>
            <div>
              <p className="text-muted-foreground">Geplantes Ende</p>
              <p>31.12.2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton Loading
function SkeletonLoadingDemo() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Skelett-Laden (Platzhalter)</h4>

      <div className="border border-border rounded-lg p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </div>

        <Separator />

        {/* Content */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded animate-pulse w-full" />
          <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-3 bg-muted rounded animate-pulse w-4/6" />
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-muted rounded animate-pulse w-20" />
          <div className="h-8 bg-muted rounded animate-pulse w-20" />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Animierte Platzhalter während des initialen Ladens
      </p>
    </div>
  );
}

export function ProgressIndicatorsDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Lineare Fortschrittsbalken</CardTitle>
          <CardDescription>
            Fortschrittsanzeigen mit Prozentangabe und Statusmeldungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeterminateProgressBar />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Größenvarianten</CardTitle>
          <CardDescription>
            Klein (6px), Mittel (8px), Groß (12px)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressSizeVariants />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unbestimmter Fortschritt</CardTitle>
          <CardDescription>
            Animierter Balken ohne spezifische Prozentangabe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IndeterminateProgressBar />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kreisförmiger Fortschritt</CardTitle>
          <CardDescription>
            Rundes Fortschrittsdiagramm mit Prozentangabe in der Mitte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CircularProgressDemo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spinner</CardTitle>
          <CardDescription>
            Ladeanzeigen für unbestimmte Wartezeiten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SpinnersDemo />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Mehrstufiger Fortschritt</CardTitle>
          <CardDescription>
            Schrittanzeigen für mehrstufige Prozesse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <HorizontalStepper />
          <Separator />
          <VerticalStepper />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Datei-Upload</CardTitle>
          <CardDescription>
            Fortschrittsanzeige für einzelne und mehrere Datei-Uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadProgress />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Massenoperation</CardTitle>
          <CardDescription>
            Fortschritt für Bulk-Operationen wie Imports und Batch-Updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BulkOperationProgress />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Synchronisierung</CardTitle>
          <CardDescription>
            Sync-Status mit kreisförmigem Fortschritt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SyncProgressIndicator />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projekt-Fortschritt</CardTitle>
          <CardDescription>
            Detaillierte Fortschrittskarte mit Meilensteinen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectProgressCard />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skelett-Laden</CardTitle>
          <CardDescription>
            Inhaltsplatzhalter mit Schimmeranimation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SkeletonLoadingDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Fortschrittsbalken</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Höhe: 6-12px je nach Kontext</li>
              <li>• Pill-Form (999px) oder Standard (4px)</li>
              <li>• Smooth-Transition: 300ms</li>
              <li>• Bestimmt: 0-100% mit Label</li>
              <li>• Unbestimmt: Animiertes Segment</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Spinner</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Klein: 16px (Inline-Text)</li>
              <li>• Mittel: 24px (Buttons, Karten)</li>
              <li>• Groß: 48px (Vollbild)</li>
              <li>• Rotation: Linear, 1s Loop</li>
              <li>• aria-label="Wird geladen"</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Kreisfortschritt</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Klein: 32px, Stroke 3px</li>
              <li>• Mittel: 48px, Stroke 4px</li>
              <li>• Groß: 64px+, Stroke 5px</li>
              <li>• Prozent im Zentrum</li>
              <li>• Clockwise von 12 Uhr</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Mehrstufig</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kreis: 40px Durchmesser</li>
              <li>• Abgeschlossen: Blau + Haken</li>
              <li>• Aktiv: Blauer Rahmen + Zahl</li>
              <li>• Ausstehend: Grauer Rahmen</li>
              <li>• Linie: 2px, verbindet Schritte</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zustände</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Laden: Blau, animiert</li>
              <li>• Erfolg: Grün + Häkchen</li>
              <li>• Fehler: Rot + X-Symbol</li>
              <li>• Abbrechen-Button bei lang</li>
              <li>• Auto-Schließen bei Erfolg</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• role="progressbar"</li>
              <li>• aria-valuenow (0-100)</li>
              <li>• aria-valuemin="0"</li>
              <li>• aria-valuemax="100"</li>
              <li>• aria-live="polite" Updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
