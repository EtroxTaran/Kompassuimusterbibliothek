import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  Calendar,
  Clock,
  Search,
  Save,
  X,
  ArrowLeft,
  Plus,
  AlertTriangle,
  Check,
  FileText,
} from 'lucide-react';

// Types
export type TimeInputMethod = 'duration' | 'start-end';
export type ActivityType =
  | 'development'
  | 'meeting'
  | 'design'
  | 'testing'
  | 'documentation'
  | 'support'
  | 'administration'
  | 'travel';

export interface Project {
  id: string;
  code: string;
  name: string;
  phase?: string;
  isFavorite: boolean;
  defaultBillable: boolean;
}

export interface TimeEntry {
  id: string;
  date: string;
  projectId: string;
  activityType?: ActivityType;
  duration: number; // in hours
  startTime?: string;
  endTime?: string;
  description: string;
  isBillable: boolean;
  isOvertime: boolean;
  status: 'draft' | 'submitted';
}

export interface TimeTemplate {
  id: string;
  name: string;
  duration: number;
  activityType: ActivityType;
  description: string;
  isFrequent: boolean;
}

// Activity Types
export const activityTypes = [
  { id: 'development' as ActivityType, label: 'Entwicklung' },
  { id: 'meeting' as ActivityType, label: 'Meeting' },
  { id: 'design' as ActivityType, label: 'Konzeption' },
  { id: 'testing' as ActivityType, label: 'Testing/QA' },
  { id: 'documentation' as ActivityType, label: 'Dokumentation' },
  { id: 'support' as ActivityType, label: 'Support' },
  { id: 'administration' as ActivityType, label: 'Administration' },
  { id: 'travel' as ActivityType, label: 'Reise' },
];

// Mock Data
export const mockProjects: Project[] = [
  {
    id: 'proj1',
    code: 'P-2025-A001',
    name: 'Projekt Phoenix',
    phase: 'Phase 2: Backend-Entwicklung',
    isFavorite: true,
    defaultBillable: true,
  },
  {
    id: 'proj2',
    code: 'P-2025-B002',
    name: 'Hofladen Website',
    isFavorite: false,
    defaultBillable: true,
  },
  {
    id: 'admin',
    code: 'ADMIN',
    name: 'Administration',
    isFavorite: true,
    defaultBillable: false,
  },
  {
    id: 'meeting',
    code: 'MEETING',
    name: 'Meetings',
    isFavorite: true,
    defaultBillable: false,
  },
];

export const mockTemplates: TimeTemplate[] = [
  {
    id: 'tpl1',
    name: 'Daily Standup',
    duration: 0.25,
    activityType: 'meeting',
    description: 'Daily Team Standup',
    isFrequent: true,
  },
  {
    id: 'tpl2',
    name: 'Sprint Planning',
    duration: 2,
    activityType: 'meeting',
    description: 'Sprint Planning Meeting',
    isFrequent: true,
  },
  {
    id: 'tpl3',
    name: 'Code Review',
    duration: 1,
    activityType: 'development',
    description: 'Code Review Session',
    isFrequent: true,
  },
];

// Utility Functions
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

export function parseDuration(hours: string, minutes: string): number {
  const h = parseInt(hours) || 0;
  const m = parseInt(minutes) || 0;
  return h + m / 60;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  let diff = endMinutes - startMinutes;
  if (diff < 0) diff += 24 * 60; // Handle overnight
  
  return diff / 60;
}

// Project Search Dialog
export interface ProjectSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProject: (project: Project) => void;
}

