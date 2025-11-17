import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  Calendar as CalendarIcon,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertCircle,
  Search,
  Briefcase,
  Users,
  Target,
  Building,
} from 'lucide-react';

// Task types
type TaskType = 'user_task' | 'project_task';
type FormMode = 'create' | 'edit';
type ViewMode = 'quick' | 'full';

type UserTaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
type ProjectTaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
type UserTaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type ProjectTaskPriority = 'low' | 'medium' | 'high' | 'critical';

interface UserTaskFormData {
  title: string;
  description: string;
  status: UserTaskStatus;
  priority: UserTaskPriority;
  dueDate: Date | null;
  assignedTo: string;
  relatedCustomerId: string | null;
  relatedOpportunityId: string | null;
  relatedProjectId: string | null;
}

interface ProjectTaskFormData {
  title: string;
  description: string;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  dueDate: Date | null;
  assignedTo: string;
  projectId: string;
  phase: string | null;
  milestone: string | null;
  blockingReason: string;
}

type TaskFormData = UserTaskFormData | ProjectTaskFormData;

interface TaskFormProps {
  mode: FormMode;
  taskType: TaskType;
  initialData?: Partial<TaskFormData>;
  projectId?: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: (taskId: string) => Promise<void>;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
  open: boolean;
}

// Mock data
const mockUsers = [
  { id: 'user-1', name: 'Ich (You)', avatar: 'ME', role: 'ADM' },
  { id: 'user-2', name: 'Anna Weber', avatar: 'AW', role: 'PLAN' },
  { id: 'user-3', name: 'Thomas Fischer', avatar: 'TF', role: 'PLAN' },
  { id: 'user-4', name: 'Maria Schmidt', avatar: 'MS', role: 'KALK' },
];

const mockCustomers = [
  { id: 'cust-1', name: 'REWE München Süd' },
  { id: 'cust-2', name: 'Hofladen Müller GmbH' },
  { id: 'cust-3', name: 'Bäckerei Schmidt' },
];

const mockOpportunities = [
  { id: 'opp-1', name: 'Ladeneinrichtung REWE', customerId: 'cust-1' },
  { id: 'opp-2', name: 'Kühlsysteme Hofladen', customerId: 'cust-2' },
];

const mockProjects = [
  { id: 'proj-1', name: 'P-2024-B023 - REWE München Süd' },
  { id: 'proj-2', name: 'P-2024-M012 - Hofladen Müller Ladenbau' },
];

const mockMilestones = [
  { id: 'ms-1', name: 'Design Approval' },
  { id: 'ms-2', name: 'Installation Complete' },
  { id: 'ms-3', name: 'Final Inspection' },
];

// Format date
function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Validation
function validateTitle(title: string): string | null {
  if (!title.trim()) return 'Titel ist erforderlich';
  if (title.length < 5) return 'Titel muss mindestens 5 Zeichen lang sein';
  if (title.length > 200) return 'Titel darf maximal 200 Zeichen lang sein';
  if (!/^[a-zA-ZäöüÄÖÜß0-9\s\.\-&(),!?]+$/.test(title)) {
    return 'Titel enthält ungültige Zeichen';
  }
  return null;
}

function validateDescription(description: string): string | null {
  if (description.length > 2000) return 'Beschreibung darf maximal 2000 Zeichen lang sein';
  return null;
}

function validateBlockingReason(reason: string, isBlocked: boolean): string | null {
  if (!isBlocked) return null;
  if (!reason.trim()) return 'Blockierungsgrund ist erforderlich wenn Aufgabe blockiert ist';
  if (reason.length < 10) return 'Blockierungsgrund muss mindestens 10 Zeichen lang sein';
  if (reason.length > 500) return 'Blockierungsgrund darf maximal 500 Zeichen lang sein';
  return null;
}

