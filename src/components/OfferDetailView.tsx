import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  FileText,
  Download,
  Send,
  Check,
  XCircle,
  FileCheck,
  Edit,
  Calendar,
  Euro,
  Building,
  Target,
  ChevronLeft,
  ExternalLink,
} from 'lucide-react';

// Offer status type
type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

// Offer data
interface OfferData {
  offerNumber: string;
  customerName: string;
  customerId: string;
  opportunityName: string;
  opportunityId: string;
  offerDate: string;
  validUntil: string;
  totalAmount: number;
  status: OfferStatus;
  notes: string;
  hasPdf: boolean;
  pdfFileName: string;
  createdBy: string;
  createdAt: string;
  sentAt: string | null;
  respondedAt: string | null;
}

// Mock data
const mockOffer: OfferData = {
  offerNumber: 'ANG-2024-0123',
  customerName: 'REWE München Süd',
  customerId: 'CUST-001',
  opportunityName: 'Ladeneinrichtung',
  opportunityId: 'OPP-2024-001',
  offerDate: '2024-11-01',
  validUntil: '2024-11-30',
  totalAmount: 125000,
  status: 'sent',
  notes: 'Angebot für komplette Ladeneinrichtung inklusive Kühlsysteme und Regalsysteme.',
  hasPdf: true,
  pdfFileName: 'ANG-2024-0123_REWE_Muenchen.pdf',
  createdBy: 'Maria Schmidt (ADM)',
  createdAt: '2024-11-01T09:00:00Z',
  sentAt: '2024-11-01T14:30:00Z',
  respondedAt: null,
};

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

