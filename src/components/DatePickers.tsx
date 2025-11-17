import { useState } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns@4.1.0';
import { de } from 'date-fns@4.1.0/locale';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function DatePickers() {
  const [date, setDate] = useState<Date>();
  const [dateWithClear, setDateWithClear] = useState<Date>();

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Einfacher Datumsauswahl</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="simple-date">Rechnungsdatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="simple-date"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={de}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Klicken zum Öffnen des Kalenders
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Datumsauswahl mit Löschen-Button</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="date-with-clear">Fälligkeitsdatum</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-with-clear"
                    variant="outline"
                    className="flex-1 justify-start h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateWithClear ? format(dateWithClear, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateWithClear}
                    onSelect={setDateWithClear}
                    locale={de}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dateWithClear && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setDateWithClear(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-muted-foreground mt-2">
              Mit Button zum Zurücksetzen der Auswahl
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Datumsauswahl mit Heute-Markierung</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="date-today">Startdatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-today"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(), 'dd.MM.yyyy', { locale: de })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date()}
                  onSelect={(date) => date && console.log(date)}
                  locale={de}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Heutiges Datum ist farblich hervorgehoben (Akzent-Hintergrund)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Datumsauswahl mit Einschränkungen</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="date-limited">Buchungsdatum (max. 7 Tage zurück)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-limited"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  TT.MM.JJJJ
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={de}
                  disabled={(date) => {
                    const today = new Date();
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    return date > today || date < sevenDaysAgo;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Nur Datumsauswahl der letzten 7 Tage möglich (deaktivierte Tage grau)
            </p>
          </div>

          <div>
            <Label htmlFor="date-future">Termindatum (nur Zukunft)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-future"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  TT.MM.JJJJ
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={de}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Nur zukünftige Daten auswählbar (vergangene Tage deaktiviert)
            </p>
          </div>

          <div>
            <Label htmlFor="date-weekdays">Meeting-Datum (nur Werktage)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-weekdays"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  TT.MM.JJJJ
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={de}
                  disabled={(date) => {
                    const day = date.getDay();
                    return day === 0 || day === 6; // Sonntag oder Samstag
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Wochenenden deaktiviert - nur Montag bis Freitag auswählbar
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Datumsauswahl in Formularkontext</h4>
        <div className="space-y-4 max-w-md border border-border rounded-lg p-6">
          <div>
            <Label htmlFor="invoice-date">Rechnungsdatum *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="invoice-date"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  15.11.2024
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(2024, 10, 15)}
                  locale={de}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="invoice-number">Rechnungsnummer *</Label>
            <Input
              id="invoice-number"
              placeholder="RE-2024-001"
              className="h-10"
            />
          </div>

          <div>
            <Label htmlFor="amount">Betrag (€) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0,00"
              className="h-10"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button>Rechnung erstellen</Button>
            <Button variant="outline">Abbrechen</Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Datumsauswahl integriert in Formular mit gleicher Höhe wie Input-Felder (40px)
        </p>
      </div>

      <div>
        <h4 className="mb-4">Inline-Kalender (ohne Popover)</h4>
        <div className="border border-border rounded-lg p-4 inline-block">
          <Calendar
            mode="single"
            selected={new Date()}
            locale={de}
          />
        </div>
        <p className="text-muted-foreground mt-3">
          Kalender permanent sichtbar - für Dashboard-Widgets oder dedizierte Seiten
        </p>
      </div>

      <div>
        <h4 className="mb-4">Validierungszustände</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="date-error">Lieferdatum (Fehler)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-error"
                  variant="outline"
                  className="w-full justify-start h-10 border-destructive focus-visible:ring-destructive"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  TT.MM.JJJJ
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={de}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-destructive mt-1">
              Pflichtfeld - Bitte wählen Sie ein Datum aus
            </p>
          </div>

          <div>
            <Label htmlFor="date-success">Versanddatum (Erfolgreich)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-success"
                  variant="outline"
                  className="w-full justify-start h-10 border-chart-2 focus-visible:ring-chart-2"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(), 'dd.MM.yyyy', { locale: de })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date()}
                  locale={de}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-chart-2 mt-1">
              Datum erfolgreich ausgewählt
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Fehler- und Erfolgszustände mit farbigen Rahmen und Nachrichten
        </p>
      </div>
    </div>
  );
}
