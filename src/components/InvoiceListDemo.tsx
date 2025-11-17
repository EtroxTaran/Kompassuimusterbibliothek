import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from './ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  MoreVertical,
  X,
  ChevronUp,
  ChevronDown,
  FileText,
  Lock,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Printer,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// Invoice types
type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: {
    name: string;
    vatId: string;
  };
  invoiceDate: string; // ISO date
  dueDate: string; // ISO date
  amount: number;
  netAmount: number;
  vatAmount: number;
  status: InvoiceStatus;
  paidAmount: number;
  paymentDate?: string; // ISO date
  projectNumber?: string;
  isFinalized: boolean; // GoBD locked
  itemsCount: number;
}

// Status config
const statusConfig: Record<
  InvoiceStatus,
  { label: string; color: string; bgColor: string; icon: any }
> = {
  draft: {
    label: 'Entwurf',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: FileText,
  },
  pending: {
    label: 'Ausstehend',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: Clock,
  },
  paid: {
    label: 'Bezahlt',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
  },
  overdue: {
    label: 'Überfällig',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: AlertCircle,
  },
  partial: {
    label: 'Teilweise bezahlt',
    color: 'text-primary',
    bgColor: 'bg-accent/50',
    icon: Clock,
  },
  cancelled: {
    label: 'Storniert',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: XCircle,
  },
};

// Sample invoices
const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'R-2024-00456',
    customer: {
      name: 'Hofladen Müller GmbH',
      vatId: 'DE123456789',
    },
    invoiceDate: '2024-11-15',
    dueDate: '2024-12-15',
    amount: 63546.0,
    netAmount: 53400.0,
    vatAmount: 10146.0,
    status: 'pending',
    paidAmount: 0,
    projectNumber: 'P-2024-B023',
    isFinalized: true,
    itemsCount: 5,
  },
  {
    id: '2',
    invoiceNumber: 'R-2024-00445',
    customer: {
      name: 'REWE Köln Süd',
      vatId: 'DE987654321',
    },
    invoiceDate: '2024-11-08',
    dueDate: '2024-12-08',
    amount: 125000.0,
    netAmount: 105042.0,
    vatAmount: 19958.0,
    status: 'paid',
    paidAmount: 125000.0,
    paymentDate: '2024-12-05',
    projectNumber: 'P-2024-A015',
    isFinalized: true,
    itemsCount: 12,
  },
  {
    id: '3',
    invoiceNumber: 'R-2024-00398',
    customer: {
      name: 'Biomarkt Heidelberg',
      vatId: 'DE555666777',
    },
    invoiceDate: '2024-10-15',
    dueDate: '2024-11-14',
    amount: 42000.0,
    netAmount: 35294.12,
    vatAmount: 6705.88,
    status: 'overdue',
    paidAmount: 0,
    isFinalized: true,
    itemsCount: 8,
  },
  {
    id: '4',
    invoiceNumber: 'R-2024-00489',
    customer: {
      name: 'Edeka Hamburg Nord',
      vatId: 'DE111222333',
    },
    invoiceDate: '2024-11-20',
    dueDate: '2024-12-20',
    amount: 87500.0,
    netAmount: 73529.41,
    vatAmount: 13970.59,
    status: 'partial',
    paidAmount: 40000.0,
    projectNumber: 'P-2024-C012',
    isFinalized: true,
    itemsCount: 10,
  },
  {
    id: '5',
    invoiceNumber: 'R-2024-00501',
    customer: {
      name: 'Alnatura Berlin',
      vatId: 'DE444555666',
    },
    invoiceDate: '2024-11-25',
    dueDate: '2024-12-25',
    amount: 54200.0,
    netAmount: 45546.22,
    vatAmount: 8653.78,
    status: 'draft',
    paidAmount: 0,
    isFinalized: false,
    itemsCount: 6,
  },
  {
    id: '6',
    invoiceNumber: 'R-2024-00312',
    customer: {
      name: 'Kaisers Frankfurt',
      vatId: 'DE777888999',
    },
    invoiceDate: '2024-09-10',
    dueDate: '2024-10-10',
    amount: 28000.0,
    netAmount: 23529.41,
    vatAmount: 4470.59,
    status: 'overdue',
    paidAmount: 0,
    isFinalized: true,
    itemsCount: 4,
  },
];

