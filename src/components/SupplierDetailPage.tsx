import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Mail,
  Phone,
  Globe,
  MapPin,
  Star,
  TrendingUp,
  FileText,
  Briefcase,
  DollarSign,
  MessageSquare,
  Download,
  Ban,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Eye,
  ChevronDown,
  ChevronRight,
  Building2,
  Calendar,
  User,
  Target,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Types
export type SupplierStatus = 'active' | 'pending_approval' | 'inactive' | 'blacklisted';
export type ContractStatus = 'draft' | 'pending_approval' | 'sent' | 'signed' | 'in_execution' | 'completed' | 'terminated' | 'cancelled';
export type ContractType = 'framework' | 'project' | 'service_agreement' | 'purchase_order';
export type ProjectStatus = 'in_progress' | 'completed';
export type CommunicationType = 'email' | 'phone' | 'in_person' | 'sms' | 'video';
export type InvoiceStatus = 'pending' | 'approved' | 'paid' | 'disputed';
export type UserRole = 'INN' | 'PLAN' | 'BUCH' | 'GF' | 'KALK';

export interface SupplierRating {
  overall: number;
  quality: number;
  reliability: number;
  communication: number;
  priceValue: number;
  projectCount: number;
  trend: number;
}

export interface Contract {
  id: string;
  contractNumber: string;
  type: ContractType;
  projectId?: string;
  projectName?: string;
  value: number;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
}

export interface ProjectAssignment {
  id: string;
  projectId: string;
  projectName: string;
  workPackage: string;
  startDate: string;
  endDate: string;
  estimatedCost: number;
  actualCost?: number;
  status: ProjectStatus;
  progress?: number;
  rating?: number;
}

export interface Communication {
  id: string;
  type: CommunicationType;
  direction: 'inbound' | 'outbound';
  date: string;
  subject: string;
  participants: string;
  content: string;
  attachments?: string[];
  followUpRequired?: boolean;
  followUpCompleted?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  paidDate?: string;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
  validUntil?: string;
  isValid?: boolean;
}

export interface SupplierDetail {
  id: string;
  companyName: string;
  type: string;
  location: string;
  status: SupplierStatus;
  email: string;
  phone: string;
  mobile?: string;
  website?: string;
  address: string;
  serviceCategories: string[];
  serviceDescription?: string;
  workingRadius?: number;
  paymentTerms: string;
  minimumOrder?: number;
  deliveryTime?: number;
  accountManager: string;
  rating: SupplierRating;
  activeProjects: number;
  totalProjects: number;
  onTimeRate: number;
  totalVolume: number;
  outstandingInvoices: number;
  averageInvoice: number;
  createdDate: string;
  lastContract: string;
  lastContact: string;
  internalNotes?: string;
  notesUpdatedBy?: string;
  notesUpdatedDate?: string;
}

// Mock Data
export const mockSupplier: SupplierDetail = {
  id: 'sup1',
  companyName: 'Schreinerei Müller GmbH',
  type: 'Subunternehmer',
  location: 'München',
  status: 'active',
  email: 'mueller@example.de',
  phone: '+49 89 1234567',
  mobile: '+49 171 9876543',
  website: 'www.schreinerei-mueller.de',
  address: 'Industriestraße 42, 80331 München',
  serviceCategories: ['Tischlerei', 'Möbel', 'Montage', 'Holzverarbeitung'],
  serviceDescription: 'Spezialisiert auf hochwertige Ladeneinrichtungen und Möbelbau. Über 25 Jahre Erfahrung im Einzelhandel.',
  workingRadius: 50,
  paymentTerms: '30 Tage (2% Skonto bei Zahlung innerhalb 14 Tagen)',
  minimumOrder: 500,
  deliveryTime: 14,
  accountManager: 'Claudia Weber',
  rating: {
    overall: 4.8,
    quality: 4.9,
    reliability: 4.5,
    communication: 5.0,
    priceValue: 4.2,
    projectCount: 12,
    trend: 0.3,
  },
  activeProjects: 5,
  totalProjects: 12,
  onTimeRate: 92,
  totalVolume: 450000,
  outstandingInvoices: 12500,
  averageInvoice: 8400,
  createdDate: '15.03.2023',
  lastContract: 'Vor 2 Wochen (P-2025-M003)',
  lastContact: 'Vor 3 Tagen',
  internalNotes: 'Sehr zuverlässiger Partner. Hochwertige Arbeit. Termingerecht. Empfehlung für Premium-Projekte.',
  notesUpdatedBy: 'Claudia Weber',
  notesUpdatedDate: '15.10.2024',
};

