import { useState } from 'react';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Mic,
  Lock,
} from 'lucide-react';

// Editor button component
interface EditorButtonProps {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function EditorButton({
  icon: Icon,
  label,
  shortcut,
  isActive = false,
  disabled = false,
  onClick,
}: EditorButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            disabled={disabled}
            aria-label={shortcut ? `${label} (${shortcut})` : label}
            aria-pressed={isActive}
            aria-disabled={disabled}
            className={`h-9 w-9 rounded-md flex items-center justify-center transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : disabled
                  ? 'text-muted-foreground opacity-50 cursor-not-allowed'
                  : 'text-foreground hover:bg-muted'
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}
            {shortcut && <span className="ml-2 text-xs opacity-70">({shortcut})</span>}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Toolbar separator
function ToolbarSeparator() {
  return <div className="w-px h-8 bg-border flex-shrink-0" />;
}

// Character counter
interface CharacterCounterProps {
  current: number;
  max: number;
}

function CharacterCounter({ current, max }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const color =
    percentage > 100
      ? 'text-red-500'
      : percentage >= 80
        ? 'text-orange-500'
        : 'text-muted-foreground';

  return (
    <div className="border-t bg-background border-border px-4 py-2 text-right">
      <span className={`text-xs ${color}`} aria-live="polite" aria-atomic="true">
        {current.toLocaleString('de-DE')} / {max.toLocaleString('de-DE')} Zeichen
      </span>
    </div>
  );
}

// Toolbar Props
interface ToolbarProps {
  activeButtons?: string[];
  onButtonClick?: (button: string) => void;
  disabled?: boolean;
}

// Basic Toolbar (8 buttons)
function BasicToolbar({ activeButtons = [], onButtonClick, disabled = false }: ToolbarProps) {
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden flex-nowrap">
      <EditorButton
        icon={Bold}
        label="Fett"
        shortcut="Strg+B"
        isActive={isActive('bold')}
        onClick={() => onButtonClick?.('bold')}
        disabled={disabled}
      />
      <EditorButton
        icon={Italic}
        label="Kursiv"
        shortcut="Strg+I"
        isActive={isActive('italic')}
        onClick={() => onButtonClick?.('italic')}
        disabled={disabled}
      />
      <EditorButton
        icon={Underline}
        label="Unterstrichen"
        shortcut="Strg+U"
        isActive={isActive('underline')}
        onClick={() => onButtonClick?.('underline')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={List}
        label="Aufzählung"
        isActive={isActive('bulletList')}
        onClick={() => onButtonClick?.('bulletList')}
        disabled={disabled}
      />
      <EditorButton
        icon={ListOrdered}
        label="Nummerierte Liste"
        isActive={isActive('orderedList')}
        onClick={() => onButtonClick?.('orderedList')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={LinkIcon}
        label="Link einfügen"
        onClick={() => onButtonClick?.('link')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Undo}
        label="Rückgängig"
        shortcut="Strg+Z"
        onClick={() => onButtonClick?.('undo')}
        disabled={disabled}
      />
      <EditorButton
        icon={Redo}
        label="Wiederherstellen"
        shortcut="Strg+Y"
        onClick={() => onButtonClick?.('redo')}
        disabled={disabled}
      />
    </div>
  );
}

// Basic + Tasks Toolbar (9 buttons)
function BasicTasksToolbar({ activeButtons = [], onButtonClick, disabled = false }: ToolbarProps) {
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden flex-nowrap">
      <EditorButton
        icon={Bold}
        label="Fett"
        shortcut="Strg+B"
        isActive={isActive('bold')}
        onClick={() => onButtonClick?.('bold')}
        disabled={disabled}
      />
      <EditorButton
        icon={Italic}
        label="Kursiv"
        shortcut="Strg+I"
        isActive={isActive('italic')}
        onClick={() => onButtonClick?.('italic')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={List}
        label="Aufzählung"
        isActive={isActive('bulletList')}
        onClick={() => onButtonClick?.('bulletList')}
        disabled={disabled}
      />
      <EditorButton
        icon={ListOrdered}
        label="Nummerierte Liste"
        isActive={isActive('orderedList')}
        onClick={() => onButtonClick?.('orderedList')}
        disabled={disabled}
      />
      <EditorButton
        icon={CheckSquare}
        label="Aufgabenliste"
        isActive={isActive('taskList')}
        onClick={() => onButtonClick?.('taskList')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={LinkIcon}
        label="Link einfügen"
        onClick={() => onButtonClick?.('link')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Undo}
        label="Rückgängig"
        shortcut="Strg+Z"
        onClick={() => onButtonClick?.('undo')}
        disabled={disabled}
      />
      <EditorButton
        icon={Redo}
        label="Wiederherstellen"
        shortcut="Strg+Y"
        onClick={() => onButtonClick?.('redo')}
        disabled={disabled}
      />
    </div>
  );
}

// Standard Toolbar (12 buttons)
function StandardToolbar({ activeButtons = [], onButtonClick, disabled = false }: ToolbarProps) {
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden flex-nowrap">
      <EditorButton
        icon={Bold}
        label="Fett"
        shortcut="Strg+B"
        isActive={isActive('bold')}
        onClick={() => onButtonClick?.('bold')}
        disabled={disabled}
      />
      <EditorButton
        icon={Italic}
        label="Kursiv"
        shortcut="Strg+I"
        isActive={isActive('italic')}
        onClick={() => onButtonClick?.('italic')}
        disabled={disabled}
      />
      <EditorButton
        icon={Underline}
        label="Unterstrichen"
        shortcut="Strg+U"
        isActive={isActive('underline')}
        onClick={() => onButtonClick?.('underline')}
        disabled={disabled}
      />
      <EditorButton
        icon={Strikethrough}
        label="Durchgestrichen"
        isActive={isActive('strike')}
        onClick={() => onButtonClick?.('strike')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Heading2}
        label="Überschrift 2"
        isActive={isActive('h2')}
        onClick={() => onButtonClick?.('h2')}
        disabled={disabled}
      />
      <EditorButton
        icon={Heading3}
        label="Überschrift 3"
        isActive={isActive('h3')}
        onClick={() => onButtonClick?.('h3')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={List}
        label="Aufzählung"
        isActive={isActive('bulletList')}
        onClick={() => onButtonClick?.('bulletList')}
        disabled={disabled}
      />
      <EditorButton
        icon={ListOrdered}
        label="Nummerierte Liste"
        isActive={isActive('orderedList')}
        onClick={() => onButtonClick?.('orderedList')}
        disabled={disabled}
      />
      <EditorButton
        icon={CheckSquare}
        label="Aufgabenliste"
        isActive={isActive('taskList')}
        onClick={() => onButtonClick?.('taskList')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Quote}
        label="Zitat"
        isActive={isActive('blockquote')}
        onClick={() => onButtonClick?.('blockquote')}
        disabled={disabled}
      />
      <EditorButton
        icon={LinkIcon}
        label="Link einfügen"
        onClick={() => onButtonClick?.('link')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Undo}
        label="Rückgängig"
        shortcut="Strg+Z"
        onClick={() => onButtonClick?.('undo')}
        disabled={disabled}
      />
      <EditorButton
        icon={Redo}
        label="Wiederherstellen"
        shortcut="Strg+Y"
        onClick={() => onButtonClick?.('redo')}
        disabled={disabled}
      />
    </div>
  );
}

// Advanced Toolbar (20 buttons)
function AdvancedToolbar({ activeButtons = [], onButtonClick, disabled = false }: ToolbarProps) {
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden flex-nowrap">
      <EditorButton
        icon={Bold}
        label="Fett"
        shortcut="Strg+B"
        isActive={isActive('bold')}
        onClick={() => onButtonClick?.('bold')}
        disabled={disabled}
      />
      <EditorButton
        icon={Italic}
        label="Kursiv"
        shortcut="Strg+I"
        isActive={isActive('italic')}
        onClick={() => onButtonClick?.('italic')}
        disabled={disabled}
      />
      <EditorButton
        icon={Underline}
        label="Unterstrichen"
        shortcut="Strg+U"
        isActive={isActive('underline')}
        onClick={() => onButtonClick?.('underline')}
        disabled={disabled}
      />
      <EditorButton
        icon={Strikethrough}
        label="Durchgestrichen"
        isActive={isActive('strike')}
        onClick={() => onButtonClick?.('strike')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Heading1}
        label="Überschrift 1"
        isActive={isActive('h1')}
        onClick={() => onButtonClick?.('h1')}
        disabled={disabled}
      />
      <EditorButton
        icon={Heading2}
        label="Überschrift 2"
        isActive={isActive('h2')}
        onClick={() => onButtonClick?.('h2')}
        disabled={disabled}
      />
      <EditorButton
        icon={Heading3}
        label="Überschrift 3"
        isActive={isActive('h3')}
        onClick={() => onButtonClick?.('h3')}
        disabled={disabled}
      />
      <EditorButton
        icon={Pilcrow}
        label="Absatz"
        isActive={isActive('paragraph')}
        onClick={() => onButtonClick?.('paragraph')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={List}
        label="Aufzählung"
        isActive={isActive('bulletList')}
        onClick={() => onButtonClick?.('bulletList')}
        disabled={disabled}
      />
      <EditorButton
        icon={ListOrdered}
        label="Nummerierte Liste"
        isActive={isActive('orderedList')}
        onClick={() => onButtonClick?.('orderedList')}
        disabled={disabled}
      />
      <EditorButton
        icon={CheckSquare}
        label="Aufgabenliste"
        isActive={isActive('taskList')}
        onClick={() => onButtonClick?.('taskList')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Quote}
        label="Zitat"
        isActive={isActive('blockquote')}
        onClick={() => onButtonClick?.('blockquote')}
        disabled={disabled}
      />
      <EditorButton
        icon={Code}
        label="Code-Block"
        isActive={isActive('codeBlock')}
        onClick={() => onButtonClick?.('codeBlock')}
        disabled={disabled}
      />
      <EditorButton
        icon={Minus}
        label="Trennlinie"
        onClick={() => onButtonClick?.('hr')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={LinkIcon}
        label="Link einfügen"
        onClick={() => onButtonClick?.('link')}
        disabled={disabled}
      />
      <EditorButton
        icon={TableIcon}
        label="Tabelle einfügen"
        onClick={() => onButtonClick?.('table')}
        disabled={disabled}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Undo}
        label="Rückgängig"
        shortcut="Strg+Z"
        onClick={() => onButtonClick?.('undo')}
        disabled={disabled}
      />
      <EditorButton
        icon={Redo}
        label="Wiederherstellen"
        shortcut="Strg+Y"
        onClick={() => onButtonClick?.('redo')}
        disabled={disabled}
      />
    </div>
  );
}

// Rich Text Editor Component
export interface RichTextEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxLength: number;
  helpText?: string;
  toolbar?: 'basic' | 'basicTasks' | 'standard' | 'advanced';
  withVoice?: boolean;
  onVoiceClick?: () => void;
  isRecording?: boolean;
  locked?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function RichTextEditor({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  minHeight = 200,
  maxLength,
  helpText,
  toolbar = 'basic',
  withVoice = false,
  onVoiceClick,
  isRecording = false,
  locked = false,
  disabled = false,
  required = false,
  className = '',
}: RichTextEditorProps) {
  const [activeButtons, setActiveButtons] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleButtonClick = (button: string) => {
    if (disabled || locked) return;
    if (activeButtons.includes(button)) {
      setActiveButtons(activeButtons.filter((b) => b !== button));
    } else {
      setActiveButtons([...activeButtons, button]);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    if (text.length <= maxLength) {
      onChange(text);
    } else {
      e.currentTarget.textContent = text.slice(0, maxLength);
      onChange(text.slice(0, maxLength));
    }
  };

  const characterCount = value.length;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {locked && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              GoBD gesperrt
            </Badge>
          )}
        </div>
      )}

      <div
        className={`border rounded-lg bg-background border-border overflow-hidden ${
          disabled || locked ? 'bg-muted' : ''
        }`}
      >
        {/* Toolbar */}
        <div className="h-12 border-b border-border bg-background px-2 py-2 flex items-center">
          {toolbar === 'basic' && (
            <BasicToolbar
              activeButtons={activeButtons}
              onButtonClick={handleButtonClick}
              disabled={disabled || locked}
            />
          )}
          {toolbar === 'basicTasks' && (
            <BasicTasksToolbar
              activeButtons={activeButtons}
              onButtonClick={handleButtonClick}
              disabled={disabled || locked}
            />
          )}
          {toolbar === 'standard' && (
            <StandardToolbar
              activeButtons={activeButtons}
              onButtonClick={handleButtonClick}
              disabled={disabled || locked}
            />
          )}
          {toolbar === 'advanced' && (
            <AdvancedToolbar
              activeButtons={activeButtons}
              onButtonClick={handleButtonClick}
              disabled={disabled || locked}
            />
          )}
        </div>

        {/* Content Area */}
        <div className="relative" style={{ minHeight }}>
          <div
            id={id}
            role="textbox"
            aria-label={label || 'Rich text editor'}
            aria-multiline="true"
            contentEditable={!disabled && !locked}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onInput={handleInput}
            className={`p-4 outline-none prose prose-sm max-w-none ${
              disabled || locked ? 'cursor-not-allowed text-muted-foreground' : ''
            }`}
            style={{ minHeight }}
            suppressContentEditableWarning
          >
            {value}
          </div>

          {/* Placeholder */}
          {value.length === 0 && !isFocused && (
            <div
              className="absolute top-4 left-4 text-muted-foreground italic pointer-events-none"
              aria-hidden="true"
            >
              {placeholder}
            </div>
          )}

          {/* Voice-to-Text Button */}
          {withVoice && !disabled && !locked && onVoiceClick && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={onVoiceClick}
                    className={`absolute bottom-14 right-4 h-11 w-11 rounded-full flex items-center justify-center transition-colors shadow-md ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                    aria-label="Spracheingabe starten"
                  >
                    <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? 'Aufnahme stoppen' : 'Spracheingabe starten'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Character Counter */}
        <CharacterCounter current={characterCount} max={maxLength} />
      </div>

      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
    </div>
  );
}