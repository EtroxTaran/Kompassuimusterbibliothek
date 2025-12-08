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
  Edit,
  Download,
  FileCheck,
  TrendingUp,
  Euro,
  Calendar,
} from 'lucide-react';

import { OfferForm } from './OfferForm';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

// Offer status type
type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

// Offer interface
interface Offer {
  id: string;
  offerNumber: string;
  customerName: string;
  opportunityName: string;
  offerDate: string;
  validUntil: string;
  totalAmount: number;
  status: OfferStatus;
  hasPdf: boolean;
}

// Mock data
const mockOffers: Offer[] = [
  {
    id: '1',
    offerNumber: 'ANG-2024-0123',
    customerName: 'REWE München Süd',
    opportunityName: 'Ladeneinrichtung',
    offerDate: '2024-11-01',
    validUntil: '2024-11-30',
    totalAmount: 125000,
    status: 'accepted',
    hasPdf: true,
  },
  {
    id: '2',
    offerNumber: 'ANG-2024-0122',
    customerName: 'Hofladen Müller GmbH',
    opportunityName: 'Kühlsysteme',
    offerDate: '2024-10-28',
    validUntil: '2024-11-28',
    totalAmount: 45000,
    status: 'sent',
    hasPdf: true,
  },
  {
    id: '3',
    offerNumber: 'ANG-2024-0121',
    customerName: 'Bäckerei Schmidt',
    opportunityName: 'Komplettausstattung',
    offerDate: '2024-10-25',
    validUntil: '2024-11-15',
    totalAmount: 85000,
    status: 'sent',
    hasPdf: true,
  },
  {
    id: '4',
    offerNumber: 'ANG-2024-0120',
    customerName: 'Café Müller',
    opportunityName: 'Renovierung',
    offerDate: '2024-10-20',
    validUntil: '2024-11-10',
    totalAmount: 32000,
    status: 'rejected',
    hasPdf: true,
  },
  {
    id: '5',
    offerNumber: 'ANG-2024-0119',
    customerName: 'Restaurant Da Vinci',
    opportunityName: 'Einrichtung',
    offerDate: '2024-10-15',
    validUntil: '2024-12-01',
    totalAmount: 68000,
    status: 'draft',
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
function getStatusBadge(status: OfferStatus) {
  switch (status) {
    case 'draft':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400">
          Entwurf
        </Badge>
      );
    case 'sent':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400">
          Versendet
        </Badge>
      );
    case 'accepted':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
          Angenommen
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400">
          Abgelehnt
        </Badge>
      );
  }
}

export function OfferList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewOfferOpen, setIsNewOfferOpen] = useState(false);

  // Calculate KPIs
  const totalOffers = mockOffers.length;
  const pipelineValue = mockOffers
    .filter((o) => o.status === 'sent' || o.status === 'draft')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const acceptedValue = mockOffers
    .filter((o) => o.status === 'accepted')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const conversionRate = Math.round(
    (mockOffers.filter((o) => o.status === 'accepted').length / totalOffers) * 100
  );

  const handleViewOffer = (offer: Offer) => {
    toast.info('Angebot öffnen', {
      description: offer.offerNumber,
    });
  };

  const handleEditOffer = (offer: Offer) => {
    if (offer.status === 'accepted' || offer.status === 'rejected') {
      toast.error('Fehler', {
        description: 'Angenommene oder abgelehnte Angebote können nicht bearbeitet werden',
      });
      return;
    }
    toast.success('Angebot bearbeiten', {
      description: offer.offerNumber,
    });
  };

  const handleDownloadPdf = (offer: Offer) => {
    if (!offer.hasPdf) {
      toast.error('Fehler', {
        description: 'Kein PDF verfügbar',
      });
      return;
    }
    toast.success('PDF herunterladen', {
      description: offer.offerNumber,
    });
  };

  const handleConvertToContract = (offer: Offer) => {
    if (offer.status !== 'accepted') {
      toast.error('Fehler', {
        description: 'Nur angenommene Angebote können in Verträge umgewandelt werden',
      });
      return;
    }
    toast.success('Vertrag erstellt', {
      description: `${offer.offerNumber} wurde in Vertrag umgewandelt`,
    });
  };

  const handleNewOffer = () => {
    toast.success('Neues Angebot', {
      description: 'Angebotsformular wird geöffnet...',
    });
  };

  const filteredOffers = mockOffers.filter((offer) => {
    const matchesSearch =
      offer.offerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.opportunityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
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
            <p className="text-muted-foreground mb-1">Gesamt Angebote</p>
            <p className="text-3xl font-bold">{totalOffers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-accent/60 flex items-center justify-center">
                <Euro className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground mb-1">Pipeline-Wert</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(pipelineValue)}</p>
            <p className="text-muted-foreground">Entwurf + Versendet</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-muted-foreground mb-1">Angenommener Wert</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(acceptedValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-muted-foreground mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
            <p className="text-muted-foreground">Angenommen / Gesamt</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Angebote</CardTitle>
              <CardDescription>{filteredOffers.length} Angebote gefunden</CardDescription>
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
                  <SelectItem value="sent">Versendet</SelectItem>
                  <SelectItem value="accepted">Angenommen</SelectItem>
                  <SelectItem value="rejected">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isNewOfferOpen} onOpenChange={setIsNewOfferOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Neues Angebot
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <OfferForm onCancel={() => setIsNewOfferOpen(false)} onSuccess={() => setIsNewOfferOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">Angebotsnummer</th>
                  <th className="px-4 py-3 text-left">Kunde</th>
                  <th className="px-4 py-3 text-left">Opportunity</th>
                  <th className="px-4 py-3 text-left">Angebotsdatum</th>
                  <th className="px-4 py-3 text-left">Gültig bis</th>
                  <th className="px-4 py-3 text-right">Angebotssumme</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="border-b border-border hover:bg-accent cursor-pointer"
                    onClick={() => handleViewOffer(offer)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono font-semibold">{offer.offerNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{offer.customerName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{offer.opportunityName}</td>
                    <td className="px-4 py-3">{formatDate(offer.offerDate)}</td>
                    <td className="px-4 py-3">{formatDate(offer.validUntil)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(offer.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(offer.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOffer(offer);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(offer.status === 'draft' || offer.status === 'sent') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOffer(offer);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {offer.hasPdf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPdf(offer);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {offer.status === 'accepted' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConvertToContract(offer);
                            }}
                          >
                            <FileCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Demo wrapper
export function OfferListDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Angebotsliste</CardTitle>
          <CardDescription>
            Übersicht aller Angebote mit Filterung, KPIs und Status-Tracking
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <OfferList />
    </div>
  );
}