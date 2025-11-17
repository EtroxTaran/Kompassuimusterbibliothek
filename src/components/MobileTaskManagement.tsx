import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import {
  ListTodo,
  BarChart3,
  FolderKanban,
  MessageSquare,
  User,
  Plus,
  Search,
  Menu,
  Calendar,
  Flag,
  Link as LinkIcon,
  ChevronLeft,
  MoreVertical,
  Check,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  Mic,
  X,
  Filter,
  Building2,
  TrendingUp,
  WifiOff,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

// Task types
type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  isOverdue?: boolean;
  context?: {
    type: 'customer' | 'opportunity' | 'project';
    name: string;
  };
  createdBy: string;
  createdAt: Date;
  isLocalOnly?: boolean; // Not synced yet
}

// Mock tasks
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Call Hofladen Müller',
    description: 'Customer wants to confirm installation date for next month. Discuss timeline.',
    status: 'open',
    priority: 'urgent',
    dueDate: new Date('2025-02-05'),
    isOverdue: true,
    context: {
      type: 'customer',
      name: 'Hofladen Müller GmbH',
    },
    createdBy: 'Michael Schmidt',
    createdAt: new Date('2025-01-28T15:30:00'),
  },
  {
    id: '2',
    title: 'Review supplier quotes',
    description: 'Compare quotes from 3 suppliers for kitchen equipment',
    status: 'open',
    priority: 'high',
    dueDate: new Date(),
    context: {
      type: 'project',
      name: 'Admin',
    },
    createdBy: 'Michael Schmidt',
    createdAt: new Date('2025-01-27T10:00:00'),
  },
  {
    id: '3',
    title: 'Update project report',
    description: 'Monthly progress report for Schmidt project',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(),
    context: {
      type: 'project',
      name: 'Schmidt Project',
    },
    createdBy: 'Michael Schmidt',
    createdAt: new Date('2025-01-26T09:00:00'),
  },
  {
    id: '4',
    title: 'Create technical drawings',
    description: 'Floor plans and elevation drawings',
    status: 'open',
    priority: 'medium',
    dueDate: new Date('2025-02-15'),
    context: {
      type: 'project',
      name: 'Hofladen Proj',
    },
    createdBy: 'Michael Schmidt',
    createdAt: new Date('2025-01-25T14:00:00'),
  },
];

// Get priority color
function getPriorityColor(priority: TaskPriority) {
  switch (priority) {
    case 'critical':
    case 'urgent':
      return 'text-red-600 bg-red-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'medium':
      return 'text-blue-600 bg-blue-100';
    case 'low':
      return 'text-gray-600 bg-gray-100';
  }
}

// Get priority label
function getPriorityLabel(priority: TaskPriority) {
  switch (priority) {
    case 'critical':
      return 'KRITISCH';
    case 'urgent':
      return 'DRINGEND';
    case 'high':
      return 'HOCH';
    case 'medium':
      return 'MITTEL';
    case 'low':
      return 'NIEDRIG';
  }
}

// Get priority icon
function getPriorityIcon(priority: TaskPriority) {
  switch (priority) {
    case 'critical':
    case 'urgent':
      return '🔴';
    case 'high':
      return '🟠';
    case 'medium':
      return '🔵';
    case 'low':
      return '⚪';
  }
}

// Format date
function formatDueDate(date: Date | undefined): string {
  if (!date) return 'No due date';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  
  const diff = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < -1) return `${Math.abs(diff)} days overdue`;
  if (diff < 7) return `In ${diff} days`;
  
  return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' }).format(date);
}