export const mockContracts: Contract[] = [
  {
    id: 'c1',
    contractNumber: 'SC-2025-00123',
    type: 'project',
    projectId: 'P-2025-M003',
    projectName: 'REWE München',
    value: 45000,
    status: 'in_execution',
    startDate: '01.02.2025',
    endDate: '28.02.2025',
  },
  {
    id: 'c2',
    contractNumber: 'SC-2024-00098',
    type: 'framework',
    value: 200000,
    status: 'signed',
    startDate: '01.01.2024',
    endDate: '31.12.2025',
  },
  {
    id: 'c3',
    contractNumber: 'SC-2024-00067',
    type: 'project',
    projectId: 'P-2024-B015',
    projectName: 'Hofladen Müller',
    value: 38000,
    status: 'completed',
    startDate: '15.11.2024',
    endDate: '20.12.2024',
  },
];

export const mockProjects: ProjectAssignment[] = [
  {
    id: 'pa1',
    projectId: 'P-2025-M003',
    projectName: 'REWE München',
    workPackage: 'Ladenregale Montage',
    startDate: '01.02.2025',
    endDate: '15.02.2025',
    estimatedCost: 12000,
    actualCost: 11800,
    status: 'in_progress',
    progress: 85,
  },
  {
    id: 'pa2',
    projectId: 'P-2024-B015',
    projectName: 'Hofladen Müller',
    workPackage: 'Kühlraumtüren',
    startDate: '15.11.2024',
    endDate: '20.12.2024',
    estimatedCost: 38000,
    actualCost: 37200,
    status: 'completed',
    rating: 5.0,
  },
  {
    id: 'pa3',
    projectId: 'P-2024-M007',
    projectName: 'EDEKA Augsburg',
    workPackage: 'Ladenregale',
    startDate: '05.09.2024',
    endDate: '30.09.2024',
    estimatedCost: 22000,
    actualCost: 24500,
    status: 'completed',
    rating: 3.5,
  },
];

export const mockCommunications: Communication[] = [
  {
    id: 'com1',
    type: 'email',
    direction: 'outbound',
    date: '15.11.2024',
    subject: 'Angebot für Projekt REWE München',
    participants: 'Claudia Weber → info@mueller.de',
    content: 'RFQ für Ladenregale verschickt. Angebot bis 20.11.',
    attachments: ['RFQ-2024-089.pdf'],
  },
  {
    id: 'com2',
    type: 'phone',
    direction: 'inbound',
    date: '12.11.2024',
    subject: 'Rückfrage zu Holzarten',
    participants: 'Herr Müller → Claudia Weber (8 Min)',
    content: 'Kunde bevorzugt Eiche statt Buche. Aufpreis: +€ 2.500',
    followUpRequired: true,
    followUpCompleted: true,
  },
  {
    id: 'com3',
    type: 'in_person',
    direction: 'outbound',
    date: '08.11.2024',
    subject: 'Werkstattbesuch',
    participants: 'Claudia Weber, Herr Müller',
    content: 'Besichtigung neuer CNC-Maschine. Kapazität +30%.',
    attachments: ['IMG_001.jpg', 'IMG_002.jpg', 'IMG_003.jpg', 'IMG_004.jpg'],
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'R-SUP-24-456',
    projectId: 'P-2025-M003',
    projectName: 'REWE München',
    invoiceDate: '05.02.2025',
    dueDate: '07.03.2025',
    amount: 12000,
    status: 'approved',
  },
  {
    id: 'inv2',
    invoiceNumber: 'R-SUP-24-423',
    projectId: 'P-2024-B015',
    projectName: 'Hofladen Müller',
    invoiceDate: '22.12.2024',
    dueDate: '21.01.2025',
    amount: 38000,
    status: 'paid',
    paidDate: '15.01.2025',
  },
  {
    id: 'inv3',
    invoiceNumber: 'R-SUP-24-398',
    projectId: 'P-2024-M007',
    projectName: 'EDEKA Augsburg',
    invoiceDate: '05.10.2024',
    dueDate: '04.11.2024',
    amount: 24500,
    status: 'paid',
    paidDate: '28.10.2024',
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc1',
    name: 'Versicherungsnachweis_2024.pdf',
    category: 'Versicherungsnachweise',
    uploadDate: '15.03.2024',
    validUntil: '31.12.2024',
    isValid: true,
  },
  {
    id: 'doc2',
    name: 'Gewerbeanmeldung.pdf',
    category: 'Lizenzen & Genehmigungen',
    uploadDate: '15.03.2024',
  },
  {
    id: 'doc3',
    name: 'Meisterbrief_Tischlerei.pdf',
    category: 'Qualifikationen',
    uploadDate: '15.03.2024',
  },
  {
    id: 'doc4',
    name: 'Referenz_REWE_Hamburg.pdf',
    category: 'Referenzen',
    uploadDate: '20.04.2024',
  },
];

