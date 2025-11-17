import { useState } from 'react';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns@4.1.0';
import { de } from 'date-fns@4.1.0/locale';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function TimePickers() {
  const [time, setTime] = useState('14:30');
  const [hour, setHour] = useState('14');
  const [minute, setMinute] = useState('30');
  const [date, setDate] = useState<Date>();
  const [dateTime, setDateTime] = useState<Date>();
  const [timeForDateTime, setTimeForDateTime] = useState('14:30');

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const setCurrentTime = () => {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = Math.floor(now.getMinutes() / 15) * 15;
    const currentMinuteStr = currentMinute.toString().padStart(2, '0');
    setHour(currentHour);
    setMinute(currentMinuteStr);
    setTime(`${currentHour}:${currentMinuteStr}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Einfache Zeiteingabe (Text-Input)</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="simple-time">Meeting-Zeit</Label>
            <div className="relative">
              <Input
                id="simple-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-muted-foreground mt-2">
              Nativer Browser-Zeitauswahl (24-Stunden-Format)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Zeit-Auswahl mit Dropdowns</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label>Startzeit</Label>
            <div className="flex gap-2 items-center">
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={setCurrentTime}
              >
                Jetzt
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              Ausgewählt: {hour}:{minute} Uhr - Minuten in 15-Minuten-Schritten
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Datum und Uhrzeit kombiniert</h4>
        <div className="space-y-4 max-w-md">
          <div>
            <Label>Meeting-Termin</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTime ? format(dateTime, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTime}
                    onSelect={setDateTime}
                    locale={de}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="relative w-32">
                <Input
                  type="time"
                  value={timeForDateTime}
                  onChange={(e) => setTimeForDateTime(e.target.value)}
                  className="h-10"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            {dateTime && (
              <p className="text-muted-foreground mt-2">
                Gewählt: {format(dateTime, 'dd.MM.yyyy', { locale: de })}, {timeForDateTime} Uhr
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Zeitbereich-Auswahl</h4>
        <div className="space-y-4 max-w-md">
          <div>
            <Label>Arbeitszeit</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground mb-2 block">Von</label>
                <div className="relative">
                  <Input
                    type="time"
                    defaultValue="09:00"
                    className="h-10"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-muted-foreground mb-2 block">Bis</label>
                <div className="relative">
                  <Input
                    type="time"
                    defaultValue="17:00"
                    className="h-10"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
            <p className="text-muted-foreground mt-2">
              Zeitspanne: 09:00 - 17:00 Uhr (8 Stunden)
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Zeitauswahl in Formular</h4>
        <div className="border border-border rounded-lg p-6 max-w-md">
          <h4 className="mb-4">Termin erstellen</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="appointment-date">Datum *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="appointment-date"
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
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Von *</Label>
                <div className="relative">
                  <Input
                    id="start-time"
                    type="time"
                    defaultValue="10:00"
                    className="h-10"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <Label htmlFor="end-time">Bis *</Label>
                <div className="relative">
                  <Input
                    id="end-time"
                    type="time"
                    defaultValue="11:00"
                    className="h-10"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                placeholder="Besprechung mit Kunde"
                className="h-10"
              />
            </div>

            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <textarea
                id="description"
                placeholder="Agenda und Notizen..."
                className="w-full min-h-20 px-3 py-2 border border-border rounded-lg bg-background resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1">Termin speichern</Button>
              <Button variant="outline">Abbrechen</Button>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Vollständiges Terminformular mit Datum, Zeit und Details
        </p>
      </div>

      <div>
        <h4 className="mb-4">Geschäftszeiten-Auswahl</h4>
        <div className="border border-border rounded-lg p-6 max-w-md">
          <h4 className="mb-4">Öffnungszeiten</h4>
          <div className="space-y-3">
            {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'].map((day) => (
              <div key={day} className="flex items-center gap-3">
                <div className="w-24">
                  <span>{day}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="time"
                    defaultValue="09:00"
                    className="h-9"
                  />
                  <span>-</span>
                  <Input
                    type="time"
                    defaultValue="18:00"
                    className="h-9"
                  />
                </div>
              </div>
            ))}
            {['Samstag', 'Sonntag'].map((day) => (
              <div key={day} className="flex items-center gap-3">
                <div className="w-24">
                  <span className="text-muted-foreground">{day}</span>
                </div>
                <div className="flex-1">
                  <span className="text-muted-foreground">Geschlossen</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6">
            <Button>Speichern</Button>
            <Button variant="outline">Zurücksetzen</Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Wöchentliche Zeitplan-Verwaltung für Geschäftszeiten
        </p>
      </div>

      <div>
        <h4 className="mb-4">Schnelle Zeitauswahl (Preset-Zeiten)</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label>Besprechungszeit</Label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  onClick={() => setTime(t)}
                  className={time === t ? 'border-primary bg-primary/10' : ''}
                >
                  {t}
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-muted-foreground mt-2">
              Schnellauswahl für volle Stunden oder benutzerdefinierte Zeit
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Validierungszustände</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="time-error">Endzeit (Fehler)</Label>
            <div className="relative">
              <Input
                id="time-error"
                type="time"
                defaultValue="08:00"
                className="h-10 border-destructive focus-visible:ring-destructive"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-destructive mt-1">
              Endzeit muss nach der Startzeit (09:00) liegen
            </p>
          </div>

          <div>
            <Label htmlFor="time-warning">Pausenzeit (Warnung)</Label>
            <div className="relative">
              <Input
                id="time-warning"
                type="time"
                defaultValue="12:00"
                className="h-10 border-chart-4 focus-visible:ring-chart-4"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="text-chart-4 mt-1">
              Übliche Pausenzeit: 12:00 - 13:00 Uhr
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Fehler- und Warnhinweise für Zeitvalidierung
        </p>
      </div>
    </div>
  );
}