// Swipeable Task Card
function SwipeableTaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  onClick,
}: {
  task: Task;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Background colors based on swipe direction and distance
  const backgroundColor = useTransform(x, [-150, -80, 0, 80, 150], [
    'rgb(239, 68, 68)', // Red (delete)
    'rgb(59, 130, 246)', // Blue (edit)
    'rgb(249, 250, 251)', // Default
    'rgb(16, 185, 129)', // Green (complete)
    'rgb(16, 185, 129)', // Green (complete)
  ]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 80;
    
    if (info.offset.x > threshold) {
      // Swipe right - complete
      onComplete();
    } else if (info.offset.x < -threshold && info.offset.x > -150) {
      // Swipe left (medium) - edit
      onEdit();
    } else if (info.offset.x <= -150) {
      // Swipe left (far) - delete
      onDelete();
    }
    
    // Reset position
    x.set(0);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background Layer with Icons */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-6"
        style={{ backgroundColor }}
      >
        {/* Right side - Complete */}
        <div className="flex items-center gap-2 text-white">
          <Check className="h-6 w-6" />
          <span className="font-medium">Erledigt</span>
        </div>
        
        {/* Left side - Actions */}
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <span className="font-medium">Bearbeiten</span>
            <Edit2 className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Löschen</span>
            <Trash2 className="h-5 w-5" />
          </div>
        </div>
      </motion.div>

      {/* Card Layer */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        style={{ x }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="relative"
      >
        <Card 
          onClick={() => !isDragging && onClick()} 
          className="cursor-pointer hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Priority Badge */}
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getPriorityColor(task.priority)}`}>
                <span className="text-xl">{getPriorityIcon(task.priority)}</span>
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    {task.isOverdue && (
                      <Badge className="bg-red-100 text-red-800 mb-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        ÜBERFÄLLIG
                      </Badge>
                    )}
                    <p className={`mb-1 ${task.isOverdue ? 'text-red-600' : ''}`}>
                      {task.title}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {getPriorityLabel(task.priority)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>📋 {task.context?.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDueDate(task.dueDate)}
                  </span>
                  {task.isLocalOnly && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        Nicht synchronisiert
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Quick Add Task Sheet
function QuickAddSheet({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Partial<Task>) => void;
}) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Bitte geben Sie einen Aufgabentitel ein');
      return;
    }

    onAdd({
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: 'open',
    });

    // Reset form
    setTitle('');
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    toast.info('Spracherkennung aktiviert...', {
      description: 'Sprechen Sie jetzt',
    });

    // Simulate voice input
    setTimeout(() => {
      setIsListening(false);
      setTitle('Call customer about installation date');
      toast.success('Spracheingabe erfolgreich');
    }, 2000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh] p-0 border-0 rounded-t-xl">
        {/* Handle Bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-muted-foreground/20 rounded-full" />
        </div>

        <div className="px-6 pb-6">
          <SheetHeader className="mb-6">
            <SheetTitle>Schnell Aufgabe hinzufügen</SheetTitle>
          </SheetHeader>

          {/* Voice Input State */}
          {isListening && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <Mic className="h-8 w-8 mx-auto mb-2 text-blue-600 animate-pulse" />
              <p className="text-blue-900 mb-1">🎤 Höre zu...</p>
              <div className="flex justify-center gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-blue-600 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsListening(false)}>
                Abbrechen
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <Label htmlFor="task-title">Was muss erledigt werden?</Label>
              <div className="relative mt-2">
                <Input
                  id="task-title"
                  placeholder="z.B. Kunde wegen Termin anrufen"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pr-12"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={handleVoiceInput}
                  disabled={isListening}
                >
                  <Mic className={`h-4 w-4 ${isListening ? 'text-blue-600' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              {/* Date Picker */}
              <div>
                <Label className="text-muted-foreground mb-2 block text-center">Datum</Label>
                <Button
                  variant="outline"
                  className="w-full h-16 flex flex-col items-center justify-center gap-1"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setDueDate(today);
                  }}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">{dueDate ? 'Gesetzt' : 'Datum'}</span>
                </Button>
              </div>

              {/* Priority Picker */}
              <div>
                <Label className="text-muted-foreground mb-2 block text-center">Priorität</Label>
                <Button
                  variant="outline"
                  className="w-full h-16 flex flex-col items-center justify-center gap-1"
                  onClick={() => {
                    const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
                    const currentIndex = priorities.indexOf(priority);
                    const nextIndex = (currentIndex + 1) % priorities.length;
                    setPriority(priorities[nextIndex]);
                  }}
                >
                  <Flag className={`h-5 w-5 ${
                    priority === 'urgent' || priority === 'critical' ? 'text-red-600' :
                    priority === 'high' ? 'text-orange-600' :
                    priority === 'medium' ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <span className="text-xs capitalize">{priority === 'urgent' ? 'Dringend' : priority === 'high' ? 'Hoch' : priority === 'medium' ? 'Mittel' : 'Niedrig'}</span>
                </Button>
              </div>

              {/* Link Entity */}
              <div>
                <Label className="text-muted-foreground mb-2 block text-center">Verknüpfen</Label>
                <Button
                  variant="outline"
                  className="w-full h-16 flex flex-col items-center justify-center gap-1"
                  onClick={() => toast.info('Entität-Verknüpfung öffnen...')}
                >
                  <LinkIcon className="h-5 w-5" />
                  <span className="text-xs">Link</span>
                </Button>
              </div>
            </div>

            {/* Create Button */}
            <Button className="w-full" size="lg" onClick={handleCreate}>
              Aufgabe erstellen
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Task Detail View
function TaskDetailView({
  task,
  isOpen,
  onClose,
  onUpdate,
  onComplete,
}: {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onComplete: () => void;
}) {
  if (!task) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] p-0 border-0 rounded-t-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronLeft className="h-5 w-5 mr-1" />
            Zurück
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(90vh-140px)] p-6">
          {/* Title & Priority */}
          <div className="mb-6">
            <Badge className={`${getPriorityColor(task.priority)} mb-3`}>
              {getPriorityLabel(task.priority)}
            </Badge>
            <h2 className="mb-2">{task.title}</h2>
          </div>

          {/* Details Section */}
          <div className="mb-6">
            <h3 className="mb-3">Details</h3>
            <div className="space-y-4">
              {task.description && (
                <div>
                  <Label className="text-muted-foreground">Beschreibung</Label>
                  <p className="mt-1">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Select defaultValue={task.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Offen</SelectItem>
                      <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                      <SelectItem value="completed">Erledigt</SelectItem>
                      <SelectItem value="cancelled">Abgebrochen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-muted-foreground">Priorität</Label>
                  <Select defaultValue={task.priority}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niedrig</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="high">Hoch</SelectItem>
                      <SelectItem value="urgent">Dringend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {task.dueDate && (
                <div>
                  <Label className="text-muted-foreground">Fälligkeitsdatum</Label>
                  <div className="flex items-center gap-2 mt-1 p-3 bg-muted rounded-lg">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Intl.DateTimeFormat('de-DE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(task.dueDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Context Section */}
          {task.context && (
            <>
              <div className="mb-6">
                <h3 className="mb-3">Kontext</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    {task.context.type === 'customer' && <Building2 className="h-5 w-5 text-primary" />}
                    {task.context.type === 'opportunity' && <TrendingUp className="h-5 w-5 text-primary" />}
                    {task.context.type === 'project' && <FolderKanban className="h-5 w-5 text-primary" />}
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {task.context.type === 'customer' && 'Kunde'}
                        {task.context.type === 'opportunity' && 'Opportunity'}
                        {task.context.type === 'project' && 'Projekt'}
                      </p>
                      <p>{task.context.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />
            </>
          )}

          {/* Activity Section */}
          <div className="mb-6">
            <h3 className="mb-3">Aktivität</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {new Intl.DateTimeFormat('de-DE', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(task.createdAt)}
                  </p>
                  <p>Erstellt von {task.createdBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-border p-4 bg-background">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg">
              <Edit2 className="mr-2 h-4 w-4" />
              Bearbeiten
            </Button>
            <Button size="lg" onClick={onComplete}>
              <Check className="mr-2 h-4 w-4" />
              Erledigt markieren
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Filter Sheet
function FilterSheet({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onFilterChange: (filters: any) => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      status: [],
      priority: [],
      dueDate: [],
      taskType: [],
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] p-0 border-0 rounded-t-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <h3>Filter</h3>
          </div>
          <Button onClick={handleApply}>Anwenden</Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-[calc(80vh-140px)] p-6">
          {/* Status */}
          <div className="mb-6">
            <h3 className="mb-3">Status</h3>
            <div className="space-y-3">
              {[
                { value: 'open', label: 'Offen' },
                { value: 'in_progress', label: 'In Bearbeitung' },
                { value: 'completed', label: 'Erledigt' },
                { value: 'cancelled', label: 'Abgebrochen' },
              ].map((status) => (
                <label key={status.value} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={localFilters.status.includes(status.value)}
                    onCheckedChange={(checked) => {
                      setLocalFilters({
                        ...localFilters,
                        status: checked
                          ? [...localFilters.status, status.value]
                          : localFilters.status.filter((s: string) => s !== status.value),
                      });
                    }}
                  />
                  <span>{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Priority */}
          <div className="mb-6">
            <h3 className="mb-3">Priorität</h3>
            <div className="space-y-3">
              {[
                { value: 'urgent', label: 'Dringend' },
                { value: 'high', label: 'Hoch' },
                { value: 'medium', label: 'Mittel' },
                { value: 'low', label: 'Niedrig' },
              ].map((priority) => (
                <label key={priority.value} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={localFilters.priority.includes(priority.value)}
                    onCheckedChange={(checked) => {
                      setLocalFilters({
                        ...localFilters,
                        priority: checked
                          ? [...localFilters.priority, priority.value]
                          : localFilters.priority.filter((p: string) => p !== priority.value),
                      });
                    }}
                  />
                  <span>{priority.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Due Date */}
          <div className="mb-6">
            <h3 className="mb-3">Fälligkeitsdatum</h3>
            <div className="space-y-3">
              {[
                { value: 'overdue', label: 'Überfällig' },
                { value: 'today', label: 'Heute' },
                { value: 'thisWeek', label: 'Diese Woche' },
                { value: 'thisMonth', label: 'Dieser Monat' },
                { value: 'noDueDate', label: 'Kein Fälligkeitsdatum' },
              ].map((dueDate) => (
                <label key={dueDate.value} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={localFilters.dueDate.includes(dueDate.value)}
                    onCheckedChange={(checked) => {
                      setLocalFilters({
                        ...localFilters,
                        dueDate: checked
                          ? [...localFilters.dueDate, dueDate.value]
                          : localFilters.dueDate.filter((d: string) => d !== dueDate.value),
                      });
                    }}
                  />
                  <span>{dueDate.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Task Type */}
          <div className="mb-6">
            <h3 className="mb-3">Aufgabentyp</h3>
            <div className="space-y-3">
              {[
                { value: 'personal', label: 'Persönliche Aufgaben' },
                { value: 'project', label: 'Projekt-Aufgaben' },
              ].map((type) => (
                <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={localFilters.taskType.includes(type.value)}
                    onCheckedChange={(checked) => {
                      setLocalFilters({
                        ...localFilters,
                        taskType: checked
                          ? [...localFilters.taskType, type.value]
                          : localFilters.taskType.filter((t: string) => t !== type.value),
                      });
                    }}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-border p-4 bg-background">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleClear}>
              Alle löschen
            </Button>
            <Button onClick={handleApply}>Anwenden</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Main Mobile Task Management Component
export function MobileTaskManagement() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'dashboard' | 'projects' | 'activity' | 'me'>('tasks');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline] = useState(false);
  const [pendingChanges] = useState(0);
  const [filters, setFilters] = useState({
    status: ['open', 'in_progress'],
    priority: ['urgent', 'high'],
    dueDate: [],
    taskType: [],
  });

  // Calculate stats
  const stats = {
    open: tasks.filter((t) => t.status === 'open').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    overdue: tasks.filter((t) => t.isOverdue).length,
    thisWeek: tasks.filter((t) => {
      if (!t.dueDate) return false;
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return t.dueDate <= weekFromNow;
    }).length,
  };

  // Group tasks by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });

  const thisWeekTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return t.dueDate > today && t.dueDate <= weekFromNow;
  });

  const overdueTasks = tasks.filter((t) => t.isOverdue);

  // Filter tasks
  const filteredTasks = searchQuery
    ? tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : tasks;

  // Handle task actions
  const handleComplete = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: 'completed' as TaskStatus } : t)));
    toast.success('Aufgabe als erledigt markiert');
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    toast.success('Aufgabe gelöscht');
  };

  const handleAddTask = (task: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: task.title || '',
      status: task.status || 'open',
      priority: task.priority || 'medium',
      dueDate: task.dueDate,
      createdBy: 'Michael Schmidt',
      createdAt: new Date(),
      isLocalOnly: true,
    };
    setTasks([newTask, ...tasks]);
    toast.success('Aufgabe erstellt', {
      description: 'Wird synchronisiert, wenn online',
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-amber-800" />
          <span className="text-amber-900">
            Offline • {pendingChanges} Änderungen ausstehend
          </span>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        {showSearch ? (
          <div className="flex items-center gap-2 flex-1">
            <Button variant="ghost" size="sm" onClick={() => setShowSearch(false)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Aufgaben suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
              <h2>Meine Aufgaben</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(true)}>
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'tasks' && (
          <div className="p-4 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="mb-1">{stats.open}</p>
                  <p className="text-muted-foreground">Offen</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="mb-1">{stats.inProgress}</p>
                  <p className="text-muted-foreground">Bearb.</p>
                </CardContent>
              </Card>
              <Card className={stats.overdue > 0 ? 'border-red-200' : ''}>
                <CardContent className="p-3 text-center">
                  <p className={`mb-1 ${stats.overdue > 0 ? 'text-red-600' : ''}`}>
                    {stats.overdue}
                  </p>
                  <p className="text-muted-foreground">Überfällig</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="mb-1">{stats.thisWeek}</p>
                  <p className="text-muted-foreground">Woche</p>
                </CardContent>
              </Card>
            </div>

            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Separator className="flex-1" />
                  <span className="text-muted-foreground">Überfällig ({overdueTasks.length})</span>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-3">
                  {overdueTasks.map((task) => (
                    <SwipeableTaskCard
                      key={task.id}
                      task={task}
                      onComplete={() => handleComplete(task.id)}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task.id)}
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskDetail(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Today Tasks */}
            {todayTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Separator className="flex-1" />
                  <span className="text-muted-foreground">Heute ({todayTasks.length})</span>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <SwipeableTaskCard
                      key={task.id}
                      task={task}
                      onComplete={() => handleComplete(task.id)}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task.id)}
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskDetail(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* This Week Tasks */}
            {thisWeekTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Separator className="flex-1" />
                  <span className="text-muted-foreground">Diese Woche ({thisWeekTasks.length})</span>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-3">
                  {thisWeekTasks.map((task) => (
                    <SwipeableTaskCard
                      key={task.id}
                      task={task}
                      onComplete={() => handleComplete(task.id)}
                      onEdit={() => handleEdit(task)}
                      onDelete={() => handleDelete(task.id)}
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskDetail(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <div className="text-center py-16">
                <ListTodo className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Keine Aufgaben gefunden</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Versuchen Sie einen anderen Suchbegriff' : 'Erstellen Sie Ihre erste Aufgabe'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowQuickAdd(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Aufgabe erstellen
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'dashboard' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Dashboard</h3>
              <p className="text-muted-foreground">Aufgaben-Übersicht und Metriken</p>
            </div>
          </div>
        )}
        {activeTab === 'projects' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Projekte</h3>
              <p className="text-muted-foreground">Projekt-Aufgaben Boards</p>
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Aktivität</h3>
              <p className="text-muted-foreground">Aktuelle Updates und Benachrichtigungen</p>
            </div>
          </div>
        )}
        {activeTab === 'me' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Profil</h3>
              <p className="text-muted-foreground">Profil und Einstellungen</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        onClick={() => setShowQuickAdd(true)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Bottom Tab Navigation */}
      <div className="bg-background border-t border-border px-2 py-2">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            className={`flex-col h-auto py-2 px-4 ${
              activeTab === 'tasks' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            <ListTodo className="h-5 w-5 mb-1" />
            <span className="text-xs">Aufgaben</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto py-2 px-4 ${
              activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto py-2 px-4 ${
              activeTab === 'projects' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            <FolderKanban className="h-5 w-5 mb-1" />
            <span className="text-xs">Projekte</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto py-2 px-4 ${
              activeTab === 'activity' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('activity')}
          >
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs">Aktivität</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-col h-auto py-2 px-4 ${
              activeTab === 'me' ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('me')}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Ich</span>
          </Button>
        </div>
      </div>

      {/* Modals/Sheets */}
      <QuickAddSheet isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} onAdd={handleAddTask} />
      <TaskDetailView
        task={selectedTask}
        isOpen={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        onUpdate={(task) => {
          setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
          toast.success('Aufgabe aktualisiert');
        }}
        onComplete={() => {
          if (selectedTask) handleComplete(selectedTask.id);
          setShowTaskDetail(false);
        }}
      />
      <FilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}

// Demo Component
export function MobileTaskManagementDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4">Mobile Aufgabenverwaltung</h2>
          <p className="text-muted-foreground mb-6">
            Mobile PWA-Komponente mit Swipe-Aktionen, FAB, Sprachsteuerung, Offline-Unterstützung
            und Bottom-Tab-Navigation
          </p>

          <div>
            <h3 className="mb-3">Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Bottom Tab Navigation (5 Tabs)</li>
              <li>• Swipe Right → Aufgabe erledigt (grün)</li>
              <li>• Swipe Left → Bearbeiten/Löschen (blau/rot)</li>
              <li>• Floating Action Button (FAB) für schnelles Hinzufügen</li>
              <li>• Sprachsteuerung mit Mikrofon-Button</li>
              <li>• Offline-Banner mit ausstehenden Änderungen</li>
              <li>• Schnellansicht-Widgets (Offen, Bearbeitung, Überfällig, Woche)</li>
              <li>• Aufgaben gruppiert nach Heute/Diese Woche/Überfällig</li>
              <li>• Vollbild-Aufgabendetails mit Bearbeitung</li>
              <li>• Umfassende Filter-Modal</li>
              <li>• Echtzeit-Suche</li>
              <li>• Prioritätsindikatoren mit Farben</li>
              <li>• Kontext-Verknüpfung (Kunde/Opportunity/Projekt)</li>
              <li>• Local-Only Badges für nicht synchronisierte Aufgaben</li>
              <li>• Touch-freundliche Ziele (44px minimum)</li>
              <li>• Smooth Animations mit Motion</li>
              <li>• Dark Mode Ready</li>
            </ul>
          </div>

          <Separator className="my-6" />

          <div className="max-w-sm mx-auto border border-border rounded-lg overflow-hidden shadow-xl">
            <MobileTaskManagement />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
