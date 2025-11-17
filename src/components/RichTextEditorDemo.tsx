import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Label } from './ui/label';
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
  ChevronDown,
  ChevronUp,
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
  return <div className="w-px h-8 bg-border" />;
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
    <div
      className={`text-xs ${color}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {current.toLocaleString('de-DE')} / {max.toLocaleString('de-DE')} Zeichen
    </div>
  );
}

// Basic Toolbar (8 buttons)
interface BasicToolbarProps {
  activeButtons?: string[];
  onButtonClick?: (button: string) => void;
}

function BasicToolbar({ activeButtons = [], onButtonClick }: BasicToolbarProps) {
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <EditorButton
        icon={Bold}
        label="Fett"
        shortcut="Strg+B"
        isActive={isActive('bold')}
        onClick={() => onButtonClick?.('bold')}
      />
      <EditorButton
        icon={Italic}
        label="Kursiv"
        shortcut="Strg+I"
        isActive={isActive('italic')}
        onClick={() => onButtonClick?.('italic')}
      />
      <EditorButton
        icon={Underline}
        label="Unterstrichen"
        shortcut="Strg+U"
        isActive={isActive('underline')}
        onClick={() => onButtonClick?.('underline')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={List}
        label="Aufzählung"
        isActive={isActive('bulletList')}
        onClick={() => onButtonClick?.('bulletList')}
      />
      <EditorButton
        icon={ListOrdered}
        label="Nummerierte Liste"
        isActive={isActive('orderedList')}
        onClick={() => onButtonClick?.('orderedList')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={LinkIcon}
        label="Link einfügen"
        onClick={() => onButtonClick?.('link')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Undo}
        label="Rückgängig"
        shortcut="Strg+Z"
        onClick={() => onButtonClick?.('undo')}
      />
      <EditorButton
        icon={Redo}
        label="Wiederherstellen"
        shortcut="Strg+Y"
        onClick={() => onButtonClick?.('redo')}
      />
    </div>
  );
}

// Standard Toolbar (12 buttons)
function StandardToolbar({ activeButtons = [], onButtonClick }: BasicToolbarProps) {
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <EditorButton
        icon={Bold}
        label="Fett"
        shortcut="Strg+B"
        isActive={isActive('bold')}
        onClick={() => onButtonClick?.('bold')}
      />
      <EditorButton
        icon={Italic}
        label="Kursiv"
        shortcut="Strg+I"
        isActive={isActive('italic')}
        onClick={() => onButtonClick?.('italic')}
      />
      <EditorButton
        icon={Underline}
        label="Unterstrichen"
        shortcut="Strg+U"
        isActive={isActive('underline')}
        onClick={() => onButtonClick?.('underline')}
      />
      <EditorButton
        icon={Strikethrough}
        label="Durchgestrichen"
        isActive={isActive('strike')}
        onClick={() => onButtonClick?.('strike')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Heading2}
        label="Überschrift 2"
        isActive={isActive('h2')}
        onClick={() => onButtonClick?.('h2')}
      />
      <EditorButton
        icon={Heading3}
        label="Überschrift 3"
        isActive={isActive('h3')}
        onClick={() => onButtonClick?.('h3')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={List}
        label="Aufzählung"
        isActive={isActive('bulletList')}
        onClick={() => onButtonClick?.('bulletList')}
      />
      <EditorButton
        icon={ListOrdered}
        label="Nummerierte Liste"
        isActive={isActive('orderedList')}
        onClick={() => onButtonClick?.('orderedList')}
      />
      <EditorButton
        icon={CheckSquare}
        label="Aufgabenliste"
        isActive={isActive('taskList')}
        onClick={() => onButtonClick?.('taskList')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Quote}
        label="Zitat"
        isActive={isActive('blockquote')}
        onClick={() => onButtonClick?.('blockquote')}
      />
      <EditorButton
        icon={LinkIcon}
        label="Link einfügen"
        onClick={() => onButtonClick?.('link')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Undo}
        label="Rückgängig"
        shortcut="Strg+Z"
        onClick={() => onButtonClick?.('undo')}
      />
      <EditorButton
        icon={Redo}
        label="Wiederherstellen"
        shortcut="Strg+Y"
        onClick={() => onButtonClick?.('redo')}
      />
    </div>
  );
}

// Advanced Toolbar (20+ buttons)
function AdvancedToolbar({ activeButtons = [], onButtonClick }: BasicToolbarProps) {
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <EditorButton
        icon={Bold}
        label="Fett"
        shortcut="Strg+B"
        isActive={isActive('bold')}
        onClick={() => onButtonClick?.('bold')}
      />
      <EditorButton
        icon={Italic}
        label="Kursiv"
        shortcut="Strg+I"
        isActive={isActive('italic')}
        onClick={() => onButtonClick?.('italic')}
      />
      <EditorButton
        icon={Underline}
        label="Unterstrichen"
        shortcut="Strg+U"
        isActive={isActive('underline')}
        onClick={() => onButtonClick?.('underline')}
      />
      <EditorButton
        icon={Strikethrough}
        label="Durchgestrichen"
        isActive={isActive('strike')}
        onClick={() => onButtonClick?.('strike')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Heading1}
        label="Überschrift 1"
        isActive={isActive('h1')}
        onClick={() => onButtonClick?.('h1')}
      />
      <EditorButton
        icon={Heading2}
        label="Überschrift 2"
        isActive={isActive('h2')}
        onClick={() => onButtonClick?.('h2')}
      />
      <EditorButton
        icon={Heading3}
        label="Überschrift 3"
        isActive={isActive('h3')}
        onClick={() => onButtonClick?.('h3')}
      />
      <EditorButton
        icon={Pilcrow}
        label="Absatz"
        isActive={isActive('paragraph')}
        onClick={() => onButtonClick?.('paragraph')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={List}
        label="Aufzählung"
        isActive={isActive('bulletList')}
        onClick={() => onButtonClick?.('bulletList')}
      />
      <EditorButton
        icon={ListOrdered}
        label="Nummerierte Liste"
        isActive={isActive('orderedList')}
        onClick={() => onButtonClick?.('orderedList')}
      />
      <EditorButton
        icon={CheckSquare}
        label="Aufgabenliste"
        isActive={isActive('taskList')}
        onClick={() => onButtonClick?.('taskList')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Quote}
        label="Zitat"
        isActive={isActive('blockquote')}
        onClick={() => onButtonClick?.('blockquote')}
      />
      <EditorButton
        icon={Code}
        label="Code-Block"
        isActive={isActive('codeBlock')}
        onClick={() => onButtonClick?.('codeBlock')}
      />
      <EditorButton
        icon={Minus}
        label="Trennlinie"
        onClick={() => onButtonClick?.('hr')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={LinkIcon}
        label="Link einfügen"
        onClick={() => onButtonClick?.('link')}
      />
      <EditorButton
        icon={TableIcon}
        label="Tabelle einfügen"
        onClick={() => onButtonClick?.('table')}
      />

      <ToolbarSeparator />

      <EditorButton
        icon={Undo}
        label="Rückgängig"
        shortcut="Strg+Z"
        onClick={() => onButtonClick?.('undo')}
      />
      <EditorButton
        icon={Redo}
        label="Wiederherstellen"
        shortcut="Strg+Y"
        onClick={() => onButtonClick?.('redo')}
      />
    </div>
  );
}

// Rich Text Editor Component
interface RichTextEditorProps {
  label: string;
  placeholder: string;
  minHeight?: number;
  maxLength: number;
  helpText?: string;
  toolbar: 'basic' | 'standard' | 'advanced';
  withVoice?: boolean;
  locked?: boolean;
  error?: string;
  disabled?: boolean;
}

function RichTextEditor({
  label,
  placeholder,
  minHeight = 200,
  maxLength,
  helpText,
  toolbar,
  withVoice = false,
  locked = false,
  error = '',
  disabled = false,
}: RichTextEditorProps) {
  const [content, setContent] = useState('');
  const [activeButtons, setActiveButtons] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleButtonClick = (button: string) => {
    if (disabled) return;

    // Toggle active state
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
        className={`border rounded-lg bg-white overflow-hidden transition-all ${
          error
            ? 'border-red-500 border-2'
            : isFocused
              ? 'border-primary'
              : 'border-border'
        } ${disabled || locked ? 'bg-muted' : ''}`}
      >
        {/* Toolbar */}
        <div className="h-12 border-b bg-white px-2 py-2 flex items-center overflow-x-auto">
          {toolbar === 'basic' && (
            <BasicToolbar activeButtons={activeButtons} onButtonClick={handleButtonClick} />
          )}
          {toolbar === 'standard' && (
            <StandardToolbar activeButtons={activeButtons} onButtonClick={handleButtonClick} />
          )}
          {toolbar === 'advanced' && (
            <AdvancedToolbar activeButtons={activeButtons} onButtonClick={handleButtonClick} />
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
            className={`p-4 outline-none min-h-full prose prose-sm max-w-none ${
              disabled || locked ? 'cursor-not-allowed text-muted-foreground' : ''
            }`}
            data-placeholder={placeholder}
            style={{
              minHeight,
            }}
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

          {/* Character Counter */}
          <div className="absolute bottom-2 right-2">
            <CharacterCounter current={characterCount} max={maxLength} />
          </div>

          {/* Voice-to-Text Button (Activity Protocol only) */}
          {withVoice && !disabled && !locked && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="absolute bottom-10 right-2 h-11 w-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
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
      </div>

      {/* Help Text or Error */}
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : helpText ? (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      ) : null}
    </div>
  );
}

// Mobile Toolbar Demo
function MobileToolbar({ activeButtons = [], onButtonClick }: BasicToolbarProps) {
  const [expanded, setExpanded] = useState(false);
  const isActive = (button: string) => activeButtons.includes(button);

  return (
    <div className="space-y-2">
      {/* Essential buttons row */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onButtonClick?.('bold')}
          className={`h-11 w-11 rounded-md flex items-center justify-center transition-colors ${
            isActive('bold') ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
          }`}
        >
          <Bold className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          onClick={() => onButtonClick?.('italic')}
          className={`h-11 w-11 rounded-md flex items-center justify-center transition-colors ${
            isActive('italic') ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
          }`}
        >
          <Italic className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          onClick={() => onButtonClick?.('bulletList')}
          className={`h-11 w-11 rounded-md flex items-center justify-center transition-colors ${
            isActive('bulletList') ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
          }`}
        >
          <List className="h-5 w-5" strokeWidth={2} />
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto"
        >
          {expanded ? (
            <>
              Weniger <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Mehr <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Expanded buttons */}
      {expanded && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
          <button
            onClick={() => onButtonClick?.('underline')}
            className={`h-11 w-11 rounded-md flex items-center justify-center transition-colors ${
              isActive('underline') ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
            }`}
          >
            <Underline className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            onClick={() => onButtonClick?.('orderedList')}
            className={`h-11 w-11 rounded-md flex items-center justify-center transition-colors ${
              isActive('orderedList')
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <ListOrdered className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            onClick={() => onButtonClick?.('link')}
            className="h-11 w-11 rounded-md flex items-center justify-center transition-colors text-foreground hover:bg-muted"
          >
            <LinkIcon className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            onClick={() => onButtonClick?.('undo')}
            className="h-11 w-11 rounded-md flex items-center justify-center transition-colors text-foreground hover:bg-muted"
          >
            <Undo className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            onClick={() => onButtonClick?.('redo')}
            className="h-11 w-11 rounded-md flex items-center justify-center transition-colors text-foreground hover:bg-muted"
          >
            <Redo className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

// Demo: Basic Toolbar Editor
function BasicToolbarDemo() {
  return (
    <div className="space-y-4">
      <h4>Basic Toolbar (8 Buttons)</h4>
      <RichTextEditor
        label="Interne Notizen"
        placeholder="Besonderheiten, Präferenzen, historische Infos..."
        minHeight={150}
        maxLength={1000}
        helpText="Diese Notizen sind nur für interne Zwecke sichtbar"
        toolbar="basic"
      />
      <p className="text-sm text-muted-foreground">
        Verwendet in: Customer Form, Contact Form, Location Form, Invoice Form
      </p>
    </div>
  );
}

// Demo: Standard Toolbar Editor
function StandardToolbarDemo() {
  return (
    <div className="space-y-4">
      <h4>Standard Toolbar (12 Buttons)</h4>
      <RichTextEditor
        label="Beschreibung"
        placeholder="Was wurde besprochen oder vereinbart? Nächste Schritte..."
        minHeight={200}
        maxLength={2000}
        helpText="Detaillierte Notizen zur Aktivität. Nutzen Sie Formatierung für Struktur."
        toolbar="standard"
      />
      <p className="text-sm text-muted-foreground">
        Verwendet in: Activity Protocol Form, Opportunity Form
      </p>
    </div>
  );
}

// Demo: Advanced Toolbar Editor
function AdvancedToolbarDemo() {
  return (
    <div className="space-y-4">
      <h4>Advanced Toolbar (20+ Buttons)</h4>
      <RichTextEditor
        label="Projektbeschreibung"
        placeholder="Detaillierte Beschreibung des Projekts, Leistungsumfang, besondere Anforderungen..."
        minHeight={250}
        maxLength={5000}
        helpText="Strukturierte Projektbeschreibung. Nutzen Sie Überschriften (H2) für Abschnitte und Tabellen für Spezifikationen."
        toolbar="advanced"
      />
      <p className="text-sm text-muted-foreground">Verwendet in: Project Form</p>
    </div>
  );
}

// Demo: With Voice-to-Text
function VoiceInputDemo() {
  return (
    <div className="space-y-4">
      <h4>Mit Spracheingabe (Activity Protocol)</h4>
      <RichTextEditor
        label="Beschreibung"
        placeholder="Was wurde besprochen oder vereinbart? Nächste Schritte..."
        minHeight={200}
        maxLength={2000}
        helpText="Detaillierte Notizen zur Aktivität. Nutzen Sie Formatierung für Struktur."
        toolbar="standard"
        withVoice
      />
      <p className="text-sm text-muted-foreground">
        Mikrofon-Button (unten rechts) für Sprach-zu-Text-Eingabe
      </p>
    </div>
  );
}

// Demo: Locked State (Invoice)
function LockedStateDemo() {
  return (
    <div className="space-y-4">
      <h4>Gesperrt (GoBD - Finalisierte Rechnung)</h4>
      <RichTextEditor
        label="Bemerkungen / Zahlungsbedingungen"
        placeholder="Zahlungsbedingungen, Lieferbedingungen, rechtliche Hinweise..."
        minHeight={120}
        maxLength={2000}
        helpText="Wird auf gedruckter Rechnung angezeigt"
        toolbar="basic"
        locked
        disabled
      />
      <p className="text-sm text-muted-foreground">
        Nach Finalisierung wird das Feld gesperrt (GoBD-konform)
      </p>
    </div>
  );
}

// Demo: Error State
function ErrorStateDemo() {
  return (
    <div className="space-y-4">
      <h4>Fehler-Status</h4>
      <RichTextEditor
        label="Projektbeschreibung"
        placeholder="Detaillierte Beschreibung des Projekts..."
        minHeight={150}
        maxLength={5000}
        toolbar="basic"
        error="Bitte geben Sie eine Projektbeschreibung ein."
      />
      <p className="text-sm text-muted-foreground">Roter Rahmen (2px) bei Validierungsfehlern</p>
    </div>
  );
}

// Demo: Character Count Warning
function CharacterCountDemo() {
  return (
    <div className="space-y-4">
      <h4>Zeichenzähler mit Farbcodierung</h4>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Normal (0-80%)</p>
              <CharacterCounter current={400} max={1000} />
              <p className="text-xs text-muted-foreground">Grau (#6b7280)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Warnung (80-100%)</p>
              <CharacterCounter current={900} max={1000} />
              <p className="text-xs text-muted-foreground">Orange (#f97316)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Fehler (&gt;100%)</p>
              <CharacterCounter current={1050} max={1000} />
              <p className="text-xs text-muted-foreground">Rot (#ef4444)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Demo: Mobile Toolbar
function MobileToolbarDemo() {
  const [activeButtons, setActiveButtons] = useState<string[]>([]);

  const handleButtonClick = (button: string) => {
    if (activeButtons.includes(button)) {
      setActiveButtons(activeButtons.filter((b) => b !== button));
    } else {
      setActiveButtons([...activeButtons, button]);
    }
  };

  return (
    <div className="space-y-4">
      <h4>Mobile Toolbar (Responsive)</h4>

      <Card className="max-w-md">
        <CardContent className="pt-6">
          <div className="border rounded-lg bg-white overflow-hidden">
            <div className="border-b bg-white p-2">
              <MobileToolbar activeButtons={activeButtons} onButtonClick={handleButtonClick} />
            </div>
            <div
              className="p-4 text-sm text-muted-foreground italic"
              style={{ minHeight: '150px' }}
            >
              Was wurde besprochen oder vereinbart? Nächste Schritte...
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Für Bildschirme &lt; 768px: Touch-freundliche Buttons (44px × 44px), erweiterbarer &quot;Mehr&quot;-Button
      </p>
    </div>
  );
}

// Main demo component
export function RichTextEditorDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Rich Text Editor – WYSIWYG für Formulare</CardTitle>
          <CardDescription>
            TipTap-basierter Rich Text Editor mit 3 Toolbar-Varianten (Basic, Standard, Advanced)
            für 7 KOMPASS-Formulare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <BasicToolbarDemo />
            <Separator />
            <StandardToolbarDemo />
            <Separator />
            <AdvancedToolbarDemo />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Spezielle Funktionen</CardTitle>
          <CardDescription>
            Spracheingabe, GoBD-Sperre, Fehlerbehandlung, Character Count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <VoiceInputDemo />
            <Separator />
            <LockedStateDemo />
            <Separator />
            <ErrorStateDemo />
            <Separator />
            <CharacterCountDemo />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Mobile Ansicht</CardTitle>
          <CardDescription>
            Responsive Toolbar mit erweiterbarem &quot;Mehr&quot;-Button
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MobileToolbarDemo />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Toolbar-Varianten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Basic: 8 Buttons (Notizen)</li>
              <li>• Standard: 12 Buttons (Beschreibungen)</li>
              <li>• Advanced: 20+ Buttons (Projekte)</li>
              <li>• Höhe: 48px (12 rem)</li>
              <li>• Button-Größe: 32px × 32px</li>
              <li>• Gap: 4px</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Button-Zustände</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Default: Transparent, grau-700</li>
              <li>• Hover: Grau-100 Hintergrund</li>
              <li>• Active: Primary Hintergrund, weiß</li>
              <li>• Disabled: 50% Opacity</li>
              <li>• Icon-Größe: 16px × 16px</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Content Area</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Padding: 16px (p-4)</li>
              <li>• Min-Höhe: 120-250px</li>
              <li>• Prose Styling (16px, 1.5)</li>
              <li>• Placeholder: Kursiv, grau-400</li>
              <li>• Border: 1px, #e5e7eb</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zeichenzähler</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Position: Unten rechts</li>
              <li>• Schriftgröße: 12px</li>
              <li>• Normal: Grau (#6b7280)</li>
              <li>• Warnung: Orange (#f97316)</li>
              <li>• Fehler: Rot (#ef4444)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Spracheingabe</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Nur: Activity Protocol</li>
              <li>• Button: 44px × 44px, rund</li>
              <li>• Farbe: Primary, weiß Icon</li>
              <li>• Position: Unten rechts</li>
              <li>• Mic Icon (Lucide)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">GoBD-Sperre</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Nur: Invoice Form</li>
              <li>• Lock Icon Badge (oben rechts)</li>
              <li>• Grauer Hintergrund</li>
              <li>• Alle Buttons deaktiviert</li>
              <li>• contentEditable=false</li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Button-Icons (Lucide React)</h4>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {[
            { icon: Bold, label: 'Fett' },
            { icon: Italic, label: 'Kursiv' },
            { icon: Underline, label: 'Unterstrichen' },
            { icon: Strikethrough, label: 'Durchgestrichen' },
            { icon: Heading1, label: 'Überschrift 1' },
            { icon: Heading2, label: 'Überschrift 2' },
            { icon: Heading3, label: 'Überschrift 3' },
            { icon: Pilcrow, label: 'Absatz' },
            { icon: List, label: 'Aufzählung' },
            { icon: ListOrdered, label: 'Nummerierte Liste' },
            { icon: CheckSquare, label: 'Aufgabenliste' },
            { icon: Quote, label: 'Zitat' },
            { icon: Code, label: 'Code-Block' },
            { icon: Minus, label: 'Trennlinie' },
            { icon: LinkIcon, label: 'Link' },
            { icon: TableIcon, label: 'Tabelle' },
            { icon: Undo, label: 'Rückgängig' },
            { icon: Redo, label: 'Wiederherstellen' },
            { icon: Mic, label: 'Mikrofon' },
            { icon: Lock, label: 'Gesperrt' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-md border flex items-center justify-center">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-4">Formular-Zuordnung</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Toolbar (8 Buttons)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    1
                  </Badge>
                  <span>Customer Form – Interne Notizen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    2
                  </Badge>
                  <span>Contact Form – Interne Notizen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    3
                  </Badge>
                  <span>Location Form – Standortbeschreibung</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    4
                  </Badge>
                  <span>Invoice Form – Bemerkungen (+ GoBD Lock)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Standard Toolbar (12 Buttons)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    5
                  </Badge>
                  <span>Activity Protocol – Beschreibung (+ Voice)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    6
                  </Badge>
                  <span>Opportunity Form – Beschreibung</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Advanced Toolbar (20+ Buttons)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    7
                  </Badge>
                  <span>Project Form Tab 1 – Projektbeschreibung</span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    8
                  </Badge>
                  <span>Project Form Tab 5 – Projektnotizen</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spezielle Funktionen</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Mic className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>Spracheingabe: Activity Protocol Form</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>GoBD-Sperre: Invoice Form (finalisiert)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}