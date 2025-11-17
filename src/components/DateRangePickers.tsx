import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns@4.1.0';
import { de } from 'date-fns@4.1.0/locale';
import { DateRange } from 'react-day-picker@8.10.1';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Label } from './ui/label';

export function DateRangePickers() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [projectRange, setProjectRange] = useState<DateRange | undefined>({
    from: new Date(2024, 9, 1), // 01.10.2024
    to: new Date(2024, 11, 31), // 31.12.2024
  });

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Datumsbereich-Auswahl</h4>
        <div className="space-y-4 max-w-md">
          <div>
            <Label>Berichtszeitraum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd.MM.yyyy', { locale: de })} -{' '}
                        {format(dateRange.to, 'dd.MM.yyyy', { locale: de })}
                      </>
                    ) : (
                      format(dateRange.from, 'dd.MM.yyyy', { locale: de })
                    )
                  ) : (
                    'Von - Bis'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={de}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Wählen Sie Start- und Enddatum - Bereich wird hervorgehoben
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Datumsbereich mit vorausgewähltem Zeitraum</h4>
        <div className="space-y-4 max-w-md">
          <div>
            <Label>Projektlaufzeit</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {projectRange?.from && projectRange.to && (
                    <>
                      {format(projectRange.from, 'dd.MM.yyyy', { locale: de })} -{' '}
                      {format(projectRange.to, 'dd.MM.yyyy', { locale: de })}
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={projectRange}
                  onSelect={setProjectRange}
                  locale={de}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Zeitraum vorausgewählt: 01.10.2024 - 31.12.2024 (92 Tage)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Zwei separate Eingabefelder (Von/Bis)</h4>
        <div className="space-y-4 max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-date">Von</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="from-date"
                    variant="outline"
                    className="w-full justify-start h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? format(dateRange.from, 'dd.MM.yy', { locale: de }) : 'TT.MM.JJ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={de}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="to-date">Bis</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="to-date"
                    variant="outline"
                    className="w-full justify-start h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.to ? format(dateRange.to, 'dd.MM.yy', { locale: de }) : 'TT.MM.JJ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={de}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Getrennte Felder für Start und Ende - beide öffnen denselben Kalender
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Datumsbereich mit Schnellauswahl</h4>
        <div className="space-y-4 max-w-md">
          <div>
            <Label>Analysezeitraum</Label>
            <div className="flex gap-2 mb-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setDateRange({ from: today, to: today });
                }}
              >
                Heute
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(today.getDate() - 7);
                  setDateRange({ from: sevenDaysAgo, to: today });
                }}
              >
                Letzte 7 Tage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(today.getDate() - 30);
                  setDateRange({ from: thirtyDaysAgo, to: today });
                }}
              >
                Letzte 30 Tage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                  setDateRange({ from: firstDayOfMonth, to: today });
                }}
              >
                Dieser Monat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                  const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                  setDateRange({ from: firstDayOfLastMonth, to: lastDayOfLastMonth });
                }}
              >
                Letzter Monat
              </Button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'dd.MM.yyyy', { locale: de })} -{' '}
                        {format(dateRange.to, 'dd.MM.yyyy', { locale: de })}
                      </>
                    ) : (
                      format(dateRange.from, 'dd.MM.yyyy', { locale: de })
                    )
                  ) : (
                    'Benutzerdefiniert'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={de}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Schnellauswahl-Buttons für häufig verwendete Zeiträume
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Filterbereich mit Datumsbereich</h4>
        <div className="border border-border rounded-lg p-6 max-w-2xl">
          <h4 className="mb-4">Erweiterte Suche</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Zeitraum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Alle Zeiträume
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    locale={de}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                className="w-full h-10 px-3 border border-border rounded-lg bg-background"
              >
                <option>Alle Status</option>
                <option>Aktiv</option>
                <option>Abgeschlossen</option>
                <option>Überfällig</option>
              </select>
            </div>

            <div>
              <Label htmlFor="customer-filter">Kunde</Label>
              <input
                id="customer-filter"
                placeholder="Kundenname eingeben"
                className="w-full h-10 px-3 border border-border rounded-lg bg-background"
              />
            </div>

            <div>
              <Label htmlFor="amount-filter">Mindestbetrag (€)</Label>
              <input
                id="amount-filter"
                type="number"
                placeholder="0,00"
                className="w-full h-10 px-3 border border-border rounded-lg bg-background"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button>Filter anwenden</Button>
            <Button variant="outline">Zurücksetzen</Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Datumsbereich als Teil eines umfassenden Filtersystems
        </p>
      </div>

      <div>
        <h4 className="mb-4">Einmonatiger Datumsbereich</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label>Urlaubszeitraum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Von - Bis
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  locale={de}
                  numberOfMonths={1}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Kompakte Ansicht mit nur einem Monat (weniger Platz benötigt)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
