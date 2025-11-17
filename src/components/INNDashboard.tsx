import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  Building2,
  ShoppingCart,
  Truck,
  FileText,
  Package,
  Star,
  Plus,
  Check,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Award,
  Ban,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Types
export type POStatus = 'draft' | 'pending_approval' | 'approved' | 'sent' | 'confirmed' | 'in_transit' | 'delayed' | 'delivered';
export type DeliveryStatus = 'expected' | 'recorded' | 'delayed';
export type InvoiceStatus = 'pending_approval' | 'approved' | 'paid';
export type ProjectStatus = 'planned' | 'confirmed' | 'in_progress' | 'delayed' | 'completed';

export interface KPIData {
  activeSuppliers: number;
  topRated: number;
  pendingApproval: number;
  openPOs: number;
  poValue: number;
  dueThisWeek: number;
  todayDeliveries: number;
  delayed: number;
  recorded: number;
  pendingInvoices: number;
  invoiceValue: number;
  requiresApproval: number;
  averageRating: number;
  ratedOrders: number;
  topPerformer: string;
}

export interface Delivery {
  id: string;
  time: string;
  supplier: string;
  project: string;
  items: string[];
  status: DeliveryStatus;
  actualTime?: string;
  eta?: string;
  delay?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  project: string;
  supplier: string;
  value: number;
  requiredBy: string;
  status: POStatus;
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  project: string;
  amount: number;
  dueDate: string;
  waitingFor: string;
  daysWaiting: number;
  urgent: boolean;
}

export interface SupplierCard {
  id: string;
  name: string;
  rating: number;
  activeProjects: number;
  lastActivity: string;
}

export interface ProjectAssignment {
  id: string;
  project: string;
  supplier: string;
  workPackage: string;
  timeframe: string;
  status: ProjectStatus;
  progress?: number;
  budgetStatus: 'ok' | 'warning' | 'critical';
  budgetVariance?: number;
}

// Mock Data
export const mockKPIData: KPIData = {
  activeSuppliers: 24,
  topRated: 18,
  pendingApproval: 2,
  openPOs: 12,
  poValue: 245000,
  dueThisWeek: 3,
  todayDeliveries: 5,
  delayed: 2,
  recorded: 3,
  pendingInvoices: 8,
  invoiceValue: 87500,
  requiresApproval: 3,
  averageRating: 4.3,
  ratedOrders: 45,
  topPerformer: 'Schreinerei Müller',
};

export const mockDeliveries: Delivery[] = [
  {
    id: 'del1',
    time: '09:00',
    supplier: 'Schreinerei Müller',
    project: 'P-2025-M003',
    items: ['LED-Panels (24 Stk)', 'Regale (8 Stk)', 'Theke (1 Stk)'],
    status: 'recorded',
    actualTime: '09:15',
  },
  {
    id: 'del2',
    time: '11:00',
    supplier: 'Elektro Schmidt',
    project: 'P-2025-B015',
    items: ['Steckdosen (50 Stk)', 'Verkabelung (120 lfm)', 'Beleuchtung (12 Stk)'],
    status: 'expected',
    eta: '11:30',
  },
  {
    id: 'del3',
    time: '12:00',
    supplier: 'Holzgroßhandel Weber',
    project: 'P-2024-M007',
    items: ['Holzplatten (20 qm)', 'Leisten (50 lfm)'],
    status: 'delayed',
    delay: 'Original: 12.02 • Neuer ETA: 15.02',
  },
];

export const mockPOs: PurchaseOrder[] = [
  {
    id: 'po1',
    poNumber: 'PO-2025-234',
    project: 'P-2025-M003',
    supplier: 'Müller GmbH',
    value: 118450,
    requiredBy: '15.02.25',
    status: 'in_transit',
  },
  {
    id: 'po2',
    poNumber: 'PO-2025-235',
    project: 'P-2025-B015',
    supplier: 'Schmidt',
    value: 35600,
    requiredBy: '20.02.25',
    status: 'confirmed',
  },
  {
    id: 'po3',
    poNumber: 'PO-2025-236',
    project: 'P-2024-M007',
    supplier: 'Weber KG',
    value: 22000,
    requiredBy: '18.02.25',
    status: 'sent',
  },
];

