import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
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
    <div className="border-t bg-white px-4 py-2 text-right">
      <span className={`text-xs ${color}`} aria-live="polite" aria-atomic="true">
        {current.toLocaleString('de-DE')} / {max.toLocaleString('de-DE')} Zeichen
      </span>
    </div>
  );
}

// Basic Toolbar (8 buttons)
interface ToolbarProps {
  activeButtons?: string[];
  onButtonClick?: (button: string) => void;
  disabled?: boolean;
}

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

// Rich Text Editor Field Component
interface RichTextFieldProps {
  label: string;
  placeholder: string;
  minHeight: number;
  maxLength: number;
  helpText?: string;
  toolbar: 'basic' | 'basicTasks' | 'standard' | 'advanced';
  withVoice?: boolean;
  locked?: boolean;
  disabled?: boolean;
}

function RichTextField({
  label,
  placeholder,
  minHeight,
  maxLength,
  helpText,
  toolbar,
  withVoice = false,
  locked = false,
  disabled = false,
}: RichTextFieldProps) {
  const [content, setContent] = useState('');
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

  const characterCount = content.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {locked && (
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" />
            GoBD gesperrt
          </Badge>
        )}
      </div>

      <div
        className={`border rounded-lg bg-white overflow-hidden ${
          disabled || locked ? 'bg-muted' : ''
        }`}
      >
        {/* Toolbar */}
        <div className="h-12 border-b bg-white px-2 py-2 flex items-center">
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
            role="textbox"
            aria-label="Rich text editor"
            aria-multiline="true"
            contentEditable={!disabled && !locked}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onInput={(e) => {
              const text = e.currentTarget.textContent || '';
              if (text.length <= maxLength) {
                setContent(text);
              } else {
                e.currentTarget.textContent = text.slice(0, maxLength);
                setContent(text.slice(0, maxLength));
              }
            }}
            className={`p-4 outline-none prose prose-sm max-w-none ${
              disabled || locked ? 'cursor-not-allowed text-muted-foreground' : ''
            }`}
            style={{ minHeight }}
          />

          {/* Placeholder */}
          {content.length === 0 && !isFocused && (
            <div
              className="absolute top-4 left-4 text-muted-foreground italic pointer-events-none"
              aria-hidden="true"
            >
              {placeholder}
            </div>
          )}

          {/* Voice-to-Text Button */}
          {withVoice && !disabled && !locked && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="absolute bottom-14 right-4 h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                    aria-label="Spracheingabe starten"
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Spracheingabe starten</p>
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

// Form Field Demos
export function RichTextEditorFieldsDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>MIGRATION-001: Rich Text Editor – Alle Formularfelder</CardTitle>
          <CardDescription>
            Vollständige Übersicht aller 12 Felder, die von Textarea auf Rich Text Editor migriert wurden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-12">
            {/* Activity Protocol Form */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-1">1. Activity Protocol Form</h3>
                <p className="text-sm text-muted-foreground">
                  activity-protocol-form.md – 2 Felder migriert
                </p>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-blue-200">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 1</Badge>
                    <span className="text-sm font-medium">Beschreibung</span>
                    <Badge variant="outline">Standard Toolbar (12)</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Mic className="h-3 w-3" />
                      Voice
                    </Badge>
                  </div>
                  <RichTextField
                    label="Beschreibung"
                    placeholder="Was wurde besprochen oder vereinbart? Nächste Schritte..."
                    minHeight={200}
                    maxLength={2000}
                    helpText="Detaillierte Notizen zur Aktivität. Nutzen Sie Formatierung für Struktur."
                    toolbar="standard"
                    withVoice
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 2</Badge>
                    <span className="text-sm font-medium">Nächste Schritte</span>
                    <Badge variant="outline">Basic+Tasks Toolbar (9)</Badge>
                  </div>
                  <RichTextField
                    label="Nächste Schritte"
                    placeholder="Was sind die nächsten Schritte..."
                    minHeight={100}
                    maxLength={500}
                    helpText="Aufgabenliste für Follow-up Aktionen"
                    toolbar="basicTasks"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Customer Form */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-1">2. Customer Form</h3>
                <p className="text-sm text-muted-foreground">customer-form.md – 1 Feld hinzugefügt</p>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-green-200">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 3</Badge>
                    <span className="text-sm font-medium">Interne Notizen</span>
                    <Badge variant="outline">Basic Toolbar (8)</Badge>
                  </div>
                  <RichTextField
                    label="Interne Notizen"
                    placeholder="Besonderheiten, Präferenzen, historische Infos..."
                    minHeight={150}
                    maxLength={1000}
                    helpText="Diese Notizen sind nur für interne Zwecke sichtbar"
                    toolbar="basic"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-1">3. Contact Form</h3>
                <p className="text-sm text-muted-foreground">contact-form.md – 1 Feld hinzugefügt</p>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-purple-200">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 4</Badge>
                    <span className="text-sm font-medium">Interne Notizen</span>
                    <Badge variant="outline">Basic Toolbar (8)</Badge>
                  </div>
                  <RichTextField
                    label="Interne Notizen"
                    placeholder="Persönliche Präferenzen, Gesprächsnotizen, Besonderheiten..."
                    minHeight={150}
                    maxLength={1000}
                    helpText="Interne Notizen zu diesem Kontakt (nur für Mitarbeiter sichtbar)"
                    toolbar="basic"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Form */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-1">4. Location Form</h3>
                <p className="text-sm text-muted-foreground">
                  location-form.md – 1 Feld hinzugefügt (neue Sektion)
                </p>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-orange-200">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 5</Badge>
                    <span className="text-sm font-medium">Standortbeschreibung</span>
                    <Badge variant="outline">Basic Toolbar (8)</Badge>
                  </div>
                  <RichTextField
                    label="Standortbeschreibung"
                    placeholder="Besonderheiten des Standorts, Anfahrtsbeschreibung, Zugangsinformationen..."
                    minHeight={150}
                    maxLength={2000}
                    helpText="Detaillierte Informationen zu diesem Standort für interne Zwecke"
                    toolbar="basic"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Opportunity Form */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-1">5. Opportunity Form</h3>
                <p className="text-sm text-muted-foreground">
                  opportunity-form.md – 3 Felder migriert
                </p>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-yellow-200">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 6</Badge>
                    <span className="text-sm font-medium">Beschreibung</span>
                    <Badge variant="outline">Standard Toolbar (12)</Badge>
                  </div>
                  <RichTextField
                    label="Beschreibung"
                    placeholder="Details zur Opportunity, Kundenanforderungen, nächste Schritte..."
                    minHeight={200}
                    maxLength={5000}
                    helpText="Detaillierte Beschreibung. Nutzen Sie Aufgabenlisten für Action Items."
                    toolbar="standard"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 7</Badge>
                    <span className="text-sm font-medium">Nächster Schritt</span>
                    <Badge variant="outline">Basic Toolbar (8)</Badge>
                  </div>
                  <RichTextField
                    label="Nächster Schritt"
                    placeholder="Was ist der nächste Schritt..."
                    minHeight={100}
                    maxLength={500}
                    helpText="Konkreter nächster Action Item"
                    toolbar="basic"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 8</Badge>
                    <span className="text-sm font-medium">Grund für Verlust</span>
                    <Badge variant="outline">Basic Toolbar (8)</Badge>
                    <Badge variant="secondary">Conditional (Status=Verloren)</Badge>
                  </div>
                  <RichTextField
                    label="Grund für Verlust"
                    placeholder="Warum wurde die Opportunity verloren..."
                    minHeight={120}
                    maxLength={1000}
                    helpText="Wichtig für zukünftige Analysen und Verbesserungen"
                    toolbar="basic"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Project Form */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-1">6. Project Form</h3>
                <p className="text-sm text-muted-foreground">
                  project-form.md – 3 Felder (1 migriert, 2 hinzugefügt)
                </p>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-pink-200">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 9</Badge>
                    <span className="text-sm font-medium">Projektbeschreibung (Tab 1)</span>
                    <Badge variant="outline">Advanced Toolbar (20)</Badge>
                  </div>
                  <RichTextField
                    label="Projektbeschreibung"
                    placeholder="Detaillierte Beschreibung des Projekts, Leistungsumfang, besondere Anforderungen..."
                    minHeight={250}
                    maxLength={5000}
                    helpText="Strukturierte Projektbeschreibung. Nutzen Sie Überschriften (H2) für Abschnitte und Tabellen für Spezifikationen."
                    toolbar="advanced"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 10</Badge>
                    <span className="text-sm font-medium">Externe Partner (Tab 4)</span>
                    <Badge variant="outline">Basic Toolbar (8)</Badge>
                  </div>
                  <RichTextField
                    label="Externe Partner"
                    placeholder="Liste der externen Dienstleister und Partner..."
                    minHeight={100}
                    maxLength={1000}
                    helpText="Externe Dienstleister, Subunternehmer, etc."
                    toolbar="basic"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 11</Badge>
                    <span className="text-sm font-medium">
                      Projektnotizen (Tab 5 – NEU)
                    </span>
                    <Badge variant="outline">Advanced Toolbar (20)</Badge>
                    <Badge variant="secondary">Neues Feld</Badge>
                  </div>
                  <RichTextField
                    label="Projektnotizen"
                    placeholder="Projektnotizen, Milestones, offene Punkte, Lessons Learned..."
                    minHeight={200}
                    maxLength={5000}
                    helpText="Laufende Notizen zum Projekt. Nutzen Sie Aufgabenlisten für Milestones und offene Punkte."
                    toolbar="advanced"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Invoice Form */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-1">7. Invoice Form</h3>
                <p className="text-sm text-muted-foreground">
                  invoice-form.md – 1 Feld migriert (mit GoBD-Sperre)
                </p>
              </div>

              <div className="space-y-6 pl-4 border-l-2 border-red-200">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>Feld 12</Badge>
                    <span className="text-sm font-medium">Bemerkungen / Zahlungsbedingungen</span>
                    <Badge variant="outline">Basic Toolbar (8)</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" />
                      GoBD Lock
                    </Badge>
                  </div>
                  <RichTextField
                    label="Bemerkungen / Zahlungsbedingungen"
                    placeholder="Zahlungsbedingungen, Lieferbedingungen, rechtliche Hinweise..."
                    minHeight={120}
                    maxLength={2000}
                    helpText="Wird auf gedruckter Rechnung angezeigt"
                    toolbar="basic"
                    locked
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Dieses Feld wird nach Finalisierung der Rechnung gesperrt (GoBD-konform)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Migration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Zusammenfassung</CardTitle>
          <CardDescription>Übersicht der durchgeführten Änderungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border border-border rounded-lg p-4">
              <h4 className="mb-3">Formulare</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Badge variant="outline">1</Badge>
                  <span>Activity Protocol (2 Felder)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">2</Badge>
                  <span>Customer (1 Feld)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">3</Badge>
                  <span>Contact (1 Feld)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">4</Badge>
                  <span>Location (1 Feld)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">5</Badge>
                  <span>Opportunity (3 Felder)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">6</Badge>
                  <span>Project (3 Felder)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">7</Badge>
                  <span>Invoice (1 Feld)</span>
                </li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h4 className="mb-3">Toolbar-Varianten</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Basic (8 Buttons)</span>
                  <Badge>6 Felder</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Basic+Tasks (9 Buttons)</span>
                  <Badge>1 Feld</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Standard (12 Buttons)</span>
                  <Badge>2 Felder</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Advanced (20 Buttons)</span>
                  <Badge>2 Felder</Badge>
                </li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h4 className="mb-3">Spezielle Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  <span>Spracheingabe (Activity Protocol)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span>GoBD-Sperre (Invoice Form)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-600" />
                  <span>Aufgabenlisten (2 Felder)</span>
                </li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h4 className="mb-3">Zeichenlimits</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 500 Zeichen: 2 Felder (kurze Notizen)</li>
                <li>• 1.000 Zeichen: 5 Felder (mittlere Notizen)</li>
                <li>• 2.000 Zeichen: 3 Felder (lange Beschreibungen)</li>
                <li>• 5.000 Zeichen: 3 Felder (Projektdokumente)</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h4 className="mb-3">Mindesthöhen</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 100px: 3 Felder (kurze Inputs)</li>
                <li>• 120-150px: 4 Felder (mittlere Inputs)</li>
                <li>• 200px: 3 Felder (lange Beschreibungen)</li>
                <li>• 250px: 1 Feld (Projektbeschreibung)</li>
              </ul>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h4 className="mb-3">Gesamt-Statistik</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Formulare aktualisiert:</span>
                  <Badge variant="secondary">7</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Felder migriert:</span>
                  <Badge variant="secondary">12</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Toolbar-Varianten:</span>
                  <Badge variant="secondary">4</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Buttons gesamt:</span>
                  <Badge variant="secondary">20</Badge>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}