export function TaskForm({
  mode,
  taskType,
  initialData,
  projectId,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  errors = {},
  open,
}: TaskFormProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('quick');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [characterCounts, setCharacterCounts] = useState({ title: 0, description: 0 });

  // User Task Form State
  const [userTaskData, setUserTaskData] = useState<UserTaskFormData>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    dueDate: null,
    assignedTo: 'user-1',
    relatedCustomerId: null,
    relatedOpportunityId: null,
    relatedProjectId: null,
  });

  // Project Task Form State
  const [projectTaskData, setProjectTaskData] = useState<ProjectTaskFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    assignedTo: '',
    projectId: projectId || '',
    phase: null,
    milestone: null,
    blockingReason: '',
  });

  const formData = taskType === 'user_task' ? userTaskData : projectTaskData;

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      if (taskType === 'user_task') {
        setUserTaskData((prev) => ({ ...prev, ...initialData }));
      } else {
        setProjectTaskData((prev) => ({ ...prev, ...initialData }));
      }
    }
  }, [initialData, taskType]);

  // Track character counts
  useEffect(() => {
    setCharacterCounts({
      title: formData.title.length,
      description: formData.description.length,
    });
  }, [formData.title, formData.description]);

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setHasChanges(true);
    if (taskType === 'user_task') {
      setUserTaskData((prev) => ({ ...prev, [field]: value }));
    } else {
      setProjectTaskData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear field error on change
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const titleError = validateTitle(formData.title);
    if (titleError) errors.title = titleError;

    const descError = validateDescription(formData.description);
    if (descError) errors.description = descError;

    if (taskType === 'project_task') {
      const projData = formData as ProjectTaskFormData;
      if (!projData.assignedTo) {
        errors.assignedTo = 'Bitte wählen Sie einen Bearbeiter';
      }

      const blockingError = validateBlockingReason(
        projData.blockingReason,
        projData.status === 'blocked'
      );
      if (blockingError) errors.blockingReason = blockingError;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Validierungsfehler', {
        description: 'Bitte beheben Sie die Fehler im Formular',
      });
      return;
    }

    try {
      await onSubmit(formData);
      toast.success(
        mode === 'create' ? 'Aufgabe erstellt' : 'Aufgabe aktualisiert',
        {
          description: formData.title,
        }
      );
      setHasChanges(false);
    } catch (error) {
      toast.error('Fehler', {
        description: 'Aufgabe konnte nicht gespeichert werden',
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (onDelete && initialData) {
      try {
        await onDelete('task-id');
        toast.success('Aufgabe gelöscht');
        setShowDeleteConfirm(false);
        onCancel();
      } catch (error) {
        toast.error('Fehler', {
          description: 'Aufgabe konnte nicht gelöscht werden',
        });
      }
    }
  };

  // Set due date quick actions
  const setDueDateQuick = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    handleFieldChange('dueDate', date);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === 'edit' ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}</DialogTitle>
            <DialogDescription>
              {taskType === 'user_task'
                ? 'Persönliche To-Do für Follow-ups und Erinnerungen'
                : 'Projekt-Aufgabe für Lieferungen und Meilensteine'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Info (ProjectTask only) */}
            {taskType === 'project_task' && (
              <div className="space-y-2">
                <Label>
                  Projekt <span className="text-red-600">*</span>
                </Label>
                <div className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {mockProjects.find((p) => p.id === projectTaskData.projectId)?.name ||
                      'Hofladen Müller Ladenbau'}
                  </span>
                </div>
                <p className="text-muted-foreground">Schreibgeschützt (aus Kontext übernommen)</p>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Titel <span className="text-red-600">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                onBlur={() => {
                  const error = validateTitle(formData.title);
                  if (error) setFormErrors((prev) => ({ ...prev, title: error }));
                }}
                placeholder={
                  taskType === 'user_task'
                    ? 'Hofladen Müller wegen Liefertermin anrufen...'
                    : 'Technische Zeichnungen für Ladenlayout erstellen...'
                }
                className={formErrors.title ? 'border-red-600' : ''}
                autoFocus
              />
              <div className="flex items-center justify-between">
                {formErrors.title && (
                  <p className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.title}
                  </p>
                )}
                <p className="text-muted-foreground ml-auto">{characterCounts.title}/200</p>
              </div>
            </div>

            {/* Description (Full mode only) */}
            {viewMode === 'full' && (
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  onBlur={() => {
                    const error = validateDescription(formData.description);
                    if (error) setFormErrors((prev) => ({ ...prev, description: error }));
                  }}
                  placeholder="Weitere Details zu dieser Aufgabe hinzufügen..."
                  className={formErrors.description ? 'border-red-600' : ''}
                />
                <div className="flex items-center justify-between">
                  {formErrors.description && (
                    <p className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.description}
                    </p>
                  )}
                  <p className="text-muted-foreground ml-auto">
                    {characterCounts.description}/2000
                  </p>
                </div>
              </div>
            )}

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleFieldChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskType === 'user_task' ? (
                      <>
                        <SelectItem value="open">Offen</SelectItem>
                        <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                        <SelectItem value="completed">Erledigt</SelectItem>
                        <SelectItem value="cancelled">Abgebrochen</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Fertig</SelectItem>
                        <SelectItem value="blocked">Blockiert</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priorität <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleFieldChange('priority', value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niedrig</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="high">Hoch</SelectItem>
                    {taskType === 'user_task' ? (
                      <SelectItem value="urgent">Dringend</SelectItem>
                    ) : (
                      <SelectItem value="critical">Kritisch</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date and Assigned To */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Fälligkeitsdatum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? formatDate(formData.dueDate) : 'Datum wählen'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 space-y-2 border-b border-border">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setDueDateQuick(0)}
                      >
                        Heute
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setDueDateQuick(1)}
                      >
                        Morgen
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setDueDateQuick(7)}
                      >
                        Nächste Woche
                      </Button>
                      {formData.dueDate && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full justify-start text-red-600"
                          onClick={() => handleFieldChange('dueDate', null)}
                        >
                          Löschen
                        </Button>
                      )}
                    </div>
                    <Calendar
                      mode="single"
                      selected={formData.dueDate || undefined}
                      onSelect={(date) => handleFieldChange('dueDate', date)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">
                  Zugewiesen an
                  {taskType === 'project_task' && <span className="text-red-600"> *</span>}
                </Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) => handleFieldChange('assignedTo', value)}
                >
                  <SelectTrigger
                    id="assignedTo"
                    className={formErrors.assignedTo ? 'border-red-600' : ''}
                  >
                    <SelectValue placeholder="Benutzer wählen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {user.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.assignedTo && (
                  <p className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.assignedTo}
                  </p>
                )}
                {taskType === 'user_task' && (
                  <p className="text-muted-foreground">
                    Nur GF und PLAN können an andere zuweisen
                  </p>
                )}
              </div>
            </div>

            {/* Show More Options Toggle */}
            {viewMode === 'quick' && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setViewMode('full')}
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                Weitere Optionen anzeigen...
              </Button>
            )}

            {/* Full Mode Fields */}
            {viewMode === 'full' && (
              <>
                <Separator />

                {/* UserTask: Related Entities */}
                {taskType === 'user_task' && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Verknüpfte Entitäten</h3>

                    {/* Customer */}
                    <div className="space-y-2">
                      <Label htmlFor="customer">Kunde</Label>
                      <Select
                        value={userTaskData.relatedCustomerId || ''}
                        onValueChange={(value) =>
                          handleFieldChange('relatedCustomerId', value || null)
                        }
                      >
                        <SelectTrigger id="customer">
                          <SelectValue placeholder="Kunde auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Kein Kunde</SelectItem>
                          {mockCustomers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                {customer.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Opportunity */}
                    <div className="space-y-2">
                      <Label htmlFor="opportunity">Opportunity (Optional)</Label>
                      <Select
                        value={userTaskData.relatedOpportunityId || ''}
                        onValueChange={(value) =>
                          handleFieldChange('relatedOpportunityId', value || null)
                        }
                      >
                        <SelectTrigger id="opportunity">
                          <SelectValue placeholder="Opportunity auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Keine Opportunity</SelectItem>
                          {mockOpportunities.map((opp) => (
                            <SelectItem key={opp.id} value={opp.id}>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                {opp.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Project */}
                    <div className="space-y-2">
                      <Label htmlFor="project">Projekt (Optional)</Label>
                      <Select
                        value={userTaskData.relatedProjectId || ''}
                        onValueChange={(value) =>
                          handleFieldChange('relatedProjectId', value || null)
                        }
                      >
                        <SelectTrigger id="project">
                          <SelectValue placeholder="Projekt auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Kein Projekt</SelectItem>
                          {mockProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* ProjectTask: Project Context */}
                {taskType === 'project_task' && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Projektkontext</h3>

                    {/* Phase */}
                    <div className="space-y-2">
                      <Label htmlFor="phase">Phase</Label>
                      <Select
                        value={projectTaskData.phase || ''}
                        onValueChange={(value) => handleFieldChange('phase', value || null)}
                      >
                        <SelectTrigger id="phase">
                          <SelectValue placeholder="Phase auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planung</SelectItem>
                          <SelectItem value="execution">Ausführung</SelectItem>
                          <SelectItem value="delivery">Lieferung</SelectItem>
                          <SelectItem value="closure">Abschluss</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-muted-foreground">
                        Hilft bei der Organisation nach Projektphase
                      </p>
                    </div>

                    {/* Milestone */}
                    <div className="space-y-2">
                      <Label htmlFor="milestone">Meilenstein (Optional)</Label>
                      <Select
                        value={projectTaskData.milestone || ''}
                        onValueChange={(value) => handleFieldChange('milestone', value || null)}
                      >
                        <SelectTrigger id="milestone">
                          <SelectValue placeholder="Meilenstein auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Kein Meilenstein</SelectItem>
                          {mockMilestones.map((milestone) => (
                            <SelectItem key={milestone.id} value={milestone.id}>
                              {milestone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-muted-foreground">Mit Projekt-Meilenstein verknüpfen</p>
                    </div>
                  </div>
                )}

                {/* Blocking Reason (ProjectTask only, when blocked) */}
                {taskType === 'project_task' && projectTaskData.status === 'blocked' && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-medium">Blockierungsinformationen</h3>
                      <Label htmlFor="blockingReason">
                        Blockierungsgrund <span className="text-red-600">*</span>
                      </Label>
                      <Textarea
                        id="blockingReason"
                        rows={3}
                        value={projectTaskData.blockingReason}
                        onChange={(e) => handleFieldChange('blockingReason', e.target.value)}
                        onBlur={() => {
                          const error = validateBlockingReason(
                            projectTaskData.blockingReason,
                            true
                          );
                          if (error)
                            setFormErrors((prev) => ({ ...prev, blockingReason: error }));
                        }}
                        placeholder="Erklären Sie, warum diese Aufgabe blockiert ist..."
                        className={formErrors.blockingReason ? 'border-red-600' : ''}
                      />
                      {formErrors.blockingReason && (
                        <p className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.blockingReason}
                        </p>
                      )}
                      <p className="text-muted-foreground">
                        Erforderlich wenn Status "Blockiert" • Min 10 Zeichen
                      </p>
                    </div>
                  </>
                )}

                {/* Collapse Full Mode */}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setViewMode('quick')}
                >
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Weniger Optionen anzeigen
                </Button>
              </>
            )}

            <DialogFooter className="gap-2">
              {mode === 'edit' && onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-600 mr-auto"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Aufgabe löschen
                </Button>
              )}
              <Button type="button" variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Wird gespeichert...'
                  : mode === 'create'
                  ? 'Aufgabe erstellen'
                  : 'Aufgabe aktualisieren'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aufgabe löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diese Aufgabe löschen möchten? Diese Aktion kann nicht
              rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Änderungen verwerfen?</AlertDialogTitle>
            <AlertDialogDescription>
              Sie haben nicht gespeicherte Änderungen. Möchten Sie diese wirklich verwerfen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Weiter bearbeiten</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCancelConfirm(false);
                onCancel();
              }}
            >
              Änderungen verwerfen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Demo Component
export function TaskFormDemo() {
  const [showUserTaskForm, setShowUserTaskForm] = useState(false);
  const [showProjectTaskForm, setShowProjectTaskForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');

  const handleSubmit = async (data: TaskFormData) => {
    console.log('Form submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowUserTaskForm(false);
    setShowProjectTaskForm(false);
  };

  const handleCancel = () => {
    setShowUserTaskForm(false);
    setShowProjectTaskForm(false);
  };

  const handleDelete = async (taskId: string) => {
    console.log('Delete task:', taskId);
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aufgabenformular</CardTitle>
          <CardDescription>
            Formulare zum Erstellen und Bearbeiten von Benutzer- und Projekt-Aufgaben
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-3">Formular-Modus:</h3>
            <div className="flex gap-2">
              <Button
                variant={formMode === 'create' ? 'default' : 'outline'}
                onClick={() => setFormMode('create')}
              >
                Erstellen
              </Button>
              <Button
                variant={formMode === 'edit' ? 'default' : 'outline'}
                onClick={() => setFormMode('edit')}
              >
                Bearbeiten
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3">Benutzer-Aufgabe (Persönliche To-Do)</h3>
            <p className="text-muted-foreground mb-3">
              Für Sales Follow-ups, persönliche Erinnerungen und administrative Aufgaben
            </p>
            <Button onClick={() => setShowUserTaskForm(true)}>
              Benutzer-Aufgabe {formMode === 'create' ? 'erstellen' : 'bearbeiten'}
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3">Projekt-Aufgabe (Projekt-Arbeitseinheit)</h3>
            <p className="text-muted-foreground mb-3">
              Für Projektausführungsaufgaben, Lieferungen und Meilensteine
            </p>
            <Button onClick={() => setShowProjectTaskForm(true)}>
              Projekt-Aufgabe {formMode === 'create' ? 'erstellen' : 'bearbeiten'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Task Form */}
      <TaskForm
        mode={formMode}
        taskType="user_task"
        initialData={
          formMode === 'edit'
            ? {
                title: 'Hofladen Müller wegen Liefertermin anrufen',
                description: 'Kunde möchte Installationstermin für nächsten Monat bestätigen.',
                status: 'in_progress',
                priority: 'high',
                dueDate: new Date('2025-02-15'),
                assignedTo: 'user-1',
                relatedCustomerId: 'cust-2',
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={formMode === 'edit' ? handleDelete : undefined}
        open={showUserTaskForm}
      />

      {/* Project Task Form */}
      <TaskForm
        mode={formMode}
        taskType="project_task"
        projectId="proj-2"
        initialData={
          formMode === 'edit'
            ? {
                title: 'Technische Zeichnungen erstellen',
                description:
                  'Vollständige CAD-Zeichnungen für Ladenlayout, inkl. Möbelplatzierung und Elektroplan.',
                status: 'in_progress',
                priority: 'high',
                dueDate: new Date('2025-02-15'),
                assignedTo: 'user-2',
                projectId: 'proj-2',
                phase: 'planning',
                milestone: 'ms-1',
                blockingReason: '',
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={formMode === 'edit' ? handleDelete : undefined}
        open={showProjectTaskForm}
      />
    </div>
  );
}