export const mockInvoices: SupplierInvoice[] = [
  {
    id: 'inv1',
    invoiceNumber: 'R-SUP-24-456',
    supplier: 'Schreinerei Müller',
    project: 'P-2025-M003',
    amount: 118450,
    dueDate: '15.03.2025',
    waitingFor: 'BUCH-Freigabe',
    daysWaiting: 2,
    urgent: false,
  },
  {
    id: 'inv2',
    invoiceNumber: 'R-SUP-24-423',
    supplier: 'Elektro Schmidt',
    project: 'P-2025-B015',
    amount: 35600,
    dueDate: '10.03.2025',
    waitingFor: 'GF-Freigabe',
    daysWaiting: 5,
    urgent: true,
  },
];

export const mockSuppliers: SupplierCard[] = [
  {
    id: 'sup1',
    name: 'Schreinerei Müller',
    rating: 4.8,
    activeProjects: 5,
    lastActivity: 'Vor 2 Tagen',
  },
  {
    id: 'sup2',
    name: 'Elektro Schmidt',
    rating: 4.2,
    activeProjects: 2,
    lastActivity: 'Vor 1 Woche',
  },
  {
    id: 'sup3',
    name: 'Holzgroßhandel Weber',
    rating: 4.0,
    activeProjects: 3,
    lastActivity: 'Vor 3 Tagen',
  },
];

export const mockAssignments: ProjectAssignment[] = [
  {
    id: 'ass1',
    project: 'P-2025-M003',
    supplier: 'Elektro Schmidt',
    workPackage: 'Elektrik Installation',
    timeframe: '01-15.02',
    status: 'in_progress',
    progress: 65,
    budgetStatus: 'ok',
  },
  {
    id: 'ass2',
    project: 'P-2025-B015',
    supplier: 'Tischlerei Müller',
    workPackage: 'Ladenregale',
    timeframe: '10-25.02',
    status: 'planned',
    budgetStatus: 'ok',
  },
  {
    id: 'ass3',
    project: 'P-2024-M007',
    supplier: 'Maler Wagner',
    workPackage: 'Wandbemalung',
    timeframe: '05-10.03',
    status: 'delayed',
    budgetStatus: 'warning',
    budgetVariance: 8,
  },
];

// Helper Functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function getPOStatusBadge(status: POStatus) {
  const badges: Record<POStatus, { label: string; variant: string }> = {
    draft: { label: 'Entwurf', variant: 'bg-gray-100 text-gray-800' },
    pending_approval: { label: 'Freigabe ausstehend', variant: 'bg-amber-100 text-amber-800' },
    approved: { label: 'Genehmigt', variant: 'bg-blue-100 text-blue-800' },
    sent: { label: 'Gesendet', variant: 'bg-blue-100 text-blue-800' },
    confirmed: { label: 'Bestätigt', variant: 'bg-green-100 text-green-800' },
    in_transit: { label: 'In Lieferung', variant: 'bg-blue-100 text-blue-800' },
    delayed: { label: 'Verspätet', variant: 'bg-red-100 text-red-800' },
    delivered: { label: 'Geliefert', variant: 'bg-green-100 text-green-800' },
  };
  return badges[status];
}

export function getProjectStatusBadge(status: ProjectStatus) {
  const badges: Record<ProjectStatus, { label: string; variant: string }> = {
    planned: { label: 'Geplant', variant: 'bg-gray-100 text-gray-800' },
    confirmed: { label: 'Bestätigt', variant: 'bg-blue-100 text-blue-800' },
    in_progress: { label: 'In Arbeit', variant: 'bg-blue-100 text-blue-800' },
    delayed: { label: 'Verzögert', variant: 'bg-red-100 text-red-800' },
    completed: { label: 'Abgeschlossen', variant: 'bg-green-100 text-green-800' },
  };
  return badges[status];
}

