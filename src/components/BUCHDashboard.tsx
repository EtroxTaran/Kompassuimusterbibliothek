import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  FileText,
  Download,
  Euro,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lock,
  Unlock,
  Mail,
  CreditCard,
  Eye,
  Calendar,
  Search,
  Filter,
  Plus,
  Shield,
  Clock,
  FileBarChart,
  Receipt,
  Send,
  ChevronDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Invoice type
interface Invoice {
  id: string;
  number: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  isFinalized: boolean;
  daysOverdue?: number;
}

// Task type
interface RecurringTask {
  id: string;
  description: string;
  dueDate: string;
  completed: boolean;
  isOverdue: boolean;
}

// Audit trail entry
interface AuditEntry {
  id: string;
  date: string;
  time: string;
  user: string;
  document: string;
  action: string;
  reason?: string;
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'R-2024-00456',
    customerName: 'Hofladen Müller GmbH',
    date: '2024-11-15',
    dueDate: '2024-12-15',
    amount: 63046,
    status: 'pending',
    isFinalized: true,
  },
  {
    id: '2',
    number: 'R-2024-00345',
    customerName: 'REWE München Süd',
    date: '2024-10-25',
    dueDate: '2024-10-31',
    amount: 12500,
    status: 'overdue',
    isFinalized: true,
    daysOverdue: 15,
  },
  {
    id: '3',
    number: 'R-2024-00423',
    customerName: 'Bäckerei Schmidt',
    date: '2024-11-10',
    dueDate: '2024-12-10',
    amount: 8900,
    status: 'pending',
    isFinalized: true,
  },
  {
    id: '4',
    number: 'R-2024-00398',
    customerName: 'Café Müller',
    date: '2024-10-20',
    dueDate: '2024-11-05',
    amount: 5600,
    status: 'overdue',
    isFinalized: true,
    daysOverdue: 10,
  },
  {
    id: '5',
    number: 'R-2024-00467',
    customerName: 'Restaurant Da Vinci',
    date: '2024-11-18',
    dueDate: '2024-12-18',
    amount: 28500,
    status: 'pending',
    isFinalized: true,
  },
];

const mockTasks: RecurringTask[] = [
  {
    id: '1',
    description: 'Umsatzsteuer-Voranmeldung Q4',
    dueDate: '2024-11-30',
    completed: false,
    isOverdue: false,
  },
  {
    id: '2',
    description: 'Monatsabschluss November',
    dueDate: '2024-12-05',
    completed: false,
    isOverdue: false,
  },
  {
    id: '3',
    description: 'Zahlungserinnerungen versenden',
    dueDate: '2024-11-15',
    completed: true,
    isOverdue: false,
  },
  {
    id: '4',
    description: 'DATEV-Datensicherung Oktober',
    dueDate: '2024-11-10',
    completed: false,
    isOverdue: true,
  },
];

const mockAuditTrail: AuditEntry[] = [
  {
    id: '1',
    date: '15.11.24',
    time: '16:45',
    user: 'Anna Weber',
    document: 'R-2024-00456',
    action: 'Finalisiert',
  },
  {
    id: '2',
    date: '15.11.24',
    time: '14:30',
    user: 'Anna Weber',
    document: 'R-2024-00455',
    action: 'Zahlung gebucht',
  },
  {
    id: '3',
    date: '14.11.24',
    time: '11:20',
    user: 'Thomas Fischer',
    document: 'R-2024-00450',
    action: 'Finalisiert',
  },
];

// Cash flow data (last 12 months)
const cashFlowData = [
  { month: 'Dez 23', income: 180000, expenses: 150000, net: 30000 },
  { month: 'Jan 24', income: 220000, expenses: 180000, net: 40000 },
  { month: 'Feb 24', income: 195000, expenses: 170000, net: 25000 },
  { month: 'Mär 24', income: 240000, expenses: 190000, net: 50000 },
  { month: 'Apr 24', income: 210000, expenses: 175000, net: 35000 },
  { month: 'Mai 24', income: 265000, expenses: 200000, net: 65000 },
  { month: 'Jun 24', income: 280000, expenses: 210000, net: 70000 },
  { month: 'Jul 24', income: 245000, expenses: 195000, net: 50000 },
  { month: 'Aug 24', income: 230000, expenses: 185000, net: 45000 },
  { month: 'Sep 24', income: 275000, expenses: 205000, net: 70000 },
  { month: 'Okt 24', income: 290000, expenses: 215000, net: 75000 },
  { month: 'Nov 24', income: 310000, expenses: 225000, net: 85000 },
];

