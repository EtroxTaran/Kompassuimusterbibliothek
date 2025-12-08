import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Calendar as CalendarIcon, 
  CornerDownRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Project, Task } from './providers/DataProvider';
import { cn } from './ui/utils';

// --- Date Helpers ---

function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

function getWeekNumber(d: Date): number {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getDaysDiff(start: Date, end: Date): number {
  const s = normalizeDate(start);
  const e = normalizeDate(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

// --- Configuration ---

type ViewMode = 'week' | 'month' | 'quarter' | 'year';

const CONFIG = {
  week: {
    columnWidth: 60,
    label: 'Woche',
    bufferDays: 2,
    durationDays: 21 // 3 weeks
  },
  month: {
    columnWidth: 30,
    label: 'Monat',
    bufferDays: 5,
    durationDays: 60 // 2 months
  },
  quarter: {
    columnWidth: 12,
    label: 'Quartal',
    bufferDays: 15,
    durationDays: 180 // ~6 months
  },
  year: {
    columnWidth: 4,
    label: 'Jahr',
    bufferDays: 30,
    durationDays: 730 // 2 years
  }
};

const SIDEBAR_WIDTH = 400; 
const PROJECT_ROW_HEIGHT = 56;
const TASK_ROW_HEIGHT = 44;

// --- Components ---

function StatusBadge({ status, size = 'default' }: { status: string, size?: 'default' | 'small' }) {
  const styles: Record<string, string> = {
    new: 'bg-slate-100 text-slate-700 border-slate-200',
    planning: 'bg-purple-100 text-purple-700 border-purple-200',
    inProgress: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    paused: 'bg-amber-100 text-amber-700 border-amber-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-slate-100 text-slate-700 border-slate-200',
    blocked: 'bg-red-100 text-red-700 border-red-200',
  };

  const labels: Record<string, string> = {
    new: 'Neu',
    planning: 'Planung',
    inProgress: 'In Arbeit',
    completed: 'Fertig',
    paused: 'Pausiert',
    cancelled: 'Storniert',
    pending: 'Geplant',
    blocked: 'Blockiert',
  };

  const isSmall = size === 'small';

  return (
    <span className={cn(
      "rounded-full border font-medium truncate inline-flex items-center justify-center", 
      styles[status] || styles.new,
      isSmall ? "text-[9px] px-1.5 h-4" : "text-[10px] px-2 h-5"
    )}>
      {labels[status] || status}
    </span>
  );
}

function TaskBar({ task, left, width }: { task: Task; left: number; width: number }) {
    const statusColors: Record<string, string> = {
        pending: 'bg-slate-300 border-slate-400',
        inProgress: 'bg-blue-500 border-blue-600',
        completed: 'bg-emerald-500 border-emerald-600',
        blocked: 'bg-red-500 border-red-600',
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div 
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 h-5 rounded shadow-sm cursor-pointer hover:brightness-110 transition-all z-10 border",
                            statusColors[task.status] || 'bg-slate-400'
                        )}
                        style={{ left, width }}
                    >
                         {/* Progress */}
                         <div 
                            className="absolute left-0 top-0 bottom-0 bg-white/20" 
                            style={{ width: `${task.progress}%` }} 
                        />
                         <span className="sr-only">{task.name}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs p-3">
                    <div className="font-bold text-sm mb-1">{task.name}</div>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground mb-2">
                        <span>Start: {new Date(task.startDate).toLocaleDateString()}</span>
                        <span>Ende: {new Date(task.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <Badge variant="outline">{task.status}</Badge>
                         <span className="font-mono">{task.progress}%</span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// --- Main Component ---

export function ProjectGanttChart({ projects }: { projects: Project[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(normalizeDate(new Date())); 
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (id: string) => {
    const newSet = new Set(expandedProjects);
    const isExpanding = !newSet.has(id);

    if (isExpanding) {
        newSet.add(id);
        
        // Find project and calculate bounds for auto-zoom
        const project = projects.find(p => p.id === id);
        if (project) {
            let start = parseLocalDate(project.startDate);
            let end = parseLocalDate(project.endDate);

            if (project.tasks && project.tasks.length > 0) {
                project.tasks.forEach(t => {
                    const tStart = parseLocalDate(t.startDate);
                    const tEnd = parseLocalDate(t.endDate);
                    if (tStart < start) start = tStart;
                    if (tEnd > end) end = tEnd;
                });
            }

            const durationDays = getDaysDiff(start, end);
            
            // Refined Auto-scale logic
            // We aim for the project to fill about 70-80% of a typical 1200px screen
            // Week (60px):   Fits ~20 days
            // Month (30px):  Fits ~40 days
            // Quarter (12px): Fits ~100 days
            // Year (4px):    Fits ~300 days
            
            let newMode: ViewMode = 'month';
            if (durationDays > 250) {
                newMode = 'year';
            } else if (durationDays > 80) {
                newMode = 'quarter';
            } else if (durationDays > 30) {
                newMode = 'month';
            } else {
                newMode = 'week';
            }
            
            setViewMode(newMode);
            // Center the view on the start date
            setCurrentDate(normalizeDate(start)); 
        }
    } else {
        newSet.delete(id);
    }
    setExpandedProjects(newSet);
  };

  // --- Calculate Timeline Range ---
  const { startDate, endDate, totalDays, dates } = useMemo(() => {
    const config = CONFIG[viewMode];
    
    // Start date is simply Current Date minus buffer
    const start = addDays(currentDate, -config.bufferDays);
    const normalizedStart = normalizeDate(start);
    
    // End date is Start + Duration
    const normalizedEnd = addDays(normalizedStart, config.durationDays);
    
    const dayCount = getDaysDiff(normalizedStart, normalizedEnd);
    
    const dateArray = [];
    for (let i = 0; i < dayCount; i++) {
      dateArray.push(addDays(normalizedStart, i));
    }

    return { 
      startDate: normalizedStart, 
      endDate: normalizedEnd, 
      totalDays: dayCount, 
      dates: dateArray 
    };
  }, [currentDate, viewMode]);

  const config = CONFIG[viewMode];
  const totalWidth = totalDays * config.columnWidth;

  const navigate = (direction: 'prev' | 'next') => {
    const stepDays = viewMode === 'week' ? 7 : viewMode === 'month' ? 30 : viewMode === 'quarter' ? 90 : 365;
    const factor = direction === 'next' ? 1 : -1;
    setCurrentDate(addDays(currentDate, stepDays * factor));
  };

  const getX = (date: Date) => {
    const diff = getDaysDiff(startDate, date);
    return diff * config.columnWidth;
  };

  // --- Flatten Visible Rows for Rendering & Dependencies ---
  
  interface VisibleRow {
    type: 'project' | 'task';
    id: string;
    data: any;
    top: number;
    height: number;
    parentId?: string;
  }

  const { rows, totalHeight, rowMap } = useMemo(() => {
    const result: VisibleRow[] = [];
    const map = new Map<string, VisibleRow>();
    let currentTop = 0;

    projects.forEach(project => {
        const pRow: VisibleRow = {
            type: 'project',
            id: project.id,
            data: project,
            top: currentTop,
            height: PROJECT_ROW_HEIGHT
        };
        result.push(pRow);
        map.set(project.id, pRow);
        currentTop += PROJECT_ROW_HEIGHT;

        if (expandedProjects.has(project.id) && project.tasks) {
            project.tasks.forEach(task => {
                const tRow: VisibleRow = {
                    type: 'task',
                    id: task.id,
                    data: task,
                    top: currentTop,
                    height: TASK_ROW_HEIGHT,
                    parentId: project.id
                };
                result.push(tRow);
                map.set(task.id, tRow);
                currentTop += TASK_ROW_HEIGHT;
            });
        }
    });

    return { rows: result, totalHeight: currentTop, rowMap: map };
  }, [projects, expandedProjects]);

  // --- Calculate Dependency Lines ---

  const dependencyLines = useMemo(() => {
    const lines: JSX.Element[] = [];

    rows.forEach(row => {
        if (row.type === 'task' && row.data.dependencies) {
            const targetTask = row.data as Task;
            const targetStart = parseLocalDate(targetTask.startDate);
            // Target Point: Left Edge of the target bar
            const targetX = getX(targetStart) - 6; // Slight padding so arrow doesn't overlap
            const targetY = row.top + (row.height / 2);

            targetTask.dependencies.forEach((depId: string) => {
                const sourceRow = rowMap.get(depId);
                // Only draw if source is visible
                if (sourceRow) {
                    const sourceTask = sourceRow.data as Task;
                    const sourceStart = parseLocalDate(sourceTask.startDate);
                    const sourceEnd = parseLocalDate(sourceTask.endDate);
                    
                    const sourceDuration = getDaysDiff(sourceStart, sourceEnd) + 1; // Include end day
                    const sourceWidth = Math.max(config.columnWidth, sourceDuration * config.columnWidth);
                    
                    // Source Point: Right Edge of the source bar
                    const sourceX = getX(sourceStart) + sourceWidth + 6; 
                    const sourceY = sourceRow.top + (sourceRow.height / 2);

                    // Path Logic (Orthogonal)
                    const midX = sourceX + 12; // First vertical segment X
                    
                    let d = '';
                    if (targetX > sourceX + 20) {
                        d = `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`;
                    } else {
                        const loopY = targetY > sourceY ? sourceY + (row.height/2) + 6 : sourceY - (row.height/2) - 6;
                        const safeX = targetX - 12;
                        d = `M ${sourceX} ${sourceY} L ${sourceX + 10} ${sourceY} L ${sourceX + 10} ${loopY} L ${safeX} ${loopY} L ${safeX} ${targetY} L ${targetX} ${targetY}`;
                    }

                    lines.push(
                        <path 
                            key={`${depId}-${targetTask.id}`} 
                            d={d} 
                            fill="none" 
                            stroke="#94a3b8" 
                            strokeWidth="1.5" 
                            markerEnd="url(#arrowhead)"
                            className="opacity-40 hover:opacity-100 hover:stroke-blue-500 hover:stroke-[2px] transition-all cursor-pointer"
                        />
                    );
                }
            });
        }
    });

    return lines;
  }, [rows, rowMap, config.columnWidth, startDate]);

  // --- Header Rendering Helpers ---
  const getHeaderLabel = (date: Date) => {
      if (viewMode === 'week') return date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
      if (viewMode === 'month') return date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
      if (viewMode === 'quarter') return `Q${Math.floor(date.getMonth()/3)+1} ${date.getFullYear()}`;
      if (viewMode === 'year') return date.getFullYear().toString();
      return '';
  };

  const getHeaderWidth = (date: Date) => {
      if (viewMode === 'week') return 7 * config.columnWidth; // Approx
      if (viewMode === 'month') {
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          return daysInMonth * config.columnWidth;
      }
      if (viewMode === 'quarter') {
           const nextQ = new Date(date.getFullYear(), Math.floor(date.getMonth()/3)*3 + 3, 1);
           const currentQ = new Date(date.getFullYear(), Math.floor(date.getMonth()/3)*3, 1);
           return getDaysDiff(currentQ, nextQ) * config.columnWidth;
      }
      if (viewMode === 'year') return (365 + (date.getFullYear() % 4 === 0 ? 1 : 0)) * config.columnWidth;
      return 0;
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border shadow-sm overflow-hidden select-none">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card z-50 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
            {(['week', 'month', 'quarter', 'year'] as ViewMode[]).map((mode) => (
              <Button 
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode(mode)}
                className="h-7 text-xs capitalize px-3"
              >
                {CONFIG[mode].label}
              </Button>
            ))}
          </div>
          
          <div className="h-6 w-px bg-border mx-2" />

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 min-w-[140px] justify-center font-medium">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {getHeaderLabel(currentDate)}
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentDate(normalizeDate(new Date()))} className="h-8 text-xs">
              Heute
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-md border border-border/50">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>In Arbeit</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Fertig</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"></div>Geplant</div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Blockiert</div>
        </div>
      </div>

      {/* Main Gantt Container */}
      <div className="flex-1 overflow-auto relative bg-white dark:bg-zinc-950 scroll-smooth group/container">
        <div 
          className="relative min-w-fit"
          style={{ width: Math.max(1000, SIDEBAR_WIDTH + totalWidth), height: Math.max(500, totalHeight + 80) }}
        >
          
          {/* --- Header Group (Sticky Top) --- */}
          <div className="sticky top-0 z-40 flex bg-card border-b border-border h-[80px] shadow-sm">
            <div 
              className="sticky left-0 z-50 bg-card border-r border-border flex items-end pb-3 px-4 font-medium text-sm text-muted-foreground"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <div className="grid grid-cols-[1fr_80px_60px] w-full gap-4 px-2">
                  <span>Projekt / Aufgabe</span>
                  <span>Manager</span>
                  <span>Status</span>
              </div>
            </div>

            <div className="relative flex-1 h-full overflow-hidden bg-card/50">
                {/* Upper Header */}
                <div className="h-1/2 border-b border-border/50 relative">
                  {dates.map((date, i) => {
                    let showLabel = false;
                    let labelText = '';
                    let width = 0;

                    // Header Logic
                    if (viewMode === 'week' || viewMode === 'month') {
                         if (date.getDate() === 1) {
                             showLabel = true;
                             labelText = date.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
                             width = getHeaderWidth(date);
                         }
                    } else if (viewMode === 'quarter') {
                        if (date.getMonth() % 3 === 0 && date.getDate() === 1) {
                            showLabel = true;
                            labelText = `Q${Math.floor(date.getMonth()/3)+1} ${date.getFullYear()}`;
                            width = getHeaderWidth(date);
                        }
                    } else if (viewMode === 'year') {
                         if (date.getMonth() === 0 && date.getDate() === 1) {
                             showLabel = true;
                             labelText = date.getFullYear().toString();
                             width = getHeaderWidth(date);
                         }
                    }

                    if (!showLabel) return null;

                    return (
                        <div 
                            key={`header-upper-${i}`}
                            className="absolute top-0 bottom-0 border-r border-border/30 px-2 flex items-center text-xs font-semibold text-muted-foreground bg-muted/10 whitespace-nowrap overflow-hidden"
                            style={{ left: i * config.columnWidth, width }}
                        >
                            {labelText}
                        </div>
                    );
                  })}
                </div>

                {/* Lower Header */}
                <div className="h-1/2 relative">
                    {dates.map((date, i) => {
                         if (viewMode === 'week') {
                             return (
                                <div 
                                    key={`header-lower-${i}`}
                                    className={cn(
                                        "absolute top-0 bottom-0 border-r border-border/30 flex flex-col items-center justify-center text-[10px] text-muted-foreground",
                                        [0, 6].includes(date.getDay()) && "bg-muted/20"
                                    )}
                                    style={{ left: i * config.columnWidth, width: config.columnWidth }}
                                >
                                    <span className="font-bold">{date.getDate()}</span>
                                    <span className="text-[9px] uppercase">{date.toLocaleDateString('de-DE', { weekday: 'short' }).slice(0, 2)}</span>
                                </div>
                             )
                         } else if (viewMode === 'month') {
                             return (
                                <div 
                                    key={`header-lower-${i}`}
                                    className={cn(
                                        "absolute top-0 bottom-0 border-r border-border/30 flex items-center justify-center text-[10px] text-muted-foreground",
                                        [0, 6].includes(date.getDay()) && "bg-muted/20"
                                    )}
                                    style={{ left: i * config.columnWidth, width: config.columnWidth }}
                                >
                                    {date.getDate()}
                                </div>
                             )
                         } else if (viewMode === 'quarter' && date.getDay() === 1) {
                             return (
                                <div 
                                    key={`header-lower-${i}`}
                                    className="absolute top-0 bottom-0 border-r border-border/30 flex items-center justify-center text-[10px] text-muted-foreground pl-1"
                                    style={{ left: i * config.columnWidth, width: config.columnWidth * 7 }}
                                >
                                    KW{getWeekNumber(date)}
                                </div>
                             )
                         } else if (viewMode === 'year' && date.getDate() === 1) {
                             return (
                                <div 
                                    key={`header-lower-${i}`}
                                    className="absolute top-0 bottom-0 border-r border-border/30 flex items-center justify-center text-[10px] text-muted-foreground"
                                    style={{ left: i * config.columnWidth, width: config.columnWidth * (new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()) }}
                                >
                                    {date.toLocaleDateString('de-DE', { month: 'short' })}
                                </div>
                             )
                         }
                         return null;
                    })}
                </div>
            </div>
          </div>

          {/* --- Grid Body --- */}
          <div className="relative">
            {/* Background Grid Lines */}
            <div 
                className="absolute top-0 bottom-0 z-0 pointer-events-none" 
                style={{ left: SIDEBAR_WIDTH, right: 0, height: totalHeight }}
            >
                 {dates.map((date, i) => (
                    <div 
                        key={`grid-line-${i}`}
                        className={cn(
                            "absolute top-0 bottom-0 border-r border-dashed border-border/20",
                            (viewMode === 'week' || viewMode === 'month') && [0, 6].includes(date.getDay()) && "bg-muted/10",
                            viewMode === 'quarter' && date.getDay() === 1 && "border-border/40", // Weekly lines
                            viewMode === 'year' && date.getDate() === 1 && "border-border/40" // Monthly lines
                        )}
                        style={{ left: i * config.columnWidth, width: config.columnWidth }}
                    />
                 ))}
                 
                 {/* Today Line */}
                 {(() => {
                    const today = normalizeDate(new Date());
                    if (today >= startDate && today <= endDate) {
                        const x = getX(today);
                        return (
                            <div 
                                className="absolute top-0 bottom-0 w-px bg-red-500 z-30"
                                style={{ left: x + (config.columnWidth / 2) }}
                            >
                                <div className="absolute -top-1 -translate-x-1/2 bg-red-500 text-white text-[9px] px-1.5 rounded-full z-20">
                                    Heute
                                </div>
                            </div>
                        )
                    }
                 })()}
            </div>

            {/* Dependency Lines SVG Overlay */}
            <svg 
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                style={{ left: SIDEBAR_WIDTH, width: totalWidth, height: totalHeight }}
            >
                <defs>
                    <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                        <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
                    </marker>
                </defs>
                {dependencyLines}
            </svg>

            {/* Rows Rendering */}
            {rows.map((row) => {
                if (row.type === 'project') {
                    const project = row.data as Project;
                    const hasTasks = project.tasks && project.tasks.length > 0;
                    const isExpanded = expandedProjects.has(project.id);
                    const pStart = parseLocalDate(project.startDate);
                    const pEnd = parseLocalDate(project.endDate);
                    const startOffset = getDaysDiff(startDate, pStart);
                    const duration = getDaysDiff(pStart, pEnd) + 1;
                    const left = startOffset * config.columnWidth;
                    const width = Math.max(config.columnWidth, duration * config.columnWidth);
                    
                    const statusColors: Record<string, string> = {
                        inProgress: 'bg-blue-500 border-blue-600',
                        completed: 'bg-emerald-500 border-emerald-600',
                        planning: 'bg-purple-500 border-purple-600',
                        new: 'bg-slate-500 border-slate-600',
                        paused: 'bg-amber-500 border-amber-600',
                        cancelled: 'bg-red-500 border-red-600',
                    };

                    return (
                        <div 
                            key={`project-${project.id}`} 
                            className="flex border-b border-border/50 relative z-20 bg-background/30 hover:bg-muted/10 transition-colors"
                            style={{ height: row.height }}
                        >
                            {/* Project Sidebar */}
                            <div 
                                className="sticky left-0 z-40 bg-card border-r border-border flex items-center px-4 shadow-[4px_0_5px_-2px_rgba(0,0,0,0.05)]"
                                style={{ width: SIDEBAR_WIDTH }}
                            >
                                <div className="flex items-center w-full gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                                        <div 
                                            onClick={() => hasTasks && toggleProject(project.id)}
                                            className={cn(
                                                "flex items-center justify-center h-6 w-6 rounded-md transition-colors shrink-0",
                                                hasTasks ? "cursor-pointer hover:bg-muted text-muted-foreground" : "opacity-0 pointer-events-none"
                                            )}
                                        >
                                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-sm truncate">{project.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{project.number}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-[80px] shrink-0">
                                         <Avatar className="h-6 w-6 border border-border">
                                            <AvatarFallback className="text-[9px]">{project.manager.initials}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs truncate">{project.manager.name.split(' ')[0]}</span>
                                    </div>
                                    
                                    <div className="w-[60px] flex justify-end shrink-0">
                                         <StatusBadge status={project.status} size="small" />
                                    </div>
                                </div>
                            </div>

                            {/* Project Bar */}
                            <div className="relative flex-1 z-10">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div 
                                                className={cn(
                                                    "absolute top-1/2 -translate-y-1/2 h-8 rounded-md shadow-sm border cursor-pointer transition-all overflow-hidden",
                                                    statusColors[project.status] || 'bg-slate-500'
                                                )}
                                                style={{ left, width }}
                                                onClick={() => hasTasks && toggleProject(project.id)}
                                            >
                                                <div 
                                                    className="absolute left-0 top-0 bottom-0 bg-white/20" 
                                                    style={{ width: `${project.progress}%` }} 
                                                />
                                                <div className="relative z-10 flex items-center h-full px-3 text-white">
                                                    <span className="text-xs font-medium truncate drop-shadow-md">
                                                        {project.name}
                                                    </span>
                                                    {width > 120 && (
                                                        <span className="ml-auto text-[10px] opacity-90 font-mono">
                                                            {project.progress}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="p-3">
                                            <div className="font-bold mb-1">{project.name}</div>
                                            <div className="text-xs text-muted-foreground">Kunde: {project.customer}</div>
                                        </TooltipContent>
                                    </Tooltip>
                                 </TooltipProvider>
                            </div>
                        </div>
                    );
                } else {
                    // Task Row
                    const task = row.data as Task;
                    const tStart = parseLocalDate(task.startDate);
                    const tEnd = parseLocalDate(task.endDate);
                    const tStartOffset = getDaysDiff(startDate, tStart);
                    const tDuration = getDaysDiff(tStart, tEnd) + 1;
                    const tLeft = tStartOffset * config.columnWidth;
                    const tWidth = Math.max(config.columnWidth, tDuration * config.columnWidth);

                    return (
                        <div 
                            key={`task-${task.id}`} 
                            className="flex border-b border-border/30 bg-muted/5 hover:bg-muted/10 relative z-20"
                            style={{ height: row.height }}
                        >
                            {/* Task Sidebar */}
                            <div 
                                className="sticky left-0 z-40 bg-card/95 backdrop-blur-sm border-r border-border flex items-center px-4"
                                style={{ width: SIDEBAR_WIDTH }}
                            >
                                <div className="flex items-center w-full gap-4 pl-9">
                                    <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                                        <CornerDownRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-medium truncate">{task.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">{task.number}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-start w-[80px] shrink-0">
                                        {task.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                 <Avatar className="h-5 w-5 border border-border/50">
                                                    <AvatarFallback className="text-[9px] bg-secondary text-secondary-foreground">
                                                        {task.assignedTo.substring(0,2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-[10px] text-muted-foreground truncate max-w-[50px]">{task.assignedTo}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground">-</span>
                                        )}
                                    </div>

                                    <div className="w-[60px] flex justify-end shrink-0">
                                         <StatusBadge status={task.status} size="small" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Task Bar */}
                            <div className="relative flex-1 z-10">
                                <TaskBar task={task} left={tLeft} width={tWidth} />
                            </div>
                        </div>
                    );
                }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
