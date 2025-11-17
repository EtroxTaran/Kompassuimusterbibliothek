import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner@2.0.3';
import {
  MoreVertical,
  Calendar,
  Briefcase,
  X,
  Edit,
  Trash2,
  Copy,
  Users,
  CheckCircle,
  AlertTriangle,
  Circle,
  Clock,
} from 'lucide-react';

// Task types
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
type UserTaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
type ProjectTaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';

interface BaseTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeName: string;
  assigneeAvatar: string;
  dueDate: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
}

interface UserTask extends BaseTask {
  type: 'user';
  status: UserTaskStatus;
}

interface ProjectTask extends BaseTask {
  type: 'project';
  status: ProjectTaskStatus;
  projectName: string;
  projectId: string;
  phase: string;
  milestone?: string;
}

type Task = UserTask | ProjectTask;

// Card variant type
type CardVariant = 'compact' | 'expanded' | 'kanban';

// Task Card Props
interface TaskCardProps {
  task: Task;
  variant?: CardVariant;
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onExpand?: (taskId: string) => void;
  isSelected?: boolean;
  isDraggable?: boolean;
  showActivityLog?: boolean;
  showProjectContext?: boolean;
  className?: string;
}

// Activity log entry
interface ActivityEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
}

const mockActivities: ActivityEntry[] = [
  {
    id: '1',
    timestamp: '2025-01-29T10:30:00Z',
    action: 'Status changed to "In Progress"',
    user: 'Anna Weber',
  },
  {
    id: '2',
    timestamp: '2025-01-28T09:00:00Z',
    action: 'Task created',
    user: 'Michael Schmidt',
  },
];

// Get priority badge
function getPriorityBadge(priority: TaskPriority) {
  switch (priority) {
    case 'low':
      return (
        <Badge
          variant="outline"
          className="border-gray-400 text-gray-600 dark:border-gray-600 dark:text-gray-400"
        >
          Niedrig
        </Badge>
      );
    case 'medium':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          Mittel
        </Badge>
      );
    case 'high':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
          Hoch
        </Badge>
      );
    case 'urgent':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400 font-bold">
          Dringend
        </Badge>
      );
    case 'critical':
      return (
        <Badge className="bg-red-800 text-white dark:bg-red-900 dark:text-red-100 font-bold">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Kritisch
        </Badge>
      );
  }
}

// Get user task status badge
function getUserTaskStatusBadge(status: UserTaskStatus) {
  switch (status) {
    case 'open':
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-600">
          <Circle className="mr-1 h-3 w-3" />
          Offen
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          <Clock className="mr-1 h-3 w-3" />
          In Bearbeitung
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Erledigt
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="outline" className="border-red-400 text-red-600 line-through">
          Abgebrochen
        </Badge>
      );
  }
}

// Get project task status badge
function getProjectTaskStatusBadge(status: ProjectTaskStatus) {
  switch (status) {
    case 'todo':
      return (
        <Badge variant="outline" className="border-gray-400 text-gray-600">
          <Circle className="mr-1 h-3 w-3" />
          To Do
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          <Clock className="mr-1 h-3 w-3" />
          In Bearbeitung
        </Badge>
      );
    case 'review':
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400">
          Review
        </Badge>
      );
    case 'done':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Fertig
        </Badge>
      );
    case 'blocked':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Blockiert
        </Badge>
      );
  }
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
  });
}

// Format datetime
function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Task Card Component
export function TaskCard({
  task,
  variant = 'compact',
  onStatusChange,
  onEdit,
  onDelete,
  onExpand,
  isSelected = false,
  isDraggable = false,
  showActivityLog = false,
  showProjectContext = true,
  className = '',
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(variant === 'expanded');
  const [showActivities, setShowActivities] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
      toast.success('Status aktualisiert', {
        description: `Aufgabe auf "${newStatus}" gesetzt`,
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task.id);
    } else {
      toast.info('Aufgabe bearbeiten', {
        description: task.title,
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    } else {
      toast.error('Aufgabe löschen', {
        description: task.title,
      });
    }
  };

  const handleExpand = () => {
    if (variant === 'compact') {
      setIsExpanded(!isExpanded);
      if (onExpand) {
        onExpand(task.id);
      }
    }
  };

  const handleDuplicate = () => {
    toast.success('Aufgabe dupliziert', {
      description: task.title,
    });
  };

  const handleChangeAssignee = () => {
    toast.info('Zuweisung ändern', {
      description: task.title,
    });
  };

  const handleSetDueDate = () => {
    toast.info('Fälligkeitsdatum ändern', {
      description: task.title,
    });
  };

  // Compact Card View
  if (!isExpanded && variant === 'compact') {
    return (
      <Card
        className={`transition-all duration-150 hover:shadow-md hover:bg-accent/50 cursor-pointer ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
        } ${className}`}
        onClick={handleExpand}
      >
        <CardContent className="p-4">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 mr-2">{getPriorityBadge(task.priority)}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExpand}>
                  <Edit className="mr-2 h-4 w-4" />
                  Details anzeigen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Bearbeiten
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplizieren
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangeAssignee}>
                  <Users className="mr-2 h-4 w-4" />
                  Zuweisung ändern
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSetDueDate}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Fälligkeit ändern
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Löschen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <h3 className="mb-3">{truncateText(task.title, 50)}</h3>

          {/* Context Row */}
          {task.type === 'project' && showProjectContext && (
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{truncateText(task.projectName, 30)}</span>
              <span>•</span>
              <span>{task.phase}</span>
            </div>
          )}

          {/* Footer Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{task.assigneeAvatar}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{task.assigneeName}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
              {task.type === 'user'
                ? getUserTaskStatusBadge(task.status)
                : getProjectTaskStatusBadge(task.status)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded Card View
  return (
    <Card
      className={`transition-all duration-150 ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${className}`}
    >
      <CardContent className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 mr-2">{getPriorityBadge(task.priority)}</div>
          {variant === 'compact' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Title */}
        <h2 className="mb-4">{task.title}</h2>

        {/* Description */}
        {task.description && (
          <div className="mb-4">
            <p className="font-medium mb-2">Beschreibung:</p>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Project Context */}
        {task.type === 'project' && showProjectContext && (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Projekt:</span>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{task.projectName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Phase:</span>
                <span>{task.phase}</span>
                {task.milestone && (
                  <>
                    <span>•</span>
                    <span className="text-muted-foreground">Meilenstein:</span>
                    <span>{task.milestone}</span>
                  </>
                )}
              </div>
            </div>
            <Separator className="my-4" />
          </>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-muted-foreground mb-1">Zugewiesen an:</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{task.assigneeAvatar}</AvatarFallback>
              </Avatar>
              <span>{task.assigneeName}</span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-1">Erstellt am:</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-1">Fällig am:</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-1">Geändert am:</p>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(task.modifiedAt)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Status Change */}
        <div className="mb-4">
          <p className="text-muted-foreground mb-2">Status ändern:</p>
          <Select
            value={task.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {task.type === 'user' ? (
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

        {/* Activity Log */}
        {showActivityLog && (
          <>
            <Separator className="my-4" />
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between mb-2"
                onClick={() => setShowActivities(!showActivities)}
              >
                <span className="font-medium">Aktivitätsprotokoll</span>
                <span>{showActivities ? '▲' : '▼'}</span>
              </Button>

              {showActivities && (
                <div className="space-y-3 pl-4">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="text-muted-foreground">
                      <p>
                        • {formatDateTime(activity.timestamp)} - {activity.action} von{' '}
                        {activity.user}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
          {task.type === 'user' && task.status !== 'completed' && (
            <Button onClick={() => handleStatusChange('completed')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Als erledigt markieren
            </Button>
          )}
          {task.type === 'project' && task.status !== 'done' && (
            <Button onClick={() => handleStatusChange('done')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Als fertig markieren
            </Button>
          )}
          <Button variant="outline" className="text-red-600" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Löschen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State - No Tasks
export function EmptyTaskList() {
  return (
    <Card className="p-12">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3>Keine Aufgaben vorhanden</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Klicken Sie auf "Neue Aufgabe", um Ihre erste Aufgabe zu erstellen und organisiert zu
          bleiben.
        </p>
        <Button>
          <CheckCircle className="mr-2 h-4 w-4" />
          Neue Aufgabe
        </Button>
      </div>
    </Card>
  );
}

// Empty State - All Tasks Completed
export function AllTasksCompleted() {
  return (
    <Card className="p-12">
      <div className="text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3>Alles erledigt!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sie haben alle Ihre Aufgaben abgeschlossen. Großartige Arbeit!
        </p>
        <Button variant="outline">Erledigte anzeigen</Button>
      </div>
    </Card>
  );
}

// Demo Component
export function TaskCardDemo() {
  const mockUserTask: UserTask = {
    id: '1',
    type: 'user',
    title: 'Angebot für REWE München erstellen',
    description:
      'Vollständiges Angebot mit Kostenaufstellung und Zeitplan für die Ladeneinrichtung erstellen.',
    priority: 'high',
    status: 'in_progress',
    assigneeName: 'Anna Weber',
    assigneeAvatar: 'AW',
    dueDate: '2025-02-15',
    createdAt: '2025-01-28',
    modifiedAt: '2025-01-29',
    createdBy: 'Michael Schmidt',
  };

  const mockProjectTask: ProjectTask = {
    id: '2',
    type: 'project',
    title: 'Technische Zeichnungen erstellen',
    description:
      'Vollständige CAD-Zeichnungen für das Ladenlayout erstellen, einschließlich Möbelplatzierung und Elektroplan. Mit externem Elektriker für Genehmigungen koordinieren.',
    priority: 'urgent',
    status: 'in_progress',
    assigneeName: 'Thomas Fischer',
    assigneeAvatar: 'TF',
    dueDate: '2025-02-15',
    createdAt: '2025-01-28',
    modifiedAt: '2025-01-29',
    createdBy: 'Michael Schmidt',
    projectName: 'Hofladen Müller Ladenbau',
    projectId: 'P-2024-M012',
    phase: 'Planung',
    milestone: 'Design-Freigabe',
  };

  const [selectedView, setSelectedView] = useState<'compact' | 'expanded'>('compact');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-medium">Ansicht:</span>
            <Select value={selectedView} onValueChange={(v: any) => setSelectedView(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Kompakt</SelectItem>
                <SelectItem value="expanded">Erweitert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-4">Benutzer-Aufgabe</h3>
        <TaskCard
          task={mockUserTask}
          variant={selectedView}
          showActivityLog={selectedView === 'expanded'}
        />
      </div>

      <div>
        <h3 className="mb-4">Projekt-Aufgabe</h3>
        <TaskCard
          task={mockProjectTask}
          variant={selectedView}
          showActivityLog={selectedView === 'expanded'}
          showProjectContext={true}
        />
      </div>

      <div>
        <h3 className="mb-4">Leerzustände</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyTaskList />
          <AllTasksCompleted />
        </div>
      </div>

      <div>
        <h3 className="mb-4">Verschiedene Prioritäten</h3>
        <div className="space-y-4">
          {(['low', 'medium', 'high', 'urgent', 'critical'] as TaskPriority[]).map((priority) => (
            <TaskCard
              key={priority}
              task={{
                ...mockUserTask,
                id: `task-${priority}`,
                title: `Aufgabe mit ${priority} Priorität`,
                priority,
              }}
              variant="compact"
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4">Verschiedene Status (Benutzer-Aufgaben)</h3>
        <div className="space-y-4">
          {(['open', 'in_progress', 'completed', 'cancelled'] as UserTaskStatus[]).map(
            (status) => (
              <TaskCard
                key={status}
                task={{
                  ...mockUserTask,
                  id: `task-${status}`,
                  title: `Aufgabe mit Status ${status}`,
                  status,
                }}
                variant="compact"
              />
            )
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4">Verschiedene Status (Projekt-Aufgaben)</h3>
        <div className="space-y-4">
          {(['todo', 'in_progress', 'review', 'done', 'blocked'] as ProjectTaskStatus[]).map(
            (status) => (
              <TaskCard
                key={status}
                task={{
                  ...mockProjectTask,
                  id: `task-${status}`,
                  title: `Projekt-Aufgabe mit Status ${status}`,
                  status,
                }}
                variant="compact"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