// KPI Cards Component
export function KPICards({ data }: { data: KPIData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Active Suppliers */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Aktive Lieferanten</p>
              <p className="text-blue-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
                {data.activeSuppliers}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-600">Top-bewertet: {data.topRated} mit {'>'}4★</span>
                {data.pendingApproval > 0 && (
                  <Badge className="bg-amber-100 text-amber-800 text-xs">
                    {data.pendingApproval} Freigabe
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Purchase Orders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Offene Bestellungen</p>
              <p className="text-amber-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
                {data.openPOs}
              </p>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-muted-foreground">Wert: {formatCurrency(data.poValue)}</p>
                <Badge className="bg-orange-100 text-orange-800 text-xs">
                  {data.dueThisWeek} fällig diese Woche
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Deliveries */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lieferungen (heute)</p>
              <p className="text-blue-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
                {data.todayDeliveries}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-600">Erfasst: {data.recorded}/{data.todayDeliveries}</span>
                {data.delayed > 0 && (
                  <Badge className="bg-red-100 text-red-800 text-xs">{data.delayed} verspätet</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Invoices */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lieferantenrechnungen</p>
              <p className="text-amber-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
                {data.pendingInvoices}
              </p>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-muted-foreground">Wert: {formatCurrency(data.invoiceValue)}</p>
                {data.requiresApproval > 0 && (
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    {data.requiresApproval} {'>'} €1k Freigabe
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Stock (Phase 2) */}
      <Card className="opacity-60">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lagerbestand [Phase 2]</p>
              <p className="text-blue-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
                €45k
              </p>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-muted-foreground">142 Positionen</p>
                <Badge className="bg-amber-100 text-amber-800 text-xs">8 unter Mindest</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lieferanten-Performance</p>
              <div className="flex items-center gap-1">
                <p className="text-green-600" style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
                  {data.averageRating.toFixed(1)}
                </p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(data.averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{data.ratedOrders} abgeschlossene Aufträge</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Today's Deliveries Component
export function TodaysDeliveries({ deliveries }: { deliveries: Delivery[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Heutige Lieferungen</CardTitle>
          <Button variant="outline" size="sm">
            Alle anzeigen
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className={`p-4 border rounded-lg ${
              delivery.status === 'recorded'
                ? 'bg-green-50 border-green-200'
                : delivery.status === 'delayed'
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
                  <span style={{ fontWeight: 'var(--font-weight-bold)' }}>{delivery.time}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {delivery.status === 'recorded' && <Check className="h-4 w-4 text-green-600" />}
                    {delivery.status === 'expected' && <Clock className="h-4 w-4 text-blue-600" />}
                    {delivery.status === 'delayed' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {delivery.supplier}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{delivery.project}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {delivery.items.length} Positionen: {delivery.items.join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {delivery.status === 'recorded' && (
                  <Badge className="bg-green-100 text-green-800">
                    Erfasst: {delivery.actualTime}
                  </Badge>
                )}
                {delivery.status === 'expected' && (
                  <Badge className="bg-blue-100 text-blue-800">ETA: {delivery.eta}</Badge>
                )}
                {delivery.status === 'delayed' && (
                  <Badge className="bg-red-100 text-red-800">VERSPÄTET!</Badge>
                )}
              </div>
            </div>
            {delivery.status === 'delayed' && delivery.delay && (
              <p className="text-sm text-red-600 mt-2">{delivery.delay}</p>
            )}
            <div className="flex gap-2 mt-3">
              {delivery.status === 'expected' && (
                <Button size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Lieferung erfassen
                </Button>
              )}
              {delivery.status === 'delayed' && (
                <>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Lieferant kontaktieren
                  </Button>
                  <Button variant="outline" size="sm">
                    Verzögerung loggen
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Open Purchase Orders Component
export function OpenPurchaseOrders({ orders }: { orders: PurchaseOrder[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Offene Bestellungen</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Neue Bestellung
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3">PO-Nr.</th>
                <th className="text-left p-3">Projekt</th>
                <th className="text-left p-3">Lieferant</th>
                <th className="text-right p-3">Wert</th>
                <th className="text-left p-3">Benötigt bis</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusBadge = getPOStatusBadge(order.status);
                return (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">{order.poNumber}</button>
                    </td>
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">{order.project}</button>
                    </td>
                    <td className="p-3">{order.supplier}</td>
                    <td className="p-3 text-right">{formatCurrency(order.value)}</td>
                    <td className="p-3 text-sm">{order.requiredBy}</td>
                    <td className="p-3">
                      <Badge className={statusBadge.variant}>{statusBadge.label}</Badge>
                    </td>
                    <td className="p-3">
                      {order.status === 'in_transit' && (
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4 mr-1" />
                          Lieferung
                        </Button>
                      )}
                      {order.status === 'confirmed' && (
                        <Button variant="outline" size="sm">
                          Verfolgen
                        </Button>
                      )}
                      {order.status === 'sent' && (
                        <Button variant="outline" size="sm">
                          Nachfassen
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Pending Invoices Component
export function PendingInvoices({ invoices }: { invoices: SupplierInvoice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lieferantenrechnungen zur Freigabe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className={`p-4 border rounded-lg ${
              invoice.urgent ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {invoice.urgent ? (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                ) : (
                  <Clock className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    Rechnung {invoice.invoiceNumber} • {invoice.supplier}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Projekt: {invoice.project} • {formatCurrency(invoice.amount)} • Fällig:{' '}
                    {invoice.dueDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm">
                Wartet auf: <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{invoice.waitingFor}</span>{' '}
                (seit {invoice.daysWaiting} Tagen)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Details
                </Button>
                {invoice.urgent ? (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    GF benachrichtigen
                  </Button>
                ) : (
                  <Button size="sm">Freigabe anfragen</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Supplier Overview Component
export function SupplierOverview({ suppliers }: { suppliers: SupplierCard[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lieferanten-Übersicht</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Top-bewertet {'>'}4.5★
            </Button>
            <Button variant="outline" size="sm">
              Alle anzeigen
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>{supplier.name}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(supplier.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm">{supplier.rating.toFixed(1)}</span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                <p>{supplier.activeProjects} aktive Projekte</p>
                <p>Letzte Aktivität: {supplier.lastActivity}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Details
                </Button>
                <Button size="sm" className="flex-1">
                  Vertrag
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Project Assignments Component
export function ProjectAssignments({ assignments }: { assignments: ProjectAssignment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projekt-Zuweisungen (Subunternehmer)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-3">Projekt</th>
                <th className="text-left p-3">Lieferant</th>
                <th className="text-left p-3">Arbeitspaket</th>
                <th className="text-left p-3">Zeitraum</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Budget</th>
                <th className="text-left p-3">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => {
                const statusBadge = getProjectStatusBadge(assignment.status);
                return (
                  <tr key={assignment.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <button className="text-blue-600 hover:underline">{assignment.project}</button>
                    </td>
                    <td className="p-3">{assignment.supplier}</td>
                    <td className="p-3 text-sm">{assignment.workPackage}</td>
                    <td className="p-3 text-sm">{assignment.timeframe}</td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <Badge className={statusBadge.variant}>{statusBadge.label}</Badge>
                        {assignment.progress && (
                          <div className="flex items-center gap-2">
                            <Progress value={assignment.progress} className="w-16 h-2" />
                            <span className="text-xs">{assignment.progress}%</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {assignment.budgetStatus === 'ok' && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Im Rahmen
                        </Badge>
                      )}
                      {assignment.budgetStatus === 'warning' && (
                        <Badge className="bg-amber-100 text-amber-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          +{assignment.budgetVariance}%
                        </Badge>
                      )}
                      {assignment.budgetStatus === 'critical' && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          +{assignment.budgetVariance}%
                        </Badge>
                      )}
                    </td>
                    <td className="p-3">
                      {assignment.status === 'in_progress' && (
                        <Button variant="outline" size="sm">
                          Verfolgen
                        </Button>
                      )}
                      {assignment.status === 'planned' && (
                        <Button size="sm">Beauftragen</Button>
                      )}
                      {assignment.status === 'delayed' && (
                        <Button variant="outline" size="sm" className="text-red-600">
                          Kontakt
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Main INN Dashboard
export function INNDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'suppliers' | 'orders' | 'projects'>('overview');

  const handleRecordDelivery = () => {
    toast.success('Lieferung erfasst');
  };

  const handleContactSupplier = () => {
    toast.info('Lieferant kontaktieren');
  };

  const handleRequestApproval = () => {
    toast.success('Freigabeanfrage gesendet');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Innendienst & Beschaffung</h1>
          <p className="text-sm text-muted-foreground">
            Lieferantenkoordination, Bestellverwaltung und Materialverfolgung
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              CW
            </div>
            <div>
              <p className="text-sm" style={{ fontWeight: 'var(--font-weight-medium)' }}>
                Claudia Weber
              </p>
              <p className="text-xs text-muted-foreground">INN</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)}>
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="suppliers">Lieferanten</TabsTrigger>
          <TabsTrigger value="orders">Bestellungen</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* KPI Cards */}
          <KPICards data={mockKPIData} />

          {/* Today's Deliveries */}
          <TodaysDeliveries deliveries={mockDeliveries} />

          {/* Open Purchase Orders */}
          <OpenPurchaseOrders orders={mockPOs} />

          {/* Pending Invoices */}
          <PendingInvoices invoices={mockInvoices} />

          {/* Supplier Overview */}
          <SupplierOverview suppliers={mockSuppliers} />

          {/* Project Assignments */}
          <ProjectAssignments assignments={mockAssignments} />
        </TabsContent>

        <TabsContent value="suppliers" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Lieferantenverwaltung</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Vollständige Lieferantenliste und -verwaltung
              </p>
              <Button>Zur Lieferantenliste</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Bestellverwaltung</h3>
              <p className="text-sm text-muted-foreground mb-6">Alle Bestellungen und Purchase Orders</p>
              <Button>Alle Bestellungen anzeigen</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Projektmaterialien</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Material- und Beschaffungsübersicht nach Projekten
              </p>
              <Button>Projektübersicht anzeigen</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Demo Component
export function INNDashboardDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">INN Dashboard (Innendienst & Beschaffung)</h2>
        <p className="text-sm text-muted-foreground">
          Umfassendes Dashboard für Lieferantenkoordination, Bestellverwaltung, Materialverfolgung und
          Rechnungsfreigabe
        </p>
      </div>

      {/* Main Dashboard */}
      <INNDashboard />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Funktionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>6 KPI-Karten:</strong> Aktive Lieferanten, Offene Bestellungen, Lieferungen, Rechnungen,
              Lager, Performance
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Heutige Lieferungen:</strong> Timeline-Ansicht mit Status (Erfasst, Erwartet, Verspätet)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Offene Bestellungen:</strong> Tabelle mit PO-Tracking und Statusverfolgung
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Rechnungsfreigabe:</strong> Alert-Karten für ausstehende Freigaben mit Dringlichkeit
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Lieferanten-Performance:</strong> Top 6 mit Bewertungen und Aktivität
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Projekt-Zuweisungen:</strong> Subunternehmer-Tracking mit Fortschritt und Budget
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>4 Ansichten:</strong> Übersicht, Lieferanten, Bestellungen, Projekte
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Schnellaktionen:</strong> Lieferung erfassen, Lieferant kontaktieren, Freigabe anfragen
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
          <p>• 24 Aktive Lieferanten (18 top-bewertet, 2 freigabe ausstehend)</p>
          <p>• 12 Offene Bestellungen (€245k, 3 fällig diese Woche)</p>
          <p>• 5 Lieferungen heute (3 erfasst, 2 verspätet)</p>
          <p>• 8 Rechnungen ausstehend (€87,5k, 3 über €1k)</p>
          <p>• Durchschnittliche Performance: 4.3★ (45 Aufträge)</p>
          <p>• 3 Lieferanten: Schreinerei Müller (4.8★), Elektro Schmidt (4.2★), Weber (4.0★)</p>
          <p>• 3 Projekt-Zuweisungen mit verschiedenen Status</p>
        </CardContent>
      </Card>
    </div>
  );
}