// Revenue vs. costs (quarterly)
const quarterlyData = [
  { quarter: 'Q1 2024', revenue: 655000, costs: 540000, profit: 115000 },
  { quarter: 'Q2 2024', revenue: 755000, costs: 585000, profit: 170000 },
  { quarter: 'Q3 2024', revenue: 750000, costs: 585000, profit: 165000 },
  { quarter: 'Q4 2024', revenue: 850000, costs: 650000, profit: 200000 },
];

// Payment due timeline data
const paymentTimelineData = [
  { period: 'Überfällig', amount: 85000, color: '#ef4444' },
  { period: 'Diese Woche', amount: 120000, color: '#f59e0b' },
  { period: 'Nächste 30 Tage', amount: 215000, color: '#3b82f6' },
  { period: 'Später', amount: 150000, color: '#94a3b8' },
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
  return new Date(dateString).toLocaleDateString('de-DE');
}

// BUCH Dashboard
export function BUCHDashboard() {
  const [period, setPeriod] = useState('quarter');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);

  const userName = 'Anna Weber';
  const userRole = 'BUCH';

  // KPI calculations
  const outstandingAmount = mockInvoices
    .filter((inv) => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const outstandingCount = mockInvoices.filter(
    (inv) => inv.status === 'pending' || inv.status === 'overdue'
  ).length;
  const overdueAmount = mockInvoices
    .filter((inv) => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = mockInvoices.filter((inv) => inv.status === 'overdue').length;

  const liquidity = 850000;
  const monthIncome = 310000;
  const monthExpenses = 225000;

  const invoicesCreated = 64;
  const invoicesPaid = 48;
  const invoicesPending = 16;

  const gobdCompliance = 100;
  const lastAudit = '15.10.2024';
  const nextAudit = '15.01.2025';

  const finalizedInvoices = 452;
  const totalInvoices = 452;
  const auditLogEntries = 124;
  const lastBackup = 'Vor 2 Stunden';

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success('Aufgabe aktualisiert');
  };

  const handleExport = (format: string) => {
    toast.success(`Export wird vorbereitet`, {
      description: `${format}-Datei wird heruntergeladen...`,
    });
  };

  const handleBookPayment = () => {
    toast.success('Zahlung gebucht', {
      description: 'Die Zahlung wurde erfolgreich erfasst',
    });
    setShowPaymentDialog(false);
  };

  const handleSendReminder = () => {
    toast.success('Mahnung versendet', {
      description: 'Zahlungserinnerung wurde an den Kunden gesendet',
    });
    setShowReminderDialog(false);
  };

  const handleCreateReport = (reportName: string) => {
    toast.info(`${reportName} wird erstellt`, {
      description: 'Der Bericht wird generiert...',
    });
  };

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const overdueInvoices = mockInvoices.filter((inv) => inv.status === 'overdue');

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Entwurf</Badge>;
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
            Ausstehend
          </Badge>
        );
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400">
            Bezahlt
          </Badge>
        );
      case 'overdue':
        return <Badge variant="destructive">Überfällig</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-2">Finanzen & Buchhaltung</h1>
              <div className="flex items-center gap-3">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarter">Dieses Quartal</SelectItem>
                    <SelectItem value="year">Dieses Jahr</SelectItem>
                    <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('PDF')}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF Export
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('CSV')}>
                    <FileBarChart className="mr-2 h-4 w-4" />
                    CSV Export
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('DATEV')}>
                    <Receipt className="mr-2 h-4 w-4" />
                    DATEV Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Avatar className="h-10 w-10">
                <AvatarFallback>AW</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-muted-foreground">({userRole})</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Outstanding Receivables */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                    <Euro className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Offene Forderungen</p>
                <p className="text-4xl font-bold text-amber-600 mb-2">
                  {formatCurrency(outstandingAmount)}
                </p>
                <p className="text-muted-foreground mb-2">{outstandingCount} Rechnungen</p>
                <Badge variant="destructive" className="text-xs">
                  {formatCurrency(overdueAmount)} ({overdueCount}) überfällig
                </Badge>
              </CardContent>
            </Card>

            {/* Liquidity */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Liquidität</p>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {formatCurrency(liquidity)}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">
                      Einnahmen: {formatCurrency(monthIncome)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">Ausgaben: {formatCurrency(monthExpenses)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices This Quarter */}
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-accent/60 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Rechnungen (Q4)</p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{invoicesCreated}</p>
                    <p className="text-muted-foreground">Erstellt</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{invoicesPaid}</p>
                    <p className="text-muted-foreground">Bezahlt</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{invoicesPending}</p>
                    <p className="text-muted-foreground">Offen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GoBD Status */}
            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">GoBD-Status</p>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-3xl font-bold text-green-600">{gobdCompliance}%</p>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <p>Letzte Prüfung: {lastAudit}</p>
                  <p>Nächste: {nextAudit}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Zahlungsübersicht
              </CardTitle>
              <CardDescription>Fälligkeiten und offene Beträge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Timeline Chart */}
              <div>
                <h3 className="mb-4">Fälligkeiten Timeline</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={paymentTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#3b82f6">
                      {paymentTimelineData.map((entry, index) => (
                        <Bar key={`bar-${index}`} dataKey="amount" fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Overdue Invoices Alert */}
              {overdueInvoices.length > 0 && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Überfällige Rechnungen
                  </h3>
                  <div className="space-y-3">
                    {overdueInvoices.map((invoice) => (
                      <Alert key={invoice.id} variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="flex items-center justify-between">
                          <span>
                            {invoice.number} - {invoice.customerName}
                          </span>
                          <span className="font-bold">{formatCurrency(invoice.amount)}</span>
                        </AlertTitle>
                        <AlertDescription>
                          <div className="flex items-center justify-between mt-2">
                            <span>{invoice.daysOverdue} Tage überfällig</span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowReminderDialog(true)}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Mahnung
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPaymentDialog(true)}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Zahlung
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="mr-2 h-4 w-4" />
                                Kontakt
                              </Button>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Rechnungen</CardTitle>
                  <CardDescription>{filteredInvoices.length} Rechnungen</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Suche..."
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
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="paid">Bezahlt</SelectItem>
                      <SelectItem value="overdue">Überfällig</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Rechnung
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left">Rechnungsnr.</th>
                      <th className="px-4 py-3 text-left">Kunde</th>
                      <th className="px-4 py-3 text-left">Datum</th>
                      <th className="px-4 py-3 text-left">Fälligkeit</th>
                      <th className="px-4 py-3 text-right">Betrag</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">GoBD</th>
                      <th className="px-4 py-3 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-border hover:bg-accent">
                        <td className="px-4 py-3 font-mono">{invoice.number}</td>
                        <td className="px-4 py-3">{invoice.customerName}</td>
                        <td className="px-4 py-3">{formatDate(invoice.date)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              invoice.status === 'overdue' ? 'text-red-600 font-semibold' : ''
                            }
                          >
                            {formatDate(invoice.dueDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">{getStatusBadge(invoice.status)}</td>
                        <td className="px-4 py-3 text-center">
                          {invoice.isFinalized ? (
                            <Lock className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <Unlock className="h-4 w-4 text-muted-foreground mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            {invoice.status !== 'paid' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPaymentDialog(true)}
                              >
                                <CreditCard className="h-4 w-4" />
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

          {/* Cash Flow Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cashflow-Analyse</CardTitle>
                <CardDescription>Letzte 12 Monate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Einnahmen"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      name="Ausgaben"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quarterly Revenue vs Costs */}
            <Card>
              <CardHeader>
                <CardTitle>Umsatz vs. Kosten</CardTitle>
                <CardDescription>Quartalsübersicht 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Umsatz" />
                    <Bar dataKey="costs" fill="#ef4444" name="Kosten" />
                    <Bar dataKey="profit" fill="#10b981" name="Gewinn" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* GoBD Compliance Dashboard */}
          <Card className="border-2 border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <CardTitle>GoBD-Compliance</CardTitle>
              </div>
              <CardDescription>Konformität und Prüfprotokolle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-medium">Finalisierte Rechnungen</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {finalizedInvoices}/{totalInvoices}
                  </p>
                  <p className="text-muted-foreground">100%</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <p className="font-medium">Hash-Integrität</p>
                  </div>
                  <p className="text-green-600 font-semibold">✓ Alle Hashes gültig</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <p className="font-medium">Änderungsprotokolle</p>
                  </div>
                  <p className="text-2xl font-bold">{auditLogEntries}</p>
                  <p className="text-muted-foreground">Einträge</p>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <p className="font-medium">Backups</p>
                  </div>
                  <p className="text-green-600 font-semibold">{lastBackup}</p>
                </div>
              </div>

              <Separator />

              {/* Audit Trail */}
              <div>
                <h3 className="mb-3">Audit Trail (Letzte Änderungen)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/30">
                      <tr>
                        <th className="px-4 py-3 text-left">Datum</th>
                        <th className="px-4 py-3 text-left">Uhrzeit</th>
                        <th className="px-4 py-3 text-left">Benutzer</th>
                        <th className="px-4 py-3 text-left">Dokument</th>
                        <th className="px-4 py-3 text-left">Aktion</th>
                        <th className="px-4 py-3 text-left">Grund</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAuditTrail.map((entry) => (
                        <tr key={entry.id} className="border-b border-border">
                          <td className="px-4 py-3">{entry.date}</td>
                          <td className="px-4 py-3">{entry.time}</td>
                          <td className="px-4 py-3">{entry.user}</td>
                          <td className="px-4 py-3 font-mono">{entry.document}</td>
                          <td className="px-4 py-3">{entry.action}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {entry.reason || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              {/* GoBD Reports */}
              <div>
                <h3 className="mb-3">GoBD-Berichte</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Jahresabschluss 2024
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileBarChart className="mr-2 h-4 w-4" />
                    Quartalsberichte
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Prüfprotokoll
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recurring Tasks & Financial Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recurring Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Wiederkehrende Aufgaben</CardTitle>
                <CardDescription>
                  {tasks.filter((t) => !t.completed).length} offene Aufgaben
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start gap-3 p-3 border border-border rounded-lg ${
                        task.isOverdue
                          ? 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900'
                          : ''
                      } ${task.completed ? 'opacity-50' : ''}`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            task.isOverdue ? 'text-red-600' : ''
                          } ${task.completed ? 'line-through' : ''}`}
                        >
                          {task.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Fällig: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                      {task.isOverdue && !task.completed && (
                        <Badge variant="destructive">Überfällig</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Finanzberichte</CardTitle>
                <CardDescription>Schnellzugriff auf Berichte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-accent/60 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Gewinn & Verlust</p>
                          <p className="text-muted-foreground">GuV-Rechnung</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateReport('Gewinn & Verlust')}
                      >
                        Erstellen
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-950/20 flex items-center justify-center">
                          <FileBarChart className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Bilanz</p>
                          <p className="text-muted-foreground">Vermögensübersicht</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateReport('Bilanz')}
                      >
                        Erstellen
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-purple-100 dark:bg-purple-950/20 flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Umsatzsteuer</p>
                          <p className="text-muted-foreground">UStVA</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateReport('Umsatzsteuer')}
                      >
                        Erstellen
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-amber-100 dark:bg-amber-950/20 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">DATEV-Export</p>
                          <p className="text-muted-foreground">Buchhaltungsdaten</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateReport('DATEV-Export')}
                      >
                        Exportieren
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Rechnung erstellen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowPaymentDialog(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Zahlung buchen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowReminderDialog(true)}>
              <Send className="mr-2 h-4 w-4" />
              Mahnung senden
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileBarChart className="mr-2 h-4 w-4" />
              Bericht erstellen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('DATEV')}>
              <Download className="mr-2 h-4 w-4" />
              DATEV exportieren
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zahlung buchen</DialogTitle>
            <DialogDescription>Erfassen Sie eine Zahlung für eine Rechnung</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Betrag</Label>
              <Input type="number" placeholder="0,00 €" />
            </div>
            <div>
              <Label>Zahlungsmethode</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Banküberweisung</SelectItem>
                  <SelectItem value="cash">Barzahlung</SelectItem>
                  <SelectItem value="card">Kartenzahlung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleBookPayment}>
              <CreditCard className="mr-2 h-4 w-4" />
              Zahlung buchen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mahnung senden</DialogTitle>
            <DialogDescription>Zahlungserinnerung an Kunde senden</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Mahnung wird versendet</AlertTitle>
              <AlertDescription>
                Der Kunde erhält eine Zahlungserinnerung per E-Mail.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSendReminder}>
              <Send className="mr-2 h-4 w-4" />
              Mahnung senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Demo wrapper
export function BUCHDashboardDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BUCH Dashboard (Buchhaltung)</CardTitle>
          <CardDescription>
            Finanzdashboard für Buchhaltung mit Rechnungsmanagement, Zahlungsverfolgung und
            GoBD-Compliance
          </CardDescription>
        </CardHeader>
      </Card>

      <Separator />

      <BUCHDashboard />
    </div>
  );
}