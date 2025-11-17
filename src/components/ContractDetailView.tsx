import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  FileText,
  Download,
  Lock,
  Shield,
  Calendar,
  Euro,
  Building,
  FolderOpen,
  ChevronLeft,
  ExternalLink,
  Percent,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';

// Contract status type
type ContractStatus = 'draft' | 'signed' | 'in_progress' | 'completed';

// Activity type
interface Activity {
  id: string;
  type: 'created' | 'signed' | 'started' | 'milestone' | 'budget_update' | 'completed';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

// Contract data
interface ContractData {
  contractNumber: string;
  customerName: string;
  customerId: string;
  projectNumber: string;
  projectId: string;
  offerNumber: string;
  offerId: string;
  contractDate: string;
  orderValue: number;
  budget: number;
  actualCosts: number;
  remainingBudget: number;
  margin: number;
  status: ContractStatus;
  notes: string;
  isGoBDLocked: boolean;
  hasPdf: boolean;
  pdfFileName: string;
  createdBy: string;
  createdAt: string;
  signedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

// Mock data
const mockContract: ContractData = {
  contractNumber: 'VER-2024-0089',
  customerName: 'REWE München Süd',
  customerId: 'CUST-001',
  projectNumber: 'P-2024-B023',
  projectId: 'PROJ-001',
  offerNumber: 'ANG-2024-0123',
  offerId: 'OFF-001',
  contractDate: '2024-11-01',
  orderValue: 125000,
  budget: 105000,
  actualCosts: 68250,
  remainingBudget: 36750,
  margin: 16.0,
  status: 'in_progress',
  notes: 'Auftragsbestätigung für komplette Ladeneinrichtung inklusive Kühlsysteme.',
  isGoBDLocked: true,
  hasPdf: true,
  pdfFileName: 'VER-2024-0089_REWE_Muenchen.pdf',
  createdBy: 'Maria Schmidt (ADM)',
  createdAt: '2024-11-01T09:00:00Z',
  signedAt: '2024-11-01T16:30:00Z',
  startedAt: '2024-11-05T08:00:00Z',
  completedAt: null,
};

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'created',
    title: 'Vertrag erstellt',
    description: 'Vertrag wurde erstellt',
    timestamp: '2024-11-01T09:00:00Z',
    user: 'Maria Schmidt (ADM)',
  },
  {
    id: '2',
    type: 'signed',
    title: 'Vertrag unterzeichnet',
    description: 'GoBD-Schutz aktiviert',
    timestamp: '2024-11-01T16:30:00Z',
    user: 'System',
  },
  {
    id: '3',
    type: 'started',
    title: 'Projekt gestartet',
    description: 'Projekt P-2024-B023 wurde gestartet',
    timestamp: '2024-11-05T08:00:00Z',
    user: 'Thomas Fischer (PLAN)',
  },
  {
    id: '4',
    type: 'milestone',
    title: 'Meilenstein erreicht',
    description: 'Montage Hauptbereich abgeschlossen',
    timestamp: '2024-11-10T14:00:00Z',
    user: 'Michael Schmidt',
  },
  {
    id: '5',
    type: 'budget_update',
    title: 'Budgetaktualisierung',
    description: 'Ist-Kosten aktualisiert: € 68.250',
    timestamp: '2024-11-12T10:30:00Z',
    user: 'Stefan Bauer (KALK)',
  },
];

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format datetime
function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Get status badge
function getStatusBadge(status: ContractStatus, isGoBDLocked: boolean) {
  switch (status) {
    case 'draft':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400">
          Entwurf
        </Badge>
      );
    case 'signed':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          {isGoBDLocked && <Lock className="mr-1 h-3 w-3" />}
          Unterzeichnet
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          {isGoBDLocked && <Lock className="mr-1 h-3 w-3" />}
          In Bearbeitung
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-400">
          {isGoBDLocked && <Lock className="mr-1 h-3 w-3" />}
          Abgeschlossen
        </Badge>
      );
  }
}

// Get margin color
function getMarginColor(margin: number): string {
  if (margin >= 15) return 'text-green-600';
  if (margin >= 10) return 'text-amber-600';
  return 'text-red-600';
}