export function OfferDetailView() {
  const [offer, setOffer] = useState<OfferData>(mockOffer);

  const handleBack = () => {
    toast.info('Zurück zur Liste');
  };

  const handleEdit = () => {
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

  const handleDownloadPdf = () => {
    toast.success('PDF herunterladen', {
      description: offer.pdfFileName,
    });
  };

  const handleSend = () => {
    setOffer((prev) => ({ ...prev, status: 'sent', sentAt: new Date().toISOString() }));
    toast.success('Angebot versendet', {
      description: `${offer.offerNumber} an ${offer.customerName}`,
    });
  };

  const handleAccept = () => {
    setOffer((prev) => ({
      ...prev,
      status: 'accepted',
      respondedAt: new Date().toISOString(),
    }));
    toast.success('Angebot angenommen', {
      description: 'Bereit zur Vertragsumwandlung',
    });
  };

  const handleReject = () => {
    setOffer((prev) => ({
      ...prev,
      status: 'rejected',
      respondedAt: new Date().toISOString(),
    }));
    toast.error('Angebot abgelehnt', {
      description: offer.offerNumber,
    });
  };

  const handleConvertToContract = () => {
    if (offer.status !== 'accepted') {
      toast.error('Fehler', {
        description: 'Nur angenommene Angebote können in Verträge umgewandelt werden',
      });
      return;
    }
    toast.success('Vertrag erstellt', {
      description: 'Angebot wurde in Vertrag umgewandelt',
    });
  };

  const handleViewCustomer = () => {
    toast.info('Kunde öffnen', {
      description: offer.customerName,
    });
  };

  const handleViewOpportunity = () => {
    toast.info('Opportunity öffnen', {
      description: offer.opportunityName,
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
              <h2>{offer.offerNumber}</h2>
              {getStatusBadge(offer.status)}
            </div>
            <p className="text-muted-foreground">{offer.customerName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {(offer.status === 'draft' || offer.status === 'sent') && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Bearbeiten
            </Button>
          )}
          {offer.hasPdf && (
            <Button variant="outline" onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          )}
        </div>
      </div>

      {/* Status Actions */}
      {offer.status === 'draft' && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/10">
          <AlertDescription className="flex items-center justify-between">
            <span>Dieses Angebot ist noch ein Entwurf und wurde noch nicht versendet.</span>
            <Button size="sm" onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" />
              Jetzt versenden
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {offer.status === 'sent' && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/10">
          <AlertDescription>
            <div className="flex items-center justify-between mb-3">
              <span>Dieses Angebot wurde versendet und wartet auf Rückmeldung.</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-green-600 text-green-600" onClick={handleAccept}>
                <Check className="mr-2 h-4 w-4" />
                Als angenommen markieren
              </Button>
              <Button size="sm" variant="outline" className="border-red-600 text-red-600" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Als abgelehnt markieren
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {offer.status === 'accepted' && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/10">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Dieses Angebot wurde angenommen und kann jetzt in einen Vertrag umgewandelt werden.
            </span>
            <Button size="sm" onClick={handleConvertToContract}>
              <FileCheck className="mr-2 h-4 w-4" />
              In Vertrag umwandeln
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {offer.status === 'rejected' && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/10">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            Dieses Angebot wurde abgelehnt und kann nicht mehr bearbeitet werden.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* PDF Viewer */}
          {offer.hasPdf && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Angebots-PDF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] border border-border rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-2">{offer.pdfFileName}</p>
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

          {/* Offer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Angebotsdetails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Angebotsnummer</p>
                  <p className="font-mono font-semibold">{offer.offerNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(offer.status)}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1">Angebotsdatum</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(offer.offerDate)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Gültig bis</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(offer.validUntil)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground mb-1">Angebotssumme</p>
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(offer.totalAmount)}
                  </span>
                </div>
              </div>

              {offer.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-2">Notizen</p>
                    <p className="text-foreground">{offer.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Verlauf</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="pb-8">
                    <p className="font-medium">Angebot erstellt</p>
                    <p className="text-muted-foreground">
                      {formatDateTime(offer.createdAt)}
                    </p>
                    <p className="text-muted-foreground">von {offer.createdBy}</p>
                  </div>
                </div>

                {offer.sentAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-accent/60 flex items-center justify-center">
                        <Send className="h-4 w-4 text-blue-600" />
                      </div>
                      {offer.respondedAt && <div className="w-px h-full bg-border mt-2" />}
                    </div>
                    <div className={offer.respondedAt ? 'pb-8' : ''}>
                      <p className="font-medium">Angebot versendet</p>
                      <p className="text-muted-foreground">{formatDateTime(offer.sentAt)}</p>
                    </div>
                  </div>
                )}

                {offer.respondedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          offer.status === 'accepted'
                            ? 'bg-green-100 dark:bg-green-950/20'
                            : 'bg-red-100 dark:bg-red-950/20'
                        }`}
                      >
                        {offer.status === 'accepted' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        {offer.status === 'accepted' ? 'Angebot angenommen' : 'Angebot abgelehnt'}
                      </p>
                      <p className="text-muted-foreground">
                        {formatDateTime(offer.respondedAt)}
                      </p>
                    </div>
                  </div>
                )}
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
              <p className="font-medium mb-3">{offer.customerName}</p>
              <Button variant="outline" className="w-full" onClick={handleViewCustomer}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Kunde öffnen
              </Button>
            </CardContent>
          </Card>

          {/* Opportunity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-3">{offer.opportunityName}</p>
              <Button variant="outline" className="w-full" onClick={handleViewOpportunity}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Opportunity öffnen
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {offer.status === 'draft' && (
                <>
                  <Button variant="outline" className="w-full" onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Bearbeiten
                  </Button>
                  <Button className="w-full" onClick={handleSend}>
                    <Send className="mr-2 h-4 w-4" />
                    Versenden
                  </Button>
                </>
              )}

              {offer.status === 'sent' && (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600"
                    onClick={handleAccept}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Angenommen
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600"
                    onClick={handleReject}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Abgelehnt
                  </Button>
                </>
              )}

              {offer.status === 'accepted' && (
                <Button className="w-full" onClick={handleConvertToContract}>
                  <FileCheck className="mr-2 h-4 w-4" />
                  In Vertrag umwandeln
                </Button>
              )}

              {offer.hasPdf && (
                <Button variant="outline" className="w-full" onClick={handleDownloadPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF herunterladen
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
export function OfferDetailViewDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Angebotsdetailansicht</CardTitle>
          <CardDescription>
            Detailansicht eines Angebots mit PDF-Viewer, Status-Management und Vertragsumwandlung
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <OfferDetailView />
    </div>
  );
}