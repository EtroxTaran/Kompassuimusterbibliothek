import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import {
  HelpCircle,
  X,
  ArrowRight,
  Check,
  Rocket,
  Play,
  Book,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Users,
  Calendar,
  MapPin,
  Camera,
  Mic,
  WifiOff,
  Lightbulb,
  AlertTriangle,
  Info,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Mail,
  Phone,
  Upload,
  Search,
  ExternalLink,
  Keyboard,
  Star,
  TrendingUp,
  Shield,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';

// Types
type UserRole = 'ADM' | 'GF' | 'PLAN' | 'BUCH' | 'KALK' | 'INNEN';
type OnboardingStep = 'welcome' | 'role' | 'features' | 'tour' | 'complete';
type TourStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type TooltipType = 'info' | 'tip' | 'warning' | 'new';

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  category: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface KeyboardShortcut {
  key: string;
  description: string;
}

// Mock data
const roleFeatures = {
  ADM: [
    'Eigene Kunden verwalten',
    'Aktivitäten vor Ort erfassen',
    'Opportunities tracken',
    'Offline arbeiten',
  ],
  GF: [
    'Alle Kundendaten einsehen',
    'Team-Performance überwachen',
    'Finanzberichte erstellen',
    'Benutzer verwalten',
  ],
  PLAN: [
    'Projekte planen',
    'Teams koordinieren',
    'Ressourcen zuweisen',
    'Gantt-Charts nutzen',
  ],
  BUCH: [
    'Rechnungen verwalten',
    'GoBD-konforme Buchungen',
    'DATEV-Export',
    'Zahlungen tracken',
  ],
  KALK: [
    'Kalkulationen erstellen',
    'Angebote berechnen',
    'Materialkalkulation',
    'Preisgestaltung',
  ],
  INNEN: [
    'Aufträge koordinieren',
    'Kunden betreuen',
    'Termine planen',
    'Dokumente verwalten',
  ],
};

const videoTutorials: VideoTutorial[] = [
  { id: '1', title: 'Kunden verwalten', duration: '3:45 Min', thumbnail: '🎥', category: 'Kunden' },
  { id: '2', title: 'Aktivitäten erfassen', duration: '2:30 Min', thumbnail: '🎥', category: 'Aktivitäten' },
  { id: '3', title: 'Offline arbeiten', duration: '4:15 Min', thumbnail: '🎥', category: 'Offline' },
  { id: '4', title: 'Visitenkarten scannen', duration: '1:50 Min', thumbnail: '🎥', category: 'Kunden' },
  { id: '5', title: 'Opportunities tracken', duration: '5:20 Min', thumbnail: '🎥', category: 'Opportunities' },
  { id: '6', title: 'Projekte planen', duration: '6:00 Min', thumbnail: '🎥', category: 'Projekte' },
];

const faqItems: FAQItem[] = [
  {
    question: 'Wie funktioniert der Offline-Modus?',
    answer: 'KOMPASS speichert alle Daten lokal auf Ihrem Gerät. Sie können auch ohne Internetverbindung arbeiten. Sobald Sie wieder online sind, werden Ihre Änderungen automatisch synchronisiert.',
  },
  {
    question: 'Kann ich Visitenkarten scannen?',
    answer: 'Ja! Mit dem Visitenkarten-Scanner können Sie Kontakte automatisch erfassen. Öffnen Sie einfach die Kontakterstellung und tippen Sie auf das Kamera-Symbol.',
  },
  {
    question: 'Wie erfasse ich Aktivitäten per Sprache?',
    answer: 'Klicken Sie auf den "+" Button und wählen Sie das Mikrofon-Symbol. Sprechen Sie Ihre Aktivität ein - KOMPASS transkribiert und speichert diese automatisch.',
  },
  {
    question: 'Welche Daten sehe ich als ADM?',
    answer: 'Als Außendienstmitarbeiter sehen Sie nur Ihre eigenen Kunden, Aktivitäten und Opportunities. Dies gewährleistet Datenschutz und fokussierte Arbeit.',
  },
];

const keyboardShortcuts: KeyboardShortcut[] = [
  { key: 'Strg + N', description: 'Neuer Kunde' },
  { key: 'Strg + K', description: 'Suche öffnen' },
  { key: 'Strg + A', description: 'Aktivität hinzufügen' },
  { key: 'F1', description: 'Hilfe öffnen' },
  { key: 'Strg + S', description: 'Speichern' },
  { key: 'Esc', description: 'Dialog schließen' },
];

// Get role info
function getRoleInfo(role: UserRole) {
  const roleConfig = {
    ADM: { name: 'Außendienst', icon: Users, color: 'text-green-600' },
    GF: { name: 'Geschäftsführung', icon: TrendingUp, color: 'text-purple-600' },
    PLAN: { name: 'Planung', icon: Calendar, color: 'text-blue-600' },
    BUCH: { name: 'Buchhaltung', icon: FileText, color: 'text-cyan-600' },
    KALK: { name: 'Kalkulation', icon: ListChecks, color: 'text-amber-600' },
    INNEN: { name: 'Innendienst', icon: Shield, color: 'text-gray-600' },
  };
  return roleConfig[role];
}

// Welcome Screen Component
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
      <div className="mb-8">
        <div className="h-48 w-48 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
          <Rocket className="h-24 w-24 text-primary" />
        </div>
        <h1 className="text-white mb-4">Willkommen bei KOMPASS</h1>
        <p className="text-white/90 text-xl">
          Ihr intelligentes CRM & Projektmanagement-Tool
        </p>
      </div>
      <Button size="lg" onClick={onNext} className="bg-white text-primary hover:bg-white/90">
        Los geht's
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

// Role Introduction Screen
function RoleIntroScreen({ role, onNext }: { role: UserRole; onNext: () => void }) {
  const roleInfo = getRoleInfo(role);
  const Icon = roleInfo.icon;
  const features = roleFeatures[role];

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className={`h-32 w-32 rounded-full bg-background flex items-center justify-center mb-6 mx-auto ${roleInfo.color}`}>
            <Icon className="h-16 w-16" />
          </div>
          <h2 className="text-white mb-2">Ihre Rolle: {roleInfo.name} ({role})</h2>
          <p className="text-white/90">Als {roleInfo.name} können Sie:</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button size="lg" onClick={onNext}>
            Weiter
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Key Features Screen
function KeyFeaturesScreen({ onStartTour, onSkip }: { onStartTour: () => void; onSkip: () => void }) {
  const features = [
    { icon: WifiOff, title: 'Offline-First', description: 'Arbeiten Sie überall, auch ohne Internet' },
    { icon: Mic, title: 'Spracherfassung', description: 'Aktivitäten per Sprache erfassen' },
    { icon: MapPin, title: 'GPS-Navigation', description: 'Routen zu Kunden planen' },
    { icon: Camera, title: 'Visitenkarten-Scan', description: 'Kontakte automatisch erfassen' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <div className="max-w-4xl w-full">
        <h2 className="text-center text-white mb-8">Wichtige Features für Sie</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={onStartTour}>
            <Rocket className="mr-2 h-5 w-5" />
            Tour starten
          </Button>
          <Button size="lg" variant="ghost" onClick={onSkip} className="text-white hover:text-white/90">
            Überspringen
          </Button>
        </div>
      </div>
    </div>
  );
}

// Tour Step Component
function TourStepOverlay({
  step,
  onNext,
  onEnd,
}: {
  step: TourStep;
  onNext: () => void;
  onEnd: () => void;
}) {
  const tourSteps = [
    {
      title: 'Ihr Dashboard',
      description: 'Hier sehen Sie Ihre wichtigsten Informationen auf einen Blick',
      icon: LayoutDashboard,
    },
    {
      title: 'Ihre Kunden',
      description: 'Ihre Kunden werden hier angezeigt. Als ADM sehen Sie nur Ihre eigenen Kunden.',
      icon: Users,
    },
    {
      title: 'Aktivität hinzufügen',
      description: 'Mit diesem Button erfassen Sie schnell Aktivitäten - auch per Sprache!',
      icon: Mic,
    },
    {
      title: 'Kartenansicht',
      description: 'Planen Sie Ihre täglichen Kundenbesuche mit GPS-Navigation',
      icon: MapPin,
    },
    {
      title: 'Offline-Modus',
      description: 'Arbeiten Sie offline weiter - Ihre Daten werden automatisch synchronisiert',
      icon: WifiOff,
    },
    {
      title: 'Visitenkarten-Scanner',
      description: 'Scannen Sie Visitenkarten und erfassen Sie Kontakte automatisch',
      icon: Camera,
    },
    {
      title: 'Hilfe',
      description: 'Brauchen Sie Hilfe? Klicken Sie hier für Tutorials und Support',
      icon: HelpCircle,
    },
  ];

  const currentStep = tourSteps[step - 1];
  const Icon = currentStep.icon;
  const isLastStep = step === 7;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="outline">{step} von 7</Badge>
          </div>

          <h3 className="mb-2">{currentStep.title}</h3>
          <p className="text-muted-foreground mb-6">{currentStep.description}</p>

          <Progress value={(step / 7) * 100} className="mb-6" />

          <div className="flex justify-between">
            <Button variant="ghost" onClick={onEnd}>
              Tour beenden
            </Button>
            <Button onClick={isLastStep ? onEnd : onNext}>
              {isLastStep ? 'Abschließen' : 'Weiter'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Tour Complete Screen
function TourCompleteScreen({ onDashboard }: { onDashboard: () => void }) {
  return (
    <div className="fixed inset-0 bg-primary z-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="h-32 w-32 rounded-full bg-green-500 flex items-center justify-center mb-6 mx-auto">
            <Check className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-white mb-4">Tour abgeschlossen!</h1>
          <p className="text-white/90 text-xl">
            Sie sind jetzt bereit, mit KOMPASS zu arbeiten!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={onDashboard} className="bg-white text-primary hover:bg-white/90">
            Zu meinem Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="ghost" className="text-white hover:text-white/90">
            Hilfe-Center öffnen
          </Button>
          <Button size="lg" variant="ghost" className="text-white hover:text-white/90">
            Tour erneut starten
          </Button>
        </div>
      </div>
    </div>
  );
}

// Contextual Tooltip Component
export function ContextualTooltip({
  type,
  message,
  onDismiss,
  onLearnMore,
}: {
  type: TooltipType;
  message: string;
  onDismiss: () => void;
  onLearnMore?: () => void;
}) {
  const config = {
    info: { bg: 'bg-blue-50 border-blue-200', icon: Info, iconColor: 'text-blue-600' },
    tip: { bg: 'bg-green-50 border-green-200', icon: Lightbulb, iconColor: 'text-green-600' },
    warning: { bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600' },
    new: { bg: 'bg-purple-50 border-purple-200', icon: Sparkles, iconColor: 'text-purple-600' },
  };

  const { bg, icon: IconComponent, iconColor } = config[type];

  return (
    <div className={`${bg} border rounded-lg p-4 shadow-lg max-w-sm relative`}>
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3">
        <IconComponent className={`h-5 w-5 ${iconColor} shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className="text-sm mb-3">{message}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onDismiss}>
              Verstanden
            </Button>
            {onLearnMore && (
              <Button size="sm" variant="link" className="p-0 h-auto" onClick={onLearnMore}>
                Mehr erfahren
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Help Panel Component
export function HelpPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'home' | 'getting-started' | 'videos' | 'faq' | 'shortcuts' | 'support'>('home');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[500px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle>Hilfe-Center</SheetTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Wie können wir helfen?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6">
            {activeSection === 'home' && (
              <div className="space-y-4">
                {/* Quick Links */}
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveSection('getting-started')}
                  >
                    <Rocket className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left flex-1">
                      <p className="mb-1">Erste Schritte</p>
                      <p className="text-xs text-muted-foreground">Lernen Sie KOMPASS kennen</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveSection('videos')}
                  >
                    <Play className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left flex-1">
                      <p className="mb-1">Video-Tutorials</p>
                      <p className="text-xs text-muted-foreground">6 Videos verfügbar</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveSection('faq')}
                  >
                    <Book className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left flex-1">
                      <p className="mb-1">Häufige Fragen (FAQ)</p>
                      <p className="text-xs text-muted-foreground">Schnelle Antworten</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => setActiveSection('support')}
                  >
                    <MessageCircle className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left flex-1">
                      <p className="mb-1">Support kontaktieren</p>
                      <p className="text-xs text-muted-foreground">Wir helfen Ihnen gerne</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <RefreshCw className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left flex-1">
                      <p className="mb-1">Produkttour wiederholen</p>
                      <p className="text-xs text-muted-foreground">Tour erneut starten</p>
                    </div>
                  </Button>
                </div>

                {/* Keyboard Shortcuts Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Keyboard className="h-4 w-4" />
                      Tastaturkürzel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {keyboardShortcuts.slice(0, 3).map((shortcut, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => setActiveSection('shortcuts')}
                    >
                      Alle anzeigen
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'getting-started' && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setActiveSection('home')}>
                  ← Zurück
                </Button>
                <h3 className="mb-4">Erste Schritte</h3>
                <div className="space-y-3">
                  {['Ersten Kunden anlegen', 'Aktivität erfassen', 'Offline arbeiten', 'Visitenkarte scannen'].map(
                    (guide, index) => (
                      <Card key={index} className="hover:border-primary transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary">{index + 1}</span>
                            </div>
                            <span>{guide}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}

            {activeSection === 'videos' && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setActiveSection('home')}>
                  ← Zurück
                </Button>
                <h3 className="mb-4">Video-Tutorials</h3>
                <div className="grid grid-cols-1 gap-4">
                  {videoTutorials.map((video) => (
                    <Card key={video.id} className="hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="h-20 w-28 bg-muted rounded-lg flex items-center justify-center shrink-0">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="mb-1">{video.title}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{video.duration}</span>
                              <Badge variant="outline">{video.category}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setActiveSection('home')}>
                  ← Zurück
                </Button>
                <h3 className="mb-4">Häufige Fragen</h3>
                <Accordion type="single" collapsible>
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-4">{item.answer}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">War das hilfreich?</span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {activeSection === 'shortcuts' && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setActiveSection('home')}>
                  ← Zurück
                </Button>
                <h3 className="mb-4">Tastaturkürzel</h3>
                <div className="space-y-3">
                  {keyboardShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>{shortcut.description}</span>
                      <kbd className="px-3 py-1.5 bg-background border border-border rounded font-mono text-sm">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'support' && (
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setActiveSection('home')}>
                  ← Zurück
                </Button>
                <h3 className="mb-4">Support kontaktieren</h3>

                {/* Support Channels */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm">E-Mail</p>
                        <a href="mailto:support@kompass.de" className="text-sm text-primary">
                          support@kompass.de
                        </a>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm">Telefon</p>
                        <a href="tel:+498912345678" className="text-sm text-primary">
                          +49-89-12345678
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Anfrage senden</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Betreff</Label>
                      <Input placeholder="Wie können wir helfen?" className="mt-2" />
                    </div>
                    <div>
                      <Label>Kategorie</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Wählen Sie eine Kategorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technisches Problem</SelectItem>
                          <SelectItem value="feature">Feature-Anfrage</SelectItem>
                          <SelectItem value="question">Frage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Beschreibung</Label>
                      <Textarea
                        placeholder="Beschreiben Sie Ihr Anliegen..."
                        rows={4}
                        className="mt-2 resize-none"
                      />
                    </div>
                    <div>
                      <Label>Anhänge</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Screenshots hier ablegen oder klicken
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label>Priorität</Label>
                      <RadioGroup defaultValue="normal" className="mt-2">
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">Normal</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high">Hoch</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="critical" id="critical" />
                          <Label htmlFor="critical">Kritisch</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Anfrage senden
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// Help Button (Floating)
export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center z-40"
      aria-label="Hilfe öffnen"
    >
      <HelpCircle className="h-6 w-6" />
    </button>
  );
}

// New Feature Banner Component
export function NewFeatureBanner({ onTry, onDismiss }: { onTry: () => void; onDismiss: () => void }) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white mb-1">NEU: Visitenkarten-Scanner verfügbar!</p>
            <p className="text-white/80 text-sm">
              Erfassen Sie Kontakte jetzt noch schneller
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onTry} className="bg-white text-purple-600 hover:bg-white/90">
            Jetzt ausprobieren
          </Button>
          <button onClick={onDismiss} className="text-white hover:text-white/80">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Changelog Component
export function ChangelogCard() {
  const updates = [
    {
      date: '15.11.2024',
      version: 'v1.1.0',
      title: 'Visitenkarten-Scanner',
      description: 'Erfassen Sie Kontakte jetzt noch schneller mit automatischer OCR-Erkennung',
      isNew: true,
    },
    {
      date: '01.11.2024',
      version: 'v1.0.5',
      title: 'Verbesserte Offline-Synchronisation',
      description: 'Schnellere Sync-Zeiten und bessere Konfliktauflösung',
      isNew: false,
    },
    {
      date: '15.10.2024',
      version: 'v1.0.0',
      title: 'Offizieller Launch',
      description: 'KOMPASS ist jetzt für alle Benutzer verfügbar',
      isNew: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Was ist neu?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {updates.map((update, index) => (
          <div key={index} className="border-l-2 border-primary pl-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground">{update.date}</span>
              <Badge variant="outline">{update.version}</Badge>
              {update.isNew && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">Neu</Badge>
              )}
            </div>
            <p className="mb-1">{update.title}</p>
            <p className="text-sm text-muted-foreground">{update.description}</p>
          </div>
        ))}
        <Button variant="link" className="p-0 h-auto" asChild>
          <a href="#" className="flex items-center gap-1">
            Alle Updates anzeigen
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Demo Component
export function HelpOnboardingDemo() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [tourStep, setTourStep] = useState<TourStep>(1);
  const [showTourComplete, setShowTourComplete] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showFeatureBanner, setShowFeatureBanner] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADM');

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
    setOnboardingStep('welcome');
  };

  const handleNextOnboarding = () => {
    if (onboardingStep === 'welcome') setOnboardingStep('role');
    else if (onboardingStep === 'role') setOnboardingStep('features');
  };

  const handleStartTour = () => {
    setOnboardingStep('tour');
    setTourStep(1);
  };

  const handleNextTour = () => {
    if (tourStep < 7) {
      setTourStep((tourStep + 1) as TourStep);
    }
  };

  const handleEndTour = () => {
    setShowTourComplete(true);
    setOnboardingStep('complete');
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    setOnboardingStep('welcome');
  };

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Benutzerrolle für Demo</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADM">ADM (Außendienst)</SelectItem>
                  <SelectItem value="GF">GF (Geschäftsführung)</SelectItem>
                  <SelectItem value="PLAN">PLAN (Planung)</SelectItem>
                  <SelectItem value="BUCH">BUCH (Buchhaltung)</SelectItem>
                  <SelectItem value="KALK">KALK (Kalkulation)</SelectItem>
                  <SelectItem value="INNEN">INNEN (Innendienst)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleStartOnboarding}>
                <Rocket className="h-4 w-4 mr-2" />
                Onboarding starten
              </Button>
              <Button onClick={() => setShowHelpPanel(true)} variant="outline">
                <HelpCircle className="h-4 w-4 mr-2" />
                Hilfe-Panel öffnen
              </Button>
              <Button onClick={() => setShowTooltip(!showTooltip)} variant="outline">
                <Lightbulb className="h-4 w-4 mr-2" />
                Tooltip anzeigen
              </Button>
            </div>

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Welcome Flow (3 Screens)</li>
                  <li>• Role Introduction mit Features</li>
                  <li>• Key Features Grid (4 Cards)</li>
                  <li>• Interactive Tour (7 Steps mit Progress)</li>
                  <li>• Tour Complete Screen mit Confetti-Gefühl</li>
                  <li>• Spotlight-Effekt (dimmed background)</li>
                  <li>• Contextual Tooltips (4 Typen)</li>
                  <li>• Help Panel (Slide-in from right)</li>
                  <li>• Video Tutorials Grid</li>
                  <li>• FAQ Accordion mit Thumbs up/down</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Keyboard Shortcuts Table</li>
                  <li>• Support Contact Form</li>
                  <li>• Support Channels (Email/Phone)</li>
                  <li>• Getting Started Guides</li>
                  <li>• Role-Specific Features</li>
                  <li>• New Feature Banner (Purple gradient)</li>
                  <li>• Changelog with Version Badges</li>
                  <li>• Floating Help Button (bottom-right)</li>
                  <li>• Search in Help Panel</li>
                  <li>• German Localization komplett</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Feature Banner */}
      {showFeatureBanner && (
        <NewFeatureBanner
          onTry={() => alert('Feature wird geöffnet...')}
          onDismiss={() => setShowFeatureBanner(false)}
        />
      )}

      {/* Contextual Tooltip Example */}
      {showTooltip && (
        <div className="relative">
          <ContextualTooltip
            type="tip"
            message="Tipp: Sie können auch per Sprache erfassen! 🎤"
            onDismiss={() => setShowTooltip(false)}
            onLearnMore={() => alert('Mehr erfahren...')}
          />
        </div>
      )}

      {/* Changelog */}
      <ChangelogCard />

      {/* Sample Dashboard Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ihr Dashboard</CardTitle>
          <CardDescription>Willkommen zurück! Hier ist Ihre Übersicht.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Kunden</p>
              <p className="text-2xl">24</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Aktivitäten</p>
              <p className="text-2xl">156</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Opportunities</p>
              <p className="text-2xl">8</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Help Button */}
      <HelpButton onClick={() => setShowHelpPanel(true)} />

      {/* Help Panel */}
      <HelpPanel isOpen={showHelpPanel} onClose={() => setShowHelpPanel(false)} />

      {/* Onboarding Flow */}
      {showOnboarding && (
        <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
          <DialogContent className="max-w-4xl p-0 bg-primary border-0 overflow-hidden">
            {onboardingStep === 'welcome' && <WelcomeScreen onNext={handleNextOnboarding} />}
            {onboardingStep === 'role' && (
              <RoleIntroScreen role={selectedRole} onNext={handleNextOnboarding} />
            )}
            {onboardingStep === 'features' && (
              <KeyFeaturesScreen onStartTour={handleStartTour} onSkip={handleSkipOnboarding} />
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Tour Overlay */}
      {onboardingStep === 'tour' && !showTourComplete && (
        <TourStepOverlay step={tourStep} onNext={handleNextTour} onEnd={handleEndTour} />
      )}

      {/* Tour Complete */}
      {showTourComplete && (
        <TourCompleteScreen
          onDashboard={() => {
            setShowTourComplete(false);
            setShowOnboarding(false);
            setOnboardingStep('welcome');
          }}
        />
      )}
    </div>
  );
}