// Helper Functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function getContractTypeLabel(type: ContractType): string {
  const labels: Record<ContractType, string> = {
    framework: 'Rahmenvertrag',
    project: 'Projekt',
    service_agreement: 'Dienstleistungsvertrag',
    purchase_order: 'Bestellung',
  };
  return labels[type];
}

export function getContractStatusBadge(status: ContractStatus) {
  const badges: Record<ContractStatus, { label: string; variant: string }> = {
    draft: { label: 'Entwurf', variant: 'bg-gray-100 text-gray-800' },
    pending_approval: { label: 'Freigabe ausstehend', variant: 'bg-amber-100 text-amber-800' },
    sent: { label: 'Gesendet', variant: 'bg-blue-100 text-blue-800' },
    signed: { label: 'Unterzeichnet', variant: 'bg-green-100 text-green-800' },
    in_execution: { label: 'In Ausführung', variant: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Abgeschlossen', variant: 'bg-green-100 text-green-800' },
    terminated: { label: 'Gekündigt', variant: 'bg-red-100 text-red-800' },
    cancelled: { label: 'Storniert', variant: 'bg-gray-100 text-gray-800' },
  };
  return badges[status];
}

export function getInvoiceStatusBadge(status: InvoiceStatus) {
  const badges: Record<InvoiceStatus, { label: string; variant: string }> = {
    pending: { label: 'Ausstehend', variant: 'bg-amber-100 text-amber-800' },
    approved: { label: 'Genehmigt', variant: 'bg-blue-100 text-blue-800' },
    paid: { label: 'Bezahlt', variant: 'bg-green-100 text-green-800' },
    disputed: { label: 'Umstritten', variant: 'bg-red-100 text-red-800' },
  };
  return badges[status];
}

export function getCommunicationIcon(type: CommunicationType) {
  const icons = {
    email: '📧',
    phone: '📞',
    in_person: '🤝',
    sms: '💬',
    video: '📹',
  };
  return icons[type];
}

// Star Rating Component
export interface StarRatingProps {
  rating: number;
  showNumeric?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, showNumeric = true, size = 'md' }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeClass} fill-amber-400 text-amber-400`} />
      ))}
      {hasHalfStar && (
        <Star className={`${sizeClass} fill-amber-400 text-amber-400`} style={{ clipPath: 'inset(0 50% 0 0)' }} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeClass} text-gray-300`} />
      ))}
      {showNumeric && (
        <span className="ml-1 text-muted-foreground">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

// Rating Detail Modal
export interface RatingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: SupplierRating;
}

export function RatingDetailModal({ open, onOpenChange, rating }: RatingDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bewertungsdetails: Schreinerei Müller GmbH</DialogTitle>
          <DialogDescription>
            Basierend auf {rating.projectCount} abgeschlossenen Projekten
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="flex items-center justify-between">
            <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Gesamtbewertung</span>
            <StarRating rating={rating.overall} size="lg" />
          </div>

          <Separator />

          {/* Dimensions */}
          <div className="space-y-3">
            <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Dimensionen</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Qualität</span>
                <StarRating rating={rating.quality} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Zuverlässigkeit</span>
                <StarRating rating={rating.reliability} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Kommunikation</span>
                <StarRating rating={rating.communication} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Preis/Leistung</span>
                <StarRating rating={rating.priceValue} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Individual Ratings */}
          <div className="space-y-3">
            <h4 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>Einzelbewertungen</h4>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    P-2024-B015 (Hofladen Müller)
                  </span>
                  <StarRating rating={5.0} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  "Hervorragende Arbeit, pünktlich, sauber"
                </p>
                <p className="text-xs text-muted-foreground">- Thomas Fischer (PLAN), 22.12.2024</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    P-2024-M007 (REWE München)
                  </span>
                  <StarRating rating={4.2} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  "Gute Qualität, leichte Verzögerung (3 Tage)"
                </p>
                <p className="text-xs text-muted-foreground">- Claudia Weber (INN), 05.10.2024</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                    P-2024-B003 (EDEKA Augsburg)
                  </span>
                  <StarRating rating={5.0} size="sm" />
                </div>
                <p className="text-sm text-muted-foreground">
                  "Perfekt, empfehlenswert für Premium-Projekte"
                </p>
                <p className="text-xs text-muted-foreground">- Thomas Fischer (PLAN), 30.08.2024</p>
              </div>
            </div>
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600">
              Trend: +{rating.trend.toFixed(1)} vs. letztes Quartal
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Supplier Detail Page
export interface SupplierDetailPageProps {
  supplierId?: string;
  userRole?: UserRole;
}

export function SupplierDetailPage({ supplierId = 'sup1', userRole = 'INN' }: SupplierDetailPageProps) {
  const [supplier] = useState(mockSupplier);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(false);

  const canEdit = ['INN', 'GF'].includes(userRole);
  const isGF = userRole === 'GF';

  const handleEdit = () => {
    toast.info('Lieferant bearbeiten');
  };

  const handleCreateContract = () => {
    toast.success('Vertrag erstellen für ' + supplier.companyName);
  };

  const handleAssignProject = () => {
    toast.success('Projekt zuweisen zu ' + supplier.companyName);
  };

  const handleRecordInvoice = () => {
    toast.success('Rechnung erfassen für ' + supplier.companyName);
  };

  const handleLogCommunication = () => {
    toast.info('Kommunikation loggen');
  };

  const handleDownloadReport = () => {
    toast.success('Performance-Bericht wird heruntergeladen...');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Lieferanten
          </button>
          <span>{'>'}</span>
          <span>{supplier.companyName}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-12 w-12 text-blue-600" />
            <div>
              <h1 className="mb-2">{supplier.companyName}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{supplier.type}</span>
                <span>•</span>
                <span>{supplier.location}</span>
                <span>•</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aktiv
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRatingModal(true)}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <StarRating rating={supplier.rating.overall} size="lg" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {canEdit && (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Aktionen
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCreateContract}>
                <FileText className="h-4 w-4 mr-2" />
                Vertrag erstellen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAssignProject}>
                <Briefcase className="h-4 w-4 mr-2" />
                Projekt zuweisen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRecordInvoice}>
                <DollarSign className="h-4 w-4 mr-2" />
                Rechnung erfassen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogCommunication}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Kommunikation loggen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Performance-Bericht (PDF)
              </DropdownMenuItem>
              {isGF && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Ban className="h-4 w-4 mr-2" />
                    Sperren
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="contracts">Verträge</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
          <TabsTrigger value="communications">Kommunikation</TabsTrigger>
          <TabsTrigger value="invoices">Rechnungen</TabsTrigger>
          <TabsTrigger value="documents">Dokumente</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href={`mailto:${supplier.email}`} className="flex items-center gap-2 text-sm hover:text-blue-600">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {supplier.email}
                  </a>
                  <a href={`tel:${supplier.phone}`} className="flex items-center gap-2 text-sm hover:text-blue-600">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {supplier.phone}
                  </a>
                  {supplier.mobile && (
                    <a href={`tel:${supplier.mobile}`} className="flex items-center gap-2 text-sm hover:text-blue-600">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {supplier.mobile}
                    </a>
                  )}
                  {supplier.website && (
                    <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-blue-600">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {supplier.website}
                    </a>
                  )}
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(supplier.address)}`, '_blank')}
                    className="flex items-start gap-2 text-sm hover:text-blue-600 text-left w-full"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{supplier.address}</span>
                  </button>
                </CardContent>
              </Card>

              {/* Services Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Leistungen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {supplier.serviceCategories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  {supplier.serviceDescription && (
                    <p className="text-sm text-muted-foreground">{supplier.serviceDescription}</p>
                  )}
                  {supplier.workingRadius && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Arbeitsradius:</span> {supplier.workingRadius} km
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Terms Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Geschäft</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Zahlungsziel:</span>
                    <p>{supplier.paymentTerms}</p>
                  </div>
                  {supplier.minimumOrder && (
                    <div>
                      <span className="text-muted-foreground">Mindestbestellung:</span>
                      <p>{formatCurrency(supplier.minimumOrder)}</p>
                    </div>
                  )}
                  {supplier.deliveryTime && (
                    <div>
                      <span className="text-muted-foreground">Lieferzeit:</span>
                      <p>{supplier.deliveryTime} Tage</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Account Manager:</span>
                    <p className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4" />
                      {supplier.accountManager}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        Bewertung
                      </span>
                      <button onClick={() => setShowRatingModal(true)} className="hover:opacity-80">
                        <StarRating rating={supplier.rating.overall} />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Qualität:</span>
                        <StarRating rating={supplier.rating.quality} size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Zuverlässigkeit:</span>
                        <StarRating rating={supplier.rating.reliability} size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Kommunikation:</span>
                        <StarRating rating={supplier.rating.communication} size="sm" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Preis/Leistung:</span>
                        <StarRating rating={supplier.rating.priceValue} size="sm" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Basierend auf {supplier.rating.projectCount} Bewertungen
                    </p>
                  </div>

                  <Separator />

                  {/* Project Metrics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        Projekte
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Gesamt:</span>
                        <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          {supplier.totalProjects} Projekte
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Aktiv:</span>
                        <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          {supplier.activeProjects} Projekte
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Pünktlich:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={supplier.onTimeRate} className="flex-1" />
                          <span className="text-green-600" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                            {supplier.onTimeRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Financial Metrics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        Finanzübersicht
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Gesamtvolumen:</span>
                        <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          {formatCurrency(supplier.totalVolume)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Offene Rechnungen:</span>
                        <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          {formatCurrency(supplier.outstandingInvoices)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Durchschn. Rechnung:</span>
                        <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                          {formatCurrency(supplier.averageInvoice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Activity */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        Aktivität
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Erstellt:</span>
                        <p>{supplier.createdDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Letzte Beauftragung:</span>
                        <p>{supplier.lastContract}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Letzter Kontakt:</span>
                        <p>{supplier.lastContact}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Internal Notes Card */}
              {supplier.internalNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Interne Notizen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {expandedNotes || supplier.internalNotes.length <= 300
                        ? supplier.internalNotes
                        : `${supplier.internalNotes.substring(0, 300)}...`}
                    </p>
                    {supplier.internalNotes.length > 300 && (
                      <button
                        onClick={() => setExpandedNotes(!expandedNotes)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {expandedNotes ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                      </button>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      {canEdit && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Bearbeiten
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        - {supplier.notesUpdatedBy}, {supplier.notesUpdatedDate}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verträge</CardTitle>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Neuer Vertrag
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Vertragsnr.</th>
                      <th className="text-left p-3">Typ</th>
                      <th className="text-left p-3">Projekt</th>
                      <th className="text-right p-3">Wert</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Laufzeit</th>
                      <th className="text-left p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockContracts.map((contract) => {
                      const statusBadge = getContractStatusBadge(contract.status);
                      return (
                        <tr key={contract.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <button className="text-blue-600 hover:underline">
                              {contract.contractNumber}
                            </button>
                          </td>
                          <td className="p-3">{getContractTypeLabel(contract.type)}</td>
                          <td className="p-3">
                            {contract.projectId ? (
                              <button className="text-blue-600 hover:underline">
                                {contract.projectId}
                              </button>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="p-3 text-right">{formatCurrency(contract.value)}</td>
                          <td className="p-3">
                            <Badge className={statusBadge.variant}>{statusBadge.label}</Badge>
                          </td>
                          <td className="p-3 text-sm">
                            {contract.startDate} - {contract.endDate || 'Laufend'}
                          </td>
                          <td className="p-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Details anzeigen
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  PDF herunterladen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projekte</CardTitle>
                <Button>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Projekt zuweisen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Projekt</th>
                      <th className="text-left p-3">Arbeitspaket</th>
                      <th className="text-left p-3">Zeitraum</th>
                      <th className="text-right p-3">Kosten (Plan/Ist)</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Bewertung</th>
                      <th className="text-left p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProjects.map((project) => {
                      const variance = project.actualCost
                        ? project.actualCost - project.estimatedCost
                        : 0;
                      return (
                        <tr key={project.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <button className="text-blue-600 hover:underline">
                              {project.projectId}
                            </button>
                            <p className="text-xs text-muted-foreground">{project.projectName}</p>
                          </td>
                          <td className="p-3 text-sm">{project.workPackage}</td>
                          <td className="p-3 text-sm">
                            {project.startDate} - {project.endDate}
                          </td>
                          <td className="p-3 text-right">
                            <div className="text-sm">
                              {formatCurrency(project.estimatedCost)} /
                              <span
                                className={
                                  project.actualCost
                                    ? variance < 0
                                      ? 'text-green-600'
                                      : variance > 0
                                      ? 'text-red-600'
                                      : ''
                                    : 'text-muted-foreground'
                                }
                              >
                                {' '}
                                {project.actualCost ? formatCurrency(project.actualCost) : '—'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            {project.status === 'in_progress' ? (
                              <div className="flex items-center gap-2">
                                <Progress value={project.progress} className="w-16" />
                                <span className="text-xs">{project.progress}%</span>
                              </div>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">Abgeschlossen</Badge>
                            )}
                          </td>
                          <td className="p-3">
                            {project.rating ? (
                              <StarRating rating={project.rating} size="sm" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kommunikation</CardTitle>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Neue Kommunikation loggen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommunications.map((comm) => (
                  <div key={comm.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getCommunicationIcon(comm.type)}</span>
                        <div>
                          <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                            {comm.type === 'email' && 'E-Mail'}
                            {comm.type === 'phone' && 'Telefonat'}
                            {comm.type === 'in_person' && 'Vor-Ort'}
                            {' • '}
                            {comm.direction === 'inbound' ? 'Eingehend' : 'Ausgehend'}
                          </p>
                          <p className="text-xs text-muted-foreground">{comm.participants}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{comm.date}</span>
                    </div>
                    <p style={{ fontWeight: 'var(--font-weight-medium)' }}>{comm.subject}</p>
                    <p className="text-sm text-muted-foreground">{comm.content}</p>
                    {comm.attachments && comm.attachments.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>
                          Anhang: {comm.attachments.join(', ')}
                        </span>
                      </div>
                    )}
                    {comm.followUpRequired && (
                      <Badge
                        className={
                          comm.followUpCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {comm.followUpCompleted ? '✓ Erledigt' : 'Folgeaktion erforderlich'}
                      </Badge>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Details anzeigen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rechnungen</CardTitle>
                <Button>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Rechnung erfassen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Offene Rechnungen</p>
                    <p className="text-amber-600" style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)' }}>
                      {formatCurrency(12500)}
                    </p>
                    <p className="text-xs text-muted-foreground">2 Rechnungen</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Überfällige Rechnungen</p>
                    <p className="text-green-600" style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)' }}>
                      {formatCurrency(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">0 Rechnungen</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Dieses Jahr bezahlt</p>
                    <p className="text-blue-600" style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-bold)' }}>
                      {formatCurrency(248000)}
                    </p>
                    <p className="text-xs text-muted-foreground">18 Rechnungen</p>
                  </CardContent>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Rechnungsnr.</th>
                      <th className="text-left p-3">Projekt</th>
                      <th className="text-left p-3">Rechnungsdatum</th>
                      <th className="text-left p-3">Fälligkeit</th>
                      <th className="text-right p-3">Betrag</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Bezahlt</th>
                      <th className="text-left p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockInvoices.map((invoice) => {
                      const statusBadge = getInvoiceStatusBadge(invoice.status);
                      return (
                        <tr key={invoice.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{invoice.invoiceNumber}</td>
                          <td className="p-3">
                            <button className="text-blue-600 hover:underline">
                              {invoice.projectId}
                            </button>
                          </td>
                          <td className="p-3 text-sm">{invoice.invoiceDate}</td>
                          <td className="p-3 text-sm">{invoice.dueDate}</td>
                          <td className="p-3 text-right">{formatCurrency(invoice.amount)}</td>
                          <td className="p-3">
                            <Badge className={statusBadge.variant}>{statusBadge.label}</Badge>
                          </td>
                          <td className="p-3 text-sm">
                            {invoice.paidDate || <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dokumente</CardTitle>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Dokument hochladen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.category} • Hochgeladen: {doc.uploadDate}
                          {doc.validUntil && ` • Gültig bis: ${doc.validUntil}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.isValid && (
                        <Badge className="bg-green-100 text-green-800">✓ Gültig</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Anzeigen
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Herunterladen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rating Detail Modal */}
      <RatingDetailModal
        open={showRatingModal}
        onOpenChange={setShowRatingModal}
        rating={supplier.rating}
      />
    </div>
  );
}

