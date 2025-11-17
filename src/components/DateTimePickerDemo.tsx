import { DatePickers } from './DatePickers';
import { DateRangePickers } from './DateRangePickers';
import { TimePickers } from './TimePickers';
import { YearMonthPickers } from './YearMonthPickers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function DateTimePickerDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datumsauswahl</CardTitle>
          <CardDescription>
            Einfache Datumsauswahl, Kalenderansicht, Einschränkungen, Validierung und Formularintegration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DatePickers />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datumsbereich-Auswahl</CardTitle>
          <CardDescription>
            Zeiträume wählen, Von/Bis-Eingaben, Schnellauswahl-Presets und Filterintegration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangePickers />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zeitauswahl</CardTitle>
          <CardDescription>
            Uhrzeiten, Dropdowns, Datum-Zeit-Kombination, Zeitbereiche und Geschäftszeiten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimePickers />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jahr- und Monatsauswahl</CardTitle>
          <CardDescription>
            Kalender mit Jahr- und Monat-Dropdowns für Geburtsdaten, historische Daten und schnelle Navigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <YearMonthPickers />
        </CardContent>
      </Card>
    </div>
  );
}