export function ProjectSearchDialog({
  open,
  onOpenChange,
  onSelectProject,
}: ProjectSearchDialogProps) {
  const [search, setSearch] = useState('');

  const filteredProjects = mockProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeProjects = filteredProjects.filter((p) => !p.isFavorite);
  const favorites = filteredProjects.filter((p) => p.isFavorite);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Projekt suchen</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name oder Nummer..."
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-64">
            <div className="space-y-4">
              {favorites.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Favoriten</p>
                  <div className="space-y-1">
                    {favorites.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          onSelectProject(project);
                          onOpenChange(false);
                        }}
                        className="w-full text-left p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          {project.code} - {project.name}
                        </p>
                        {project.phase && (
                          <p className="text-xs text-muted-foreground">{project.phase}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeProjects.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Aktive Projekte</p>
                  <div className="space-y-1">
                    {activeProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          onSelectProject(project);
                          onOpenChange(false);
                        }}
                        className="w-full text-left p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          {project.code} - {project.name}
                        </p>
                        {project.phase && (
                          <p className="text-xs text-muted-foreground">{project.phase}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Desktop Time Entry Form
export interface DesktopTimeEntryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Partial<TimeEntry>, isDraft: boolean) => void;
  initialData?: Partial<TimeEntry>;
}

export function DesktopTimeEntryForm({
  open,
  onOpenChange,
  onSave,
  initialData,
}: DesktopTimeEntryFormProps) {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    initialData?.projectId
      ? mockProjects.find((p) => p.id === initialData.projectId) || null
      : null
  );
  const [activityType, setActivityType] = useState<ActivityType | ''>(
    initialData?.activityType || ''
  );
  const [inputMethod, setInputMethod] = useState<TimeInputMethod>('start-end');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [startTime, setStartTime] = useState(initialData?.startTime || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isBillable, setIsBillable] = useState(
    initialData?.isBillable ?? selectedProject?.defaultBillable ?? true
  );
  const [isOvertime, setIsOvertime] = useState(initialData?.isOvertime || false);
  const [showProjectSearch, setShowProjectSearch] = useState(false);

  // Calculate duration
  const duration =
    inputMethod === 'duration'
      ? parseDuration(hours, minutes)
      : startTime && endTime
      ? calculateDuration(startTime, endTime)
      : 0;

  // Update billable when project changes
  useEffect(() => {
    if (selectedProject) {
      setIsBillable(selectedProject.defaultBillable);
    }
  }, [selectedProject]);

  const handleSubmit = (isDraft: boolean) => {
    // Validation
    if (!selectedProject) {
      toast.error('Bitte Projekt auswählen');
      return;
    }

    if (duration < 0.25) {
      toast.error('Dauer muss mindestens 15 Minuten (0,25 Std.) betragen');
      return;
    }

    if (duration > 24) {
      toast.error('Dauer kann nicht mehr als 24 Stunden betragen');
      return;
    }

    if (!description || description.length < 10) {
      toast.error('Beschreibung muss mindestens 10 Zeichen haben');
      return;
    }

    if (duration > 10 && !isDraft) {
      toast.warning('Achtung: Eintrag über 10 Stunden!');
    }

    const entryData: Partial<TimeEntry> = {
      date,
      projectId: selectedProject.id,
      activityType: activityType || undefined,
      duration,
      startTime: inputMethod === 'start-end' ? startTime : undefined,
      endTime: inputMethod === 'start-end' ? endTime : undefined,
      description,
      isBillable,
      isOvertime,
      status: isDraft ? 'draft' : 'submitted',
    };

    onSave(entryData, isDraft);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Zeiterfassung</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-6">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">
                  Datum <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Project & Task */}
              <div className="space-y-4">
                <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Projekt & Aufgabe
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="project">
                    Projekt <span className="text-destructive">*</span>
                  </Label>
                  <button
                    onClick={() => setShowProjectSearch(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-muted transition-colors text-left"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      {selectedProject ? (
                        <>
                          <p className="text-sm truncate">
                            {selectedProject.code} - {selectedProject.name}
                          </p>
                          {selectedProject.phase && (
                            <p className="text-xs text-muted-foreground truncate">
                              {selectedProject.phase}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Projekt suchen...</p>
                      )}
                    </div>
                  </button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Aufgabe/Tätigkeit</Label>
                  <Select value={activityType} onValueChange={(v: ActivityType) => setActivityType(v)}>
                    <SelectTrigger id="activity">
                      <SelectValue placeholder="Tätigkeit wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Tracking */}
              <div className="space-y-4">
                <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Zeiterfassung
                </h4>

                <RadioGroup value={inputMethod} onValueChange={(v: TimeInputMethod) => setInputMethod(v)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="duration" id="method-duration" />
                      <Label htmlFor="method-duration">Dauer eingeben</Label>
                    </div>

                    {inputMethod === 'duration' && (
                      <div className="pl-6 grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="hours">Stunden</Label>
                          <Input
                            id="hours"
                            type="number"
                            min="0"
                            max="24"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="minutes">Minuten</Label>
                          <Input
                            id="minutes"
                            type="number"
                            min="0"
                            max="59"
                            step="15"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="start-end" id="method-startend" />
                      <Label htmlFor="method-startend">Von/Bis eingeben</Label>
                    </div>

                    {inputMethod === 'start-end' && (
                      <div className="pl-6 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="start-time">Von</Label>
                            <Input
                              id="start-time"
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-time">Bis</Label>
                            <Input
                              id="end-time"
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                            />
                          </div>
                        </div>
                        {startTime && endTime && (
                          <p className="text-sm text-muted-foreground">
                            Dauer: {duration.toFixed(2)} Stunden
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  Details
                </h4>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Beschreibung <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Was wurde gemacht?"
                    className="resize-none h-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length} Zeichen (min. 10)
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="billable"
                      checked={isBillable}
                      onCheckedChange={(checked) => setIsBillable(!!checked)}
                    />
                    <Label htmlFor="billable">Abrechenbar (Billable)</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="overtime"
                      checked={isOvertime}
                      onCheckedChange={(checked) => setIsOvertime(!!checked)}
                    />
                    <Label htmlFor="overtime">Überstunden</Label>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {duration > 10 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Eintrag über 10 Stunden. Bitte prüfen Sie die Angaben.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button variant="outline" onClick={() => handleSubmit(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Als Entwurf
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Search */}
      <ProjectSearchDialog
        open={showProjectSearch}
        onOpenChange={setShowProjectSearch}
        onSelectProject={setSelectedProject}
      />
    </>
  );
}

// Mobile Time Entry Form
export interface MobileTimeEntryFormProps {
  onSave: (entry: Partial<TimeEntry>, isDraft: boolean) => void;
  onCancel: () => void;
}

export function MobileTimeEntryForm({ onSave, onCancel }: MobileTimeEntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[0]);
  const [hours, setHours] = useState('2');
  const [minutes, setMinutes] = useState('30');
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('12:00');
  const [useStartEnd, setUseStartEnd] = useState(false);
  const [description, setDescription] = useState('');
  const [isBillable, setIsBillable] = useState(true);

  const duration = useStartEnd
    ? calculateDuration(startTime, endTime)
    : parseDuration(hours, minutes);

  const handleSave = () => {
    if (!selectedProject || !description || description.length < 10) {
      toast.error('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    const entryData: Partial<TimeEntry> = {
      date,
      projectId: selectedProject.id,
      duration,
      startTime: useStartEnd ? startTime : undefined,
      endTime: useStartEnd ? endTime : undefined,
      description,
      isBillable,
      status: 'submitted',
    };

    onSave(entryData, false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-card" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Neuer Zeiteintrag
          </h2>
          <div className="w-8" />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="p-4 space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date-mobile">Wann?</Label>
            <Input
              id="date-mobile"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Project */}
          <div className="space-y-2">
            <Label htmlFor="project-mobile">
              Projekt <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedProject?.id}
              onValueChange={(id) =>
                setSelectedProject(mockProjects.find((p) => p.id === id) || null)
              }
            >
              <SelectTrigger id="project-mobile">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProject?.phase && (
              <p className="text-xs text-muted-foreground pl-3">{selectedProject.phase}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label>Wie lange?</Label>

            {!useStartEnd ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="text-center text-2xl h-16"
                  />
                  <p className="text-xs text-center text-muted-foreground">Std.</p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="15"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="text-center text-2xl h-16"
                  />
                  <p className="text-xs text-center text-muted-foreground">Min.</p>
                </div>
              </div>
            ) : null}

            <p className="text-xs text-center text-muted-foreground">oder</p>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="start-mobile" className="text-xs">
                    Von:
                  </Label>
                  <Input
                    id="start-mobile"
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setUseStartEnd(true);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-mobile" className="text-xs">
                    Bis:
                  </Label>
                  <Input
                    id="end-mobile"
                    type="time"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setUseStartEnd(true);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-center text-muted-foreground">
              Gesamt: {duration.toFixed(2)} Stunden
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="desc-mobile">
              Was wurde gemacht? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="desc-mobile"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibung..."
              className="resize-none h-24"
            />
            <p className="text-xs text-muted-foreground">{description.length} / min. 10</p>
          </div>

          {/* Billable */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="billable-mobile"
              checked={isBillable}
              onCheckedChange={(checked) => setIsBillable(!!checked)}
            />
            <Label htmlFor="billable-mobile">Abrechenbar</Label>
          </div>

          {/* Save */}
          <div className="pb-6">
            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Quick Templates Component
export function QuickTemplatesCard() {
  const frequentTemplates = mockTemplates.filter((t) => t.isFrequent);

  return (
    <Card>
      <CardHeader>
        <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
          Vorlagen
        </h4>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">📌 Häufig verwendet</p>
          <div className="space-y-2">
            {frequentTemplates.map((template) => (
              <button
                key={template.id}
                className="w-full text-left p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{template.name}</span>
                  <Badge variant="secondary">{template.duration}h</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <Plus className="h-3 w-3 mr-2" />
          Vorlage erstellen
        </Button>
      </CardContent>
    </Card>
  );
}

// Demo Component
export function TimeEntryFormDemo() {
  const [showDesktopForm, setShowDesktopForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

  const handleSave = (entry: Partial<TimeEntry>, isDraft: boolean) => {
    const project = mockProjects.find((p) => p.id === entry.projectId);
    const statusText = isDraft ? 'als Entwurf gespeichert' : 'erfolgreich gespeichert';

    toast.success(`Zeiteintrag ${statusText}`, {
      description: `${entry.duration?.toFixed(2)}h für ${project?.name} - ${entry.description}`,
    });

    setShowDesktopForm(false);
    setShowMobileForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Zeiteintragsformular</h2>
        <p className="text-sm text-muted-foreground">
          Umfassendes Zeiterfassungsformular mit flexiblen Eingabemethoden (Dauer oder
          Start/Ende), Projektsuche, Aktivitätstypen, Vorlagen und Abrechnungskennzeichnung
        </p>
      </div>

      {/* Form Launchers */}
      <Card>
        <CardHeader>
          <h3>Demo-Modus</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowDesktopForm(true)}>
              Desktop-Formular öffnen
            </Button>
            <Button variant="outline" onClick={() => setShowMobileForm(true)}>
              Mobile-Formular öffnen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Types */}
      <Card>
        <CardHeader>
          <h3>Tätigkeitsarten</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vordefinierte Kategorien für Zeiteinträge
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {activityTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center gap-2 p-3 border rounded-lg"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{type.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <QuickTemplatesCard />

      {/* Input Methods */}
      <Card>
        <CardHeader>
          <h3>Eingabemethoden</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Flexible Zeiterfassung mit verschiedenen Eingabemöglichkeiten
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <h4 className="text-sm mb-3" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Dauer eingeben
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Direkte Eingabe von Stunden und Minuten
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-3 bg-muted rounded">
                  <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                    2
                  </p>
                  <p className="text-xs text-muted-foreground">Std.</p>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                    30
                  </p>
                  <p className="text-xs text-muted-foreground">Min.</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
              <h4 className="text-sm mb-3" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                Von/Bis eingeben
              </h4>
              <p className="text-xs text-muted-foreground mb-3">
                Start- und Endzeit mit automatischer Berechnung
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">09:30 - 12:00</span>
                </div>
                <div className="text-sm text-muted-foreground">→ 2,5 Stunden</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <h3>Features & Funktionen</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Flexible Zeiteingabe:</strong> Dauer oder Start/Ende-Zeit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Projektsuche:</strong> Schnelle Suche mit Favoriten und aktiven Projekten
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Aktivitätstypen:</strong> 8 vordefinierte Kategorien
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Abrechnungskennzeichnung:</strong> Billable/Non-billable mit Projektstandard
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Überstunden-Flag:</strong> Separate Kennzeichnung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Entwurf-Modus:</strong> Speichern und später vervollständigen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Validierung:</strong> Min/Max Stunden, Beschreibungslänge, Zukunftsdaten
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
            <div>
              <strong>Vorlagen:</strong> Häufig verwendete Einträge für schnelle Erfassung
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className="bg-muted">
        <CardHeader>
          <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
            Validierungsregeln
          </h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Datum kann nicht in der Zukunft liegen</p>
          <p>• Dauer zwischen 0,25 und 24 Stunden</p>
          <p>• Beschreibung mindestens 10 Zeichen</p>
          <p>• Projekt ist Pflichtfeld</p>
          <p>• Warnung bei Einträgen über 10 Stunden</p>
          <p>• Automatische Berechnung aus Start/Ende-Zeit</p>
          <p>• Billable-Status aus Projekteinstellungen</p>
        </CardContent>
      </Card>

      {/* Desktop Form */}
      <DesktopTimeEntryForm
        open={showDesktopForm}
        onOpenChange={setShowDesktopForm}
        onSave={handleSave}
      />

      {/* Mobile Form */}
      {showMobileForm && (
        <Dialog open={showMobileForm} onOpenChange={setShowMobileForm}>
          <DialogContent className="sm:max-w-[375px] h-[90vh] p-0">
            <MobileTimeEntryForm
              onSave={handleSave}
              onCancel={() => setShowMobileForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}