// Format currency (German)
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Format date (German)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
}

// Check if overdue
function isOverdue(dueDate: string, status: InvoiceStatus): boolean {
  if (status === 'paid' || status === 'cancelled') return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due < now;
}

// Check if due soon (within 7 days)
function isDueSoon(dueDate: string, status: InvoiceStatus): boolean {
  if (status === 'paid' || status === 'cancelled') return false;
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
}

// Days overdue
function getDaysOverdue(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Status badge component
function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.bgColor} ${config.color} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// Invoice row component
function InvoiceRow({
  invoice,
  isSelected,
  onSelect,
  onView,
}: {
  invoice: Invoice;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onView: () => void;
}) {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const overdue = isOverdue(invoice.dueDate, invoice.status);
  const dueSoon = isDueSoon(invoice.dueDate, invoice.status);
  const actualStatus = overdue && invoice.status !== 'paid' ? 'overdue' : invoice.status;
  const paymentPercentage = (invoice.paidAmount / invoice.amount) * 100;

  const rowBgClass =
    actualStatus === 'overdue'
      ? 'bg-red-50 hover:bg-red-100'
      : actualStatus === 'paid'
        ? 'bg-green-50 hover:bg-green-100'
        : actualStatus === 'draft'
          ? 'bg-gray-50 hover:bg-gray-100'
          : 'hover:bg-accent/30';

  return (
    <>
      <TableRow className={`${rowBgClass} ${isSelected ? 'bg-accent/30' : ''}`}>
        {/* Checkbox */}
        <TableCell className="w-12">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} />
        </TableCell>

        {/* Invoice Number */}
        <TableCell>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  onClick={onView}
                  className="font-mono font-medium text-primary hover:underline flex items-center gap-2"
                >
                  {invoice.invoiceNumber}
                  {invoice.isFinalized && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Abgeschlossene Rechnung (GoBD-konform, unveränderlich)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <h4>{invoice.customer.name}</h4>
                    <p className="text-sm text-muted-foreground">{invoice.customer.vatId}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <StatusBadge status={actualStatus} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Positionen:</span>
                      <span>{invoice.itemsCount} Positionen</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Betrag:</span>
                      <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-2 h-3 w-3" />
                      PDF anzeigen
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="mr-2 h-3 w-3" />
                      E-Mail senden
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {invoice.isFinalized && (
              <Badge variant="outline" className="text-xs">
                GoBD
              </Badge>
            )}
          </div>
        </TableCell>

        {/* Customer */}
        <TableCell>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{invoice.customer.name}</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">{invoice.customer.vatId}</div>
          </div>
        </TableCell>

        {/* Invoice Date */}
        <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>

        {/* Due Date */}
        <TableCell>
          {actualStatus === 'paid' ? (
            <span className="text-green-700 line-through">{formatDate(invoice.dueDate)}</span>
          ) : overdue ? (
            <div className="flex items-center gap-1 text-red-700 font-medium">
              <AlertCircle className="h-3 w-3" />
              {formatDate(invoice.dueDate)}
            </div>
          ) : dueSoon ? (
            <span className="text-amber-700">{formatDate(invoice.dueDate)}</span>
          ) : (
            <span>{formatDate(invoice.dueDate)}</span>
          )}
        </TableCell>

        {/* Amount */}
        <TableCell className="text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="font-bold cursor-help">{formatCurrency(invoice.amount)}</div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between gap-4">
                    <span>Netto:</span>
                    <span className="font-medium">{formatCurrency(invoice.netAmount)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>MwSt.:</span>
                    <span className="font-medium">{formatCurrency(invoice.vatAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Gesamt:</span>
                    <span className="font-bold">{formatCurrency(invoice.amount)}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>

        {/* Status */}
        <TableCell>
          <StatusBadge status={actualStatus} />
        </TableCell>

        {/* Paid */}
        <TableCell className="text-right">
          {invoice.paidAmount === 0 ? (
            <span className="text-muted-foreground">€ 0,00</span>
          ) : invoice.paidAmount === invoice.amount ? (
            <div>
              <div className="text-green-700 font-medium">
                {formatCurrency(invoice.paidAmount)}
              </div>
              {invoice.paymentDate && (
                <div className="text-xs text-muted-foreground">
                  Bezahlt am: {formatDate(invoice.paymentDate)}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="text-amber-700 font-medium">
                {formatCurrency(invoice.paidAmount)} / {formatCurrency(invoice.amount)}
              </div>
              <Progress value={paymentPercentage} className="h-1 mt-1" />
            </div>
          )}
        </TableCell>

        {/* Project */}
        <TableCell>
          {invoice.projectNumber ? (
            <button className="text-primary hover:underline flex items-center gap-1">
              {invoice.projectNumber}
              <ExternalLink className="h-3 w-3" />
            </button>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>

        {/* Actions */}
        <TableCell>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>PDF anzeigen</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Herunterladen</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Per E-Mail senden</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  Drucken
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPaymentDialogOpen(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Zahlung buchen
                </DropdownMenuItem>
                {actualStatus === 'overdue' && (
                  <DropdownMenuItem>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Mahnung senden
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Duplizieren
                </DropdownMenuItem>
                {!invoice.isFinalized && (
                  <DropdownMenuItem className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Stornieren
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zahlung buchen</DialogTitle>
            <DialogDescription>
              Rechnung {invoice.invoiceNumber} - {invoice.customer.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Betrag</Label>
              <Input
                type="text"
                defaultValue={formatCurrency(invoice.amount - invoice.paidAmount)}
              />
            </div>
            <div className="space-y-2">
              <Label>Zahlungsdatum</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <Label>Zahlungsmethode</Label>
              <Select defaultValue="bank-transfer">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Banküberweisung</SelectItem>
                  <SelectItem value="credit-card">Kreditkarte</SelectItem>
                  <SelectItem value="cash">Bar</SelectItem>
                  <SelectItem value="check">Scheck</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                setPaymentDialogOpen(false);
                toast.success('Zahlung erfolgreich gebucht');
              }}
            >
              Zahlung buchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Full invoice list view
function InvoiceListView({ userRole = 'GF' }: { userRole?: 'GF' | 'BUCH' | 'PLAN' | 'ADM' }) {
  const [invoices] = useState(sampleInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('invoiceDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus[]>([]);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRevenue = invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0);

    const openInvoices = invoices.filter(
      (i) => i.status === 'pending' || i.status === 'partial'
    );
    const openAmount = openInvoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

    const overdueInvoices = invoices.filter((i) => isOverdue(i.dueDate, i.status));
    const overdueAmount = overdueInvoices.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0);

    const paidInvoices = invoices.filter((i) => i.status === 'paid' && i.paymentDate);
    const avgPaymentDays =
      paidInvoices.length > 0
        ? Math.round(
            paidInvoices.reduce((sum, i) => {
              const invoice = new Date(i.invoiceDate);
              const payment = new Date(i.paymentDate!);
              const days = Math.ceil(
                (payment.getTime() - invoice.getTime()) / (1000 * 60 * 60 * 24)
              );
              return sum + days;
            }, 0) / paidInvoices.length
          )
        : 0;

    return {
      totalRevenue,
      openAmount,
      openCount: openInvoices.length,
      overdueAmount,
      overdueCount: overdueInvoices.length,
      avgPaymentDays,
    };
  }, [invoices]);

  // Filter and search
  const filteredInvoices = useMemo(() => {
    let result = invoices;

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(query) ||
          i.customer.name.toLowerCase().includes(query) ||
          i.customer.vatId.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus.length > 0) {
      result = result.filter((i) => {
        const actualStatus = isOverdue(i.dueDate, i.status) && i.status !== 'paid' ? 'overdue' : i.status;
        return filterStatus.includes(actualStatus);
      });
    }

    return result;
  }, [invoices, searchQuery, filterStatus]);

  // Sort
  const sortedInvoices = useMemo(() => {
    const sorted = [...filteredInvoices];
    sorted.sort((a, b) => {
      let aVal: any = a[sortColumn as keyof Invoice];
      let bVal: any = b[sortColumn as keyof Invoice];

      if (sortColumn === 'customer') {
        aVal = a.customer.name;
        bVal = b.customer.name;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredInvoices, sortColumn, sortDirection]);

  // Paginate
  const paginatedInvoices = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedInvoices.slice(start, end);
  }, [sortedInvoices, page, pageSize]);

  const totalPages = Math.ceil(sortedInvoices.length / pageSize);

  // Toggle sort
  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Select all
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedInvoices.map((i) => i.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Toggle select
  const toggleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const hasActiveFilters = filterStatus.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Rechnungen</h2>
        <p className="text-sm text-muted-foreground">
          {sortedInvoices.length} von {invoices.length} Rechnungen
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Gesamtumsatz</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-green-700">{formatCurrency(kpis.totalRevenue)}</h2>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Dieses Jahr</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Offene Rechnungen</p>
              <h2 className="text-amber-700">{formatCurrency(kpis.openAmount)}</h2>
              <p className="text-xs text-muted-foreground">{kpis.openCount} Rechnungen</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Überfällige</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-red-700">{formatCurrency(kpis.overdueAmount)}</h2>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-xs text-muted-foreground">{kpis.overdueCount} Rechnungen</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Durchschn. Zahlungsziel</p>
              <div className="flex items-baseline gap-2">
                <h2>{kpis.avgPaymentDays} Tage</h2>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Mittelwert</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Search, Quick Filters */}
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {/* Search */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechnungen durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Quick Filters */}
              <Button
                variant={filterStatus.includes('overdue') ? 'default' : 'outline'}
                onClick={() => {
                  if (filterStatus.includes('overdue')) {
                    setFilterStatus(filterStatus.filter((s) => s !== 'overdue'));
                  } else {
                    setFilterStatus([...filterStatus, 'overdue']);
                  }
                }}
                className={filterStatus.includes('overdue') ? 'bg-red-600' : ''}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Überfällig
              </Button>

              <Button
                variant={filterStatus.includes('pending') ? 'default' : 'outline'}
                onClick={() => {
                  if (filterStatus.includes('pending')) {
                    setFilterStatus(filterStatus.filter((s) => s !== 'pending'));
                  } else {
                    setFilterStatus([...filterStatus, 'pending']);
                  }
                }}
                className={filterStatus.includes('pending') ? 'bg-amber-600' : ''}
              >
                <Clock className="mr-2 h-4 w-4" />
                Unbezahlt
              </Button>

              {/* Filter Sheet */}
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    {hasActiveFilters && (
                      <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {filterStatus.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter</SheetTitle>
                    <SheetDescription>Rechnungen nach Kriterien filtern</SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 py-6">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="space-y-2">
                        {(['draft', 'pending', 'paid', 'overdue', 'partial', 'cancelled'] as InvoiceStatus[]).map(
                          (status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={`status-${status}`}
                                checked={filterStatus.includes(status)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFilterStatus([...filterStatus, status]);
                                  } else {
                                    setFilterStatus(filterStatus.filter((s) => s !== status));
                                  }
                                }}
                              />
                              <label
                                htmlFor={`status-${status}`}
                                className="text-sm cursor-pointer flex items-center gap-2"
                              >
                                <StatusBadge status={status} />
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <SheetFooter>
                    <div className="w-full space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {filteredInvoices.length} Rechnungen entsprechen Filtern
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setFilterStatus([])}
                          className="flex-1"
                        >
                          Zurücksetzen
                        </Button>
                        <Button onClick={() => setFilterSheetOpen(false)} className="flex-1">
                          Anwenden
                        </Button>
                      </div>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            {/* Right: Export, New Invoice */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportieren
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>CSV</DropdownMenuItem>
                  <DropdownMenuItem>Excel</DropdownMenuItem>
                  <DropdownMenuItem>DATEV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neue Rechnung
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="bg-accent/50 border border-accent rounded-lg p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Aktive Filter:</span>
            {filterStatus.map((status) => (
              <Badge key={status} variant="secondary" className="gap-1">
                Status: {statusConfig[status].label}
                <button
                  onClick={() => setFilterStatus(filterStatus.filter((s) => s !== status))}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setFilterStatus([])}>
              Alle Filter entfernen
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Selection Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-accent/50 border-2 border-primary rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {selectedIds.size} Rechnung{selectedIds.size !== 1 ? 'en' : ''} ausgewählt
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Mahnungen versenden
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                DATEV exportieren
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Als bezahlt markieren
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Drucken
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSelectedIds(new Set())}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {sortedInvoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {searchQuery || hasActiveFilters ? (
              <>
                <Search className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="mb-2">Keine Rechnungen gefunden</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Keine Ergebnisse für &quot;{searchQuery}&quot; mit aktiven Filtern
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setFilterStatus([])}>
                    Filter zurücksetzen
                  </Button>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Neue Suche starten
                  </Button>
                </div>
              </>
            ) : (
              <>
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="mb-2">Noch keine Rechnungen erstellt</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Erstellen Sie Ihre erste Rechnung oder importieren Sie bestehende Rechnungen
                </p>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Erste Rechnung erstellen
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Rechnungen importieren
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedIds.size === paginatedInvoices.length && paginatedInvoices.length > 0
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('invoiceNumber')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Rechnungsnr.
                      {sortColumn === 'invoiceNumber' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('customer')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Kunde
                      {sortColumn === 'customer' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('invoiceDate')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Rechnungsdatum
                      {sortColumn === 'invoiceDate' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => toggleSort('dueDate')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Fälligkeitsdatum
                      {sortColumn === 'dueDate' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button
                      onClick={() => toggleSort('amount')}
                      className="flex items-center gap-1 hover:text-primary ml-auto"
                    >
                      Betrag
                      {sortColumn === 'amount' ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Bezahlt</TableHead>
                  <TableHead>Projekt</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.map((invoice) => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    isSelected={selectedIds.has(invoice.id)}
                    onSelect={(checked) => toggleSelect(invoice.id, checked)}
                    onView={() => toast.info(`Details für ${invoice.invoiceNumber}`)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Zeige {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, sortedInvoices.length)} von {sortedInvoices.length}{' '}
                  Rechnungen
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          className="w-9"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export function InvoiceListDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Rechnungsliste (GF/BUCH-Ansicht)</CardTitle>
          <CardDescription>
            Vollständige Rechnungsliste mit GoBD-Compliance, Zahlungsstatus und Fälligkeitsverfolgung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceListView userRole="GF" />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">KPI-Karten</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Gesamtumsatz (grün)</li>
              <li>• Offene Rechnungen (amber)</li>
              <li>• Überfällig (rot)</li>
              <li>• Ø Zahlungsziel (Tage)</li>
              <li>• Icons für visuelle Hinweise</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Rechnungsnummer</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Monospace Font</li>
              <li>• Lock-Icon (finalisiert)</li>
              <li>• GoBD-Badge</li>
              <li>• Popover mit Details</li>
              <li>• Klickbar (Link zu PDF)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Status-Badges</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Entwurf (grau)</li>
              <li>• Ausstehend (amber)</li>
              <li>• Bezahlt (grün)</li>
              <li>• Überfällig (rot)</li>
              <li>• Teilweise (blau)</li>
              <li>• Storniert (grau)</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Betragsanzeige</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Deutsche Formatierung</li>
              <li>• € 63.546,00</li>
              <li>• Fett, groß (16px)</li>
              <li>• Rechtsbündig</li>
              <li>• Tooltip: Netto/MwSt.</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zeilen-Highlights</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Überfällig: Roter Hintergrund</li>
              <li>• Bezahlt: Grüner Hintergrund</li>
              <li>• Entwurf: Grauer Hintergrund</li>
              <li>• Hover: Blauer Hintergrund</li>
              <li>• Auswahl: Blau</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Zahlungsverfolgung</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Bezahlter Betrag</li>
              <li>• Zahlungsdatum</li>
              <li>• Teilzahlung: Fortschritt</li>
              <li>• Progress Bar</li>
              <li>• Mehrere Zahlungen</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}