export function ContractDetailView() {
  const [contract] = useState<ContractData>(mockContract);

  const budgetUtilization = (contract.actualCosts / contract.budget) * 100;

  const handleBack = () => {
    toast.info('Zurück zur Liste');
  };

  const handleDownloadPdf = () => {
    toast.success('PDF herunterladen', {
      description: contract.pdfFileName,
    });
  };

  const handleViewCustomer = () => {
    toast.info('Kunde öffnen', {
      description: contract.customerName,
    });
  };

  const handleViewProject = () => {
    toast.info('Projekt öffnen', {
      description: contract.projectNumber,
    });
  };

  const handleViewOffer = () => {
    toast.info('Angebot öffnen', {
      description: contract.offerNumber,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2>{contract.contractNumber}</h2>
              {getStatusBadge(contract.status, contract.isGoBDLocked)}
            </div>
            <p className="text-muted-foreground">{contract.customerName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {contract.hasPdf && (
            <Button variant="outline" onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          )}
        </div>
      </div>

      {/* GoBD Lock Notice */}
      {contract.isGoBDLocked && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/10">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span>
              Dieser Vertrag ist GoBD-konform finalisiert und kann nicht mehr bearbeitet werden.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Warning */}
      {budgetUtilization > 90 && contract.status === 'in_progress' && (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/10">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            Achtung: Budget zu {budgetUtilization.toFixed(0)}% ausgelastet. Restbudget:{' '}
            {formatCurrency(contract.remainingBudget)}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* PDF Viewer */}
          {contract.hasPdf && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Vertrags-PDF
                  {contract.isGoBDLocked && (
                    <Lock className="h-4 w-4 text-green-600" title="GoBD-geschützt" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] border border-border rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-2">{contract.pdfFileName}</p>
                    <p className="text-muted-foreground mb-4">
                      PDF-Vorschau würde hier angezeigt
                    </p>
                    <Button variant="outline" onClick={handleDownloadPdf}>
                      <Download className="mr-2 h-4 w-4" />
                      PDF herunterladen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle>Vertragsdetails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Vertragsnummer</p>
                  <p className="font-mono font-semibold">{contract.contractNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(contract.status, contract.isGoBDLocked)}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground mb-1">Vertragsdatum</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(contract.contractDate)}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Auftragswert</p>
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(contract.orderValue)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Marge</p>
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    <span className={`text-2xl font-bold ${getMarginColor(contract.margin)}`}>
                      {contract.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {contract.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-2">Notizen</p>
                    <p className="text-foreground">{contract.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Budget Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Budget-Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Budget</p>
                  <p className="font-bold">{formatCurrency(contract.budget)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Ist-Kosten</p>
                  <p className="font-bold">{formatCurrency(contract.actualCosts)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Restbudget</p>
                  <p
                    className={`font-bold ${
                      contract.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {formatCurrency(contract.remainingBudget)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Auslastung</span>
                  <span className="font-semibold">{budgetUtilization.toFixed(0)}%</span>
                </div>
                <Progress
                  value={Math.min(budgetUtilization, 100)}
                  className="h-3"
                  indicatorClassName={
                    budgetUtilization > 100
                      ? 'bg-red-600'
                      : budgetUtilization >= 90
                      ? 'bg-amber-600'
                      : 'bg-green-600'
                  }
                />
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                {budgetUtilization > 100 ? (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Budget überschritten</span>
                  </>
                ) : budgetUtilization >= 90 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-amber-600">Budget-Warnung</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Im Budgetrahmen</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitätsverlauf</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.type === 'created'
                            ? 'bg-accent/60'
                            : activity.type === 'signed'
                            ? 'bg-green-100 dark:bg-green-950/20'
                            : activity.type === 'started'
                            ? 'bg-primary/10'
                            : activity.type === 'milestone'
                            ? 'bg-purple-100 dark:bg-purple-950/20'
                            : activity.type === 'budget_update'
                            ? 'bg-amber-100 dark:bg-amber-950/20'
                            : 'bg-gray-100 dark:bg-gray-950/20'
                        }`}
                      >
                        {activity.type === 'signed' && (
                          <Lock className="h-4 w-4 text-green-600" />
                        )}
                        {activity.type === 'created' && (
                          <FileText className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      {index < mockActivities.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className={index < mockActivities.length - 1 ? 'pb-8' : ''}>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-muted-foreground">{activity.description}</p>
                      <p className="text-muted-foreground">
                        {formatDateTime(activity.timestamp)}
                      </p>
                      <p className="text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Kunde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-3">{contract.customerName}</p>
              <Button variant="outline" className="w-full" onClick={handleViewCustomer}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Kunde öffnen
              </Button>
            </CardContent>
          </Card>

          {/* Project */}
          {contract.projectNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Projekt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono font-medium mb-3">{contract.projectNumber}</p>
                <Button variant="outline" className="w-full" onClick={handleViewProject}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Projekt öffnen
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Offer */}
          {contract.offerNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Angebot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono font-medium mb-3">{contract.offerNumber}</p>
                <Button variant="outline" className="w-full" onClick={handleViewOffer}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Angebot öffnen
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contract.hasPdf && (
                <Button variant="outline" className="w-full" onClick={handleDownloadPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF herunterladen
                </Button>
              )}
              {contract.projectNumber && (
                <Button variant="outline" className="w-full" onClick={handleViewProject}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Projekt öffnen
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Demo wrapper
export function ContractDetailViewDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vertragsdetailansicht</CardTitle>
          <CardDescription>
            Detailansicht eines Vertrags mit GoBD-Schutz, Budget-Tracking und Aktivitätsverlauf
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <ContractDetailView />
    </div>
  );
}