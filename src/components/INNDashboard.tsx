import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
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
  ChevronRight,
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
  const badges: Record<POStatus, { label: string; className: string }> = {
    draft: { label: 'Entwurf', className: 'bg-muted text-muted-foreground' },
    pending_approval: { label: 'Freigabe ausstehend', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400' },
    approved: { label: 'Genehmigt', className: 'bg-primary/20 text-primary' },
    sent: { label: 'Gesendet', className: 'bg-primary/20 text-primary' },
    confirmed: { label: 'Bestätigt', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' },
    in_transit: { label: 'In Lieferung', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' },
    delayed: { label: 'Verspätet', className: 'bg-destructive/20 text-destructive' },
    delivered: { label: 'Geliefert', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' },
  };
  return badges[status];
}

export function getProjectStatusBadge(status: ProjectStatus) {
  const badges: Record<ProjectStatus, { label: string; className: string }> = {
    planned: { label: 'Geplant', className: 'bg-muted text-muted-foreground' },
    confirmed: { label: 'Bestätigt', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400' },
    in_progress: { label: 'In Arbeit', className: 'bg-primary/20 text-primary' },
    delayed: { label: 'Verzögert', className: 'bg-destructive/20 text-destructive' },
    completed: { label: 'Abgeschlossen', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' },
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
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Aktive Lieferanten</p>
              <p className="text-2xl font-bold text-foreground">
                {data.activeSuppliers}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-primary font-medium">Top-bewertet: {data.topRated} mit {'>'}4★</span>
                {data.pendingApproval > 0 && (
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 text-xs">
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
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Offene Bestellungen</p>
              <p className="text-2xl font-bold text-foreground">
                {data.openPOs}
              </p>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-muted-foreground">Wert: {formatCurrency(data.poValue)}</p>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 text-xs">
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
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lieferungen (heute)</p>
              <p className="text-2xl font-bold text-foreground">
                {data.todayDeliveries}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-primary font-medium">Erfasst: {data.recorded}/{data.todayDeliveries}</span>
                {data.delayed > 0 && (
                  <Badge variant="destructive" className="text-xs">{data.delayed} verspätet</Badge>
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
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lieferantenrechnungen</p>
              <p className="text-2xl font-bold text-foreground">
                {data.pendingInvoices}
              </p>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-muted-foreground">Wert: {formatCurrency(data.invoiceValue)}</p>
                {data.requiresApproval > 0 && (
                  <Badge variant="destructive" className="text-xs">
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
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lagerbestand [Phase 2]</p>
              <p className="text-2xl font-bold text-foreground">
                €45k
              </p>
              <div className="space-y-1 mt-1">
                <p className="text-xs text-muted-foreground">142 Positionen</p>
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 text-xs">8 unter Mindest</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Performance */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Lieferanten-Performance</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-foreground">
                  {data.averageRating.toFixed(1)}
                </p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(data.averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted'
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
                ? 'bg-green-50/50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : delivery.status === 'delayed'
                ? 'bg-destructive/10 border-destructive/20'
                : 'bg-card border-border'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background border border-border">
                  <span className="font-bold text-foreground">{delivery.time}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {delivery.status === 'recorded' && <Check className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {delivery.status === 'expected' && <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {delivery.status === 'delayed' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    <span className="font-semibold text-foreground">
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
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                    Erfasst: {delivery.actualTime}
                  </Badge>
                )}
                {delivery.status === 'expected' && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">ETA: {delivery.eta}</Badge>
                )}
                {delivery.status === 'delayed' && (
                  <Badge variant="destructive">VERSPÄTET!</Badge>
                )}
              </div>
            </div>
            {delivery.status === 'delayed' && delivery.delay && (
              <p className="text-sm text-destructive mt-2">{delivery.delay}</p>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO-Nr.</TableHead>
              <TableHead>Projekt</TableHead>
              <TableHead>Lieferant</TableHead>
              <TableHead className="text-right">Wert</TableHead>
              <TableHead>Benötigt bis</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusBadge = getPOStatusBadge(order.status);
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <button className="text-primary hover:underline font-medium">{order.poNumber}</button>
                  </TableCell>
                  <TableCell>
                    <button className="text-primary hover:underline">{order.project}</button>
                  </TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.value)}</TableCell>
                  <TableCell className="text-sm">{order.requiredBy}</TableCell>
                  <TableCell>
                    <Badge className={statusBadge.className} variant="outline">{statusBadge.label}</Badge>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
              invoice.urgent 
                ? 'bg-destructive/5 border-destructive/20' 
                : 'bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {invoice.urgent ? (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                ) : (
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
                <div>
                  <p className="font-semibold">
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
                Wartet auf: <span className="font-medium">{invoice.waitingFor}</span>{' '}
                (seit {invoice.daysWaiting} Tagen)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Details
                </Button>
                {invoice.urgent ? (
                  <Button size="sm" variant="destructive">
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
            <div key={supplier.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-semibold">{supplier.name}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(supplier.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium">{supplier.rating.toFixed(1)}</span>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projekt</TableHead>
              <TableHead>Lieferant</TableHead>
              <TableHead>Arbeitspaket</TableHead>
              <TableHead>Zeitraum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => {
              const statusBadge = getProjectStatusBadge(assignment.status);
              return (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <button className="text-primary hover:underline font-medium">{assignment.project}</button>
                  </TableCell>
                  <TableCell>{assignment.supplier}</TableCell>
                  <TableCell className="text-sm">{assignment.workPackage}</TableCell>
                  <TableCell className="text-sm">{assignment.timeframe}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={statusBadge.className} variant="outline">{statusBadge.label}</Badge>
                      {assignment.progress && (
                        <div className="flex items-center gap-2">
                          <Progress value={assignment.progress} className="w-16 h-2" />
                          <span className="text-xs">{assignment.progress}%</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                     {assignment.budgetStatus === 'ok' && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">OK</Badge>}
                     {assignment.budgetStatus === 'warning' && <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">Var {assignment.budgetVariance}%</Badge>}
                     {assignment.budgetStatus === 'critical' && <Badge variant="destructive">CRITICAL</Badge>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component
export function INNDashboardDemo() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Innendienst Dashboard</h2>
          <p className="text-muted-foreground">
            Übersicht über Einkauf, Lieferanten und Logistik
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline">
             <FileText className="mr-2 h-4 w-4" />
             Bericht exportieren
           </Button>
           <Button>
             <Plus className="mr-2 h-4 w-4" />
             Neue Bestellung
           </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="deliveries">Logistik & Lieferungen</TabsTrigger>
          <TabsTrigger value="purchasing">Einkauf & Rechnungen</TabsTrigger>
          <TabsTrigger value="suppliers">Lieferanten</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <KPICards data={mockKPIData} />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <TodaysDeliveries deliveries={mockDeliveries} />
            </div>
            <div className="col-span-3">
              <PendingInvoices invoices={mockInvoices} />
            </div>
          </div>

          <OpenPurchaseOrders orders={mockPOs} />
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
           <div className="grid gap-4 md:grid-cols-1">
              <TodaysDeliveries deliveries={mockDeliveries} />
           </div>
        </TabsContent>
        
        <TabsContent value="purchasing" className="space-y-4">
           <OpenPurchaseOrders orders={mockPOs} />
           <PendingInvoices invoices={mockInvoices} />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
           <SupplierOverview suppliers={mockSuppliers} />
           <ProjectAssignments assignments={mockAssignments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