// Demo Component
export function SupplierDetailPageDemo() {
  const [userRole, setUserRole] = useState<UserRole>('INN');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Lieferanten-Detailseite</h2>
        <p className="text-sm text-muted-foreground">
          Vollständiges Lieferantenprofil mit Performance-Metriken, Verträgen, Projekten, Kommunikation und Dokumenten
        </p>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Demo-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="role">Benutzerrolle:</Label>
            <select
              id="role"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="border rounded px-3 py-2"
            >
              <option value="INN">INN (Außendienst)</option>
              <option value="PLAN">PLAN (Planung)</option>
              <option value="BUCH">BUCH (Buchhaltung)</option>
              <option value="GF">GF (Geschäftsführung)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Detail Page */}
      <SupplierDetailPage userRole={userRole} />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Funktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>6 Tabs:</strong> Übersicht, Verträge, Projekte, Kommunikation, Rechnungen, Dokumente
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Performance-Tracking:</strong> 5-Sterne-Bewertungssystem mit 4 Dimensionen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Kontaktinformationen:</strong> Anklickbare E-Mail, Telefon, Website, Adresse (Google Maps)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Vertragsverwaltung:</strong> Liste mit Status-Badges, Typ, Laufzeit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Projektzuweisungen:</strong> Arbeitspaket, Kostenvergleich (Plan/Ist), Fortschritt
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Kommunikations-Timeline:</strong> E-Mail, Telefon, Vor-Ort mit Icons und Richtung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Rechnungsübersicht:</strong> 3 KPI-Karten + Tabelle mit Status-Tracking
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Dokumenten-Bibliothek:</strong> Mit Gültigkeitsprüfung und Download
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Rollenbasierte Aktionen:</strong> INN/GF können bearbeiten, verschiedene Schnellaktionen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Bewertungs-Modal:</strong> Detaillierte Einzelbewertungen mit Kommentaren und Trend
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Data Info */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="text-sm">Mock-Daten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Lieferant: Schreinerei Müller GmbH (Subunternehmer)</p>
          <p>• Bewertung: 4.8/5.0 (12 Bewertungen, Trend +0.3)</p>
          <p>• Projekte: 12 gesamt, 5 aktiv, 92% pünktlich</p>
          <p>• Finanzen: € 450k Gesamtvolumen, € 12,5k offen</p>
          <p>• Verträge: 3 (1 Rahmenvertrag, 2 Projektverträge)</p>
          <p>• Kommunikation: 3 Einträge (E-Mail, Telefon, Vor-Ort)</p>
          <p>• Rechnungen: 3 (1 genehmigt, 2 bezahlt)</p>
          <p>• Dokumente: 4 (Versicherung, Gewerbeanmeldung, Meisterbrief, Referenz)</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Missing Label import
function Label({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}
