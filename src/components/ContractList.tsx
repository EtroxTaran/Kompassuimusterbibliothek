import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner@2.0.3';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Lock,
  ExternalLink,
  Euro,
  TrendingUp,
  Shield,
  Percent,
} from 'lucide-react';

// Contract status type
type ContractStatus = 'draft' | 'signed' | 'in_progress' | 'completed';

// Contract interface
interface Contract {
  id: string;
  contractNumber: string;
  customerName: string;
  projectNumber: string;
  contractDate: string;
  orderValue: number;
  budget: number;
  actualCosts: number;
  margin: number;
  status: ContractStatus;
  isGoBDLocked: boolean;
  hasPdf: boolean;
}

// Mock data
const mockContracts: Contract[] = [
  {
    id: '1',
    contractNumber: 'VER-2024-0089',
    customerName: 'REWE München Süd',
    projectNumber: 'P-2024-B023',
    contractDate: '2024-11-01',
    orderValue: 125000,
    budget: 105000,
    actualCosts: 68250,
    margin: 16,
    status: 'in_progress',
    isGoBDLocked: true,
    hasPdf: true,
  },
  {
    id: '2',
    contractNumber: 'VER-2024-0088',
    customerName: 'Hofladen Müller GmbH',
    projectNumber: 'P-2024-M012',
    contractDate: '2024-10-28',
    orderValue: 45000,
    budget: 38000,
    actualCosts: 32300,
    margin: 15,
    status: 'in_progress',
    isGoBDLocked: true,
    hasPdf: true,
  },
  {
    id: '3',
    contractNumber: 'VER-2024-0087',
    customerName: 'Bäckerei Schmidt',
    projectNumber: 'P-2024-K008',
    contractDate: '2024-10-15',
    orderValue: 85000,
    budget: 72000,
    actualCosts: 72000,
    margin: 15.3,
    status: 'completed',
    isGoBDLocked: true,
    hasPdf: true,
  },
  {
    id: '4',
    contractNumber: 'VER-2024-0086',
    customerName: 'Café Müller',
    projectNumber: 'P-2024-H045',
    contractDate: '2024-10-10',
    orderValue: 32000,
    budget: 27000,
    actualCosts: 26500,
    margin: 17.2,
    status: 'completed',
    isGoBDLocked: true,
    hasPdf: true,
  },
  {
    id: '5',
    contractNumber: 'VER-2024-0085',
    customerName: 'Restaurant Da Vinci',
    projectNumber: '',
    contractDate: '2024-11-10',
    orderValue: 68000,
    budget: 57000,
    actualCosts: 0,
    margin: 16.2,
    status: 'signed',
    isGoBDLocked: true,
    hasPdf: true,
  },
  {
    id: '6',
    contractNumber: 'VER-2024-0084',
    customerName: 'Supermarkt Edeka',
    projectNumber: '',
    contractDate: '2024-11-12',
    orderValue: 95000,
    budget: 80000,
    actualCosts: 0,
    margin: 15.8,
    status: 'draft',
    isGoBDLocked: false,
    hasPdf: false,
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

export function ContractList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Calculate KPIs
  const totalContracts = mockContracts.length;
  const totalContractValue = mockContracts.reduce((sum, c) => sum + c.orderValue, 0);
  const activeContracts = mockContracts.filter(
    (c) => c.status === 'signed' || c.status === 'in_progress'
  ).length;
  const avgMargin =
    mockContracts.reduce((sum, c) => sum + c.margin, 0) / mockContracts.length;
  const goBDProtected = mockContracts.filter((c) => c.isGoBDLocked).length;

  const handleViewContract = (contract: Contract) => {
    toast.info('Vertrag öffnen', {
      description: contract.contractNumber,
    });
  };

  const handleDownloadPdf = (contract: Contract) => {
    if (!contract.hasPdf) {
      toast.error('Fehler', {
        description: 'Kein PDF verfügbar',
      });
      return;
    }
    toast.success('PDF herunterladen', {
      description: contract.contractNumber,
    });
  };

  const handleViewProject = (contract: Contract) => {
    if (!contract.projectNumber) {
      toast.error('Fehler', {
        description: 'Kein Projekt verknüpft',
      });
      return;
    }
    toast.info('Projekt öffnen', {
      description: contract.projectNumber,
    });
  };

  const handleNewContract = () => {
    toast.success('Neuer Vertrag', {
      description: 'Vertragsformular wird geöffnet...',
    });
  };

  const filteredContracts = mockContracts.filter((contract) => {
    const matchesSearch =
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.projectNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-1">Gesamt Verträge</p>
            <p className="text-3xl font-bold">{totalContracts}</p>
            <p className="text-muted-foreground">{activeContracts} aktiv</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center">
                <Euro className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-1">Gesamtwert</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(totalContractValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                <Percent className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-muted-foreground mb-1">Durchschn. Marge</p>
            <p className="text-3xl font-bold text-green-600">{avgMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-muted-foreground mb-1">GoBD-geschützt</p>
            <p className="text-3xl font-bold text-green-600">{goBDProtected}</p>
            <p className="text-muted-foreground">von {totalContracts}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Verträge</CardTitle>
              <CardDescription>{filteredContracts.length} Verträge gefunden</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Nummer, Kunde..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="draft">Entwurf</SelectItem>
                  <SelectItem value="signed">Unterzeichnet</SelectItem>
                  <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                  <SelectItem value="completed">Abgeschlossen</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleNewContract}>
                <Plus className="mr-2 h-4 w-4" />
                Neuer Vertrag
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-center">
                    <Lock className="h-4 w-4 mx-auto" title="GoBD-Schutz" />
                  </th>
                  <th className="px-4 py-3 text-left">Vertragsnummer</th>
                  <th className="px-4 py-3 text-left">Kunde</th>
                  <th className="px-4 py-3 text-left">Projekt</th>
                  <th className="px-4 py-3 text-left">Vertragsdatum</th>
                  <th className="px-4 py-3 text-right">Auftragswert</th>
                  <th className="px-4 py-3 text-center">Marge %</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="border-b border-border hover:bg-accent cursor-pointer"
                    onClick={() => handleViewContract(contract)}
                  >
                    <td className="px-4 py-3 text-center">
                      {contract.isGoBDLocked && (
                        <Lock className="h-4 w-4 mx-auto text-green-600" title="GoBD-geschützt" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono font-semibold">{contract.contractNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{contract.customerName}</td>
                    <td className="px-4 py-3">
                      {contract.projectNumber ? (
                        <button
                          className="font-mono text-primary hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProject(contract);
                          }}
                        >
                          {contract.projectNumber}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{formatDate(contract.contractDate)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(contract.orderValue)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${getMarginColor(contract.margin)}`}>
                        {contract.margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(contract.status, contract.isGoBDLocked)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewContract(contract);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {contract.hasPdf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPdf(contract);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {contract.projectNumber && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProject(contract);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-muted-foreground">Gesamtwert:</span>
                <span className="font-bold text-primary">
                  {formatCurrency(totalContractValue)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-muted-foreground">Durchschn. Marge:</span>
                <span className={`font-bold ${getMarginColor(avgMargin)}`}>
                  {avgMargin.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-muted-foreground">GoBD-geschützt:</span>
                <span className="font-bold text-green-600">
                  {goBDProtected} von {totalContracts}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Demo wrapper
export function ContractListDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vertragsliste</CardTitle>
          <CardDescription>
            Übersicht aller Verträge mit GoBD-Schutz, Margen-Tracking und Projekt-Verlinkung
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <ContractList />
    </div>
  );
}