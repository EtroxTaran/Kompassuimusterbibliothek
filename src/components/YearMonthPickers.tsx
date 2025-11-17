import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns@4.1.0';
import { de } from 'date-fns@4.1.0/locale';
import { DayPicker } from 'react-day-picker@8.10.1';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from './ui/utils';
import { buttonVariants } from './ui/button';

// Calendar with Month and Year Dropdowns
function CalendarWithYearMonth({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const [month, setMonth] = useState(props.month || new Date());

  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  // Generate years from 1900 to current year + 10
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => 1900 + i);

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = new Date(month);
    newMonth.setMonth(parseInt(monthIndex));
    setMonth(newMonth);
  };

  const handleYearChange = (year: string) => {
    const newMonth = new Date(month);
    newMonth.setFullYear(parseInt(year));
    setMonth(newMonth);
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setMonth(newMonth);
  };

  return (
    <div className={cn("p-3", className)}>
      {/* Custom Header with Month and Year Dropdowns */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2 flex-1">
          <Select
            value={month.getMonth().toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="h-8 flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={month.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-8 w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.reverse().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Picker */}
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        classNames={{
          months: "flex flex-col sm:flex-row gap-2",
          month: "flex flex-col gap-4",
          caption: "hidden", // Hide default caption since we have custom header
          table: "w-full border-collapse space-x-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
            props.mode === "range"
              ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              : "[&:has([aria-selected])]:rounded-md",
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 font-normal aria-selected:opacity-100",
          ),
          day_range_start:
            "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
          day_range_end:
            "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}

export function YearMonthPickers() {
  const [birthDate, setBirthDate] = useState<Date>();
  const [contractDate, setContractDate] = useState<Date>();
  const [historyDate, setHistoryDate] = useState<Date>();

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Geburtsdatum-Auswahl (mit Jahr-Dropdown)</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="birth-date">Geburtsdatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birth-date"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarWithYearMonth
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  locale={de}
                  defaultMonth={new Date(1990, 0)} // Start at January 1990
                  disabled={(date) => date > new Date()} // No future dates for birth dates
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Jahr-Dropdown von 1900 bis heute - ideal für Geburtsdaten
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Vertragsdatum mit Monat- und Jahr-Auswahl</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="contract-date">Vertragsbeginn</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="contract-date"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {contractDate ? format(contractDate, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarWithYearMonth
                  mode="single"
                  selected={contractDate}
                  onSelect={setContractDate}
                  locale={de}
                  defaultMonth={new Date()} // Start at current month
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Schnelle Navigation zu beliebigem Monat und Jahr
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Historisches Datum (Firmengründung)</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label htmlFor="history-date">Gründungsdatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="history-date"
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {historyDate ? format(historyDate, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarWithYearMonth
                  mode="single"
                  selected={historyDate}
                  onSelect={setHistoryDate}
                  locale={de}
                  defaultMonth={new Date(1950, 0)} // Start at 1950 for companies
                  disabled={(date) => date > new Date()} // No future dates
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Für historische Daten - einfach Jahr auswählen, dann Monat, dann Tag
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4">Inline-Ansicht mit Jahr/Monat-Auswahl</h4>
        <div className="border border-border rounded-lg inline-block">
          <CalendarWithYearMonth
            mode="single"
            selected={birthDate}
            onSelect={setBirthDate}
            locale={de}
            defaultMonth={new Date(1990, 0)}
          />
        </div>
        <p className="text-muted-foreground mt-3">
          Kalender permanent sichtbar mit Monat- und Jahr-Dropdowns
        </p>
      </div>

      <div>
        <h4 className="mb-4">Formular mit Geburtsdatum</h4>
        <div className="border border-border rounded-lg p-6 max-w-md">
          <h4 className="mb-4">Mitarbeiter anlegen</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">Vorname *</Label>
                <input
                  id="first-name"
                  placeholder="Max"
                  className="w-full h-10 px-3 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <Label htmlFor="last-name">Nachname *</Label>
                <input
                  id="last-name"
                  placeholder="Mustermann"
                  className="w-full h-10 px-3 border border-border rounded-lg bg-background"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="employee-birth-date">Geburtsdatum *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="employee-birth-date"
                    variant="outline"
                    className="w-full justify-start h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarWithYearMonth
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    locale={de}
                    defaultMonth={new Date(1990, 0)}
                    disabled={(date) => {
                      const today = new Date();
                      const minAge = new Date();
                      minAge.setFullYear(today.getFullYear() - 18); // Must be 18+
                      return date > minAge;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-muted-foreground mt-1">
                Mindestens 18 Jahre alt
              </p>
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <select
                id="position"
                className="w-full h-10 px-3 border border-border rounded-lg bg-background"
              >
                <option>Außendienstmitarbeiter</option>
                <option>Planer</option>
                <option>Kalkulator</option>
                <option>Buchhalter</option>
                <option>Administrator</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1">Mitarbeiter anlegen</Button>
              <Button variant="outline">Abbrechen</Button>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Geburtsdatum mit Altersvalidierung (mind. 18 Jahre)
        </p>
      </div>

      <div>
        <h4 className="mb-4">Schnellnavigation zu bestimmten Jahren</h4>
        <div className="space-y-4 max-w-sm">
          <div>
            <Label>Projekt-Archiv</Label>
            <div className="flex gap-2 mb-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date();
                  date.setFullYear(2024);
                  setHistoryDate(date);
                }}
              >
                2024
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date();
                  date.setFullYear(2023);
                  setHistoryDate(date);
                }}
              >
                2023
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date();
                  date.setFullYear(2022);
                  setHistoryDate(date);
                }}
              >
                2022
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date();
                  date.setFullYear(2021);
                  setHistoryDate(date);
                }}
              >
                2021
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const date = new Date();
                  date.setFullYear(2020);
                  setHistoryDate(date);
                }}
              >
                2020
              </Button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start h-10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {historyDate ? format(historyDate, 'dd.MM.yyyy', { locale: de }) : 'TT.MM.JJJJ'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarWithYearMonth
                  mode="single"
                  selected={historyDate}
                  onSelect={setHistoryDate}
                  locale={de}
                  month={historyDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-2">
              Schnellauswahl für häufig verwendete Jahre + Jahr-Dropdown
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
