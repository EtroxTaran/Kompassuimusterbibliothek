import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ConflictField {
  field: string;
  label: string;
  localValue: string;
  serverValue: string;
}

export function ConflictResolution() {
  const conflicts: ConflictField[] = [
    {
      field: 'company',
      label: 'Firmenname',
      localValue: 'Müller Bau GmbH',
      serverValue: 'Müller Bauunternehmen GmbH',
    },
    {
      field: 'phone',
      label: 'Telefonnummer',
      localValue: '+49 30 12345678',
      serverValue: '+49 30 87654321',
    },
    {
      field: 'address',
      label: 'Adresse',
      localValue: 'Hauptstraße 15, 10115 Berlin',
      serverValue: 'Hauptstraße 15a, 10115 Berlin',
    },
  ];

  const [selections, setSelections] = useState<Record<string, 'local' | 'server'>>({
    company: 'local',
    phone: 'local',
    address: 'server',
  });

  const handleSelectionChange = (field: string, value: 'local' | 'server') => {
    setSelections((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Konflikte erkannt</AlertTitle>
        <AlertDescription>
          Dieser Kunde wurde sowohl lokal als auch auf dem Server geändert. Bitte wählen Sie für
          jedes Feld die gewünschte Version.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {conflicts.map((conflict) => (
          <Card key={conflict.field}>
            <CardHeader>
              <CardTitle>{conflict.label}</CardTitle>
              <CardDescription>Wählen Sie die Version, die Sie behalten möchten</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selections[conflict.field]}
                onValueChange={(value) => handleSelectionChange(conflict.field, value as 'local' | 'server')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Local version */}
                  <div className="flex items-start space-x-3 space-y-0 border border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <RadioGroupItem value="local" id={`${conflict.field}-local`} />
                    <div className="flex-1">
                      <Label
                        htmlFor={`${conflict.field}-local`}
                        className="cursor-pointer block"
                      >
                        <div className="mb-1 text-primary">Ihre Änderungen</div>
                        <p className="text-foreground">{conflict.localValue}</p>
                      </Label>
                    </div>
                  </div>

                  {/* Server version */}
                  <div className="flex items-start space-x-3 space-y-0 border border-border rounded-lg p-4 hover:border-primary transition-colors">
                    <RadioGroupItem value="server" id={`${conflict.field}-server`} />
                    <div className="flex-1">
                      <Label
                        htmlFor={`${conflict.field}-server`}
                        className="cursor-pointer block"
                      >
                        <div className="mb-1 text-chart-2">Server-Änderungen</div>
                        <p className="text-foreground">{conflict.serverValue}</p>
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Abbrechen</Button>
        <Button>Konflikte lösen</Button>
      </div>
    </div>
  );
}
