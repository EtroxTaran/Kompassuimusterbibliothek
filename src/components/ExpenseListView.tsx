import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import {
  Image as ImageIcon,
  Filter,
  Plus,
  Check,
  X,
  Download,
  Maximize2,
  FileText,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
  Upload,
} from 'lucide-react';

// Types
export type ExpenseStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type ExpenseCategory = 'meals' | 'fuel' | 'hotel' | 'parking' | 'entertainment' | 'other';
export type UserRole = 'ADM' | 'INNEN' | 'GF' | 'BUCH';

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  projectName?: string;
  status: ExpenseStatus;
  hasReceipt: boolean;
  receiptUrl?: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  isOverLimit?: boolean;
  attendees?: string[];
  purpose?: string;
}

// Mock Data
export const mockExpenses: Expense[] = [
  {
    id: 'exp1',
    employeeId: 'emp1',
    employeeName: 'Michael Schmidt',
    date: '2025-02-06',
    category: 'meals',
    amount: 23.50,
    description: 'Mittagessen Hofladen Müller',
    projectName: 'München Nord Tour',
    status: 'pending',
    hasReceipt: true,
    receiptUrl: '/receipts/exp1.jpg',
    createdAt: '2025-02-06T12:30:00',
  },
  {
    id: 'exp2',
    employeeId: 'emp1',
    employeeName: 'Michael Schmidt',
    date: '2025-02-06',
    category: 'fuel',
    amount: 67.80,
    description: 'Tankstelle Esso A9',
    projectName: 'München Nord Tour',
    status: 'pending',
    hasReceipt: true,
    receiptUrl: '/receipts/exp2.jpg',
    createdAt: '2025-02-06T10:15:00',
  },
  {
    id: 'exp3',
    employeeId: 'emp2',
    employeeName: 'Anna Weber',
    date: '2025-02-05',
    category: 'hotel',
    amount: 125.00,
    description: 'Hotel Zur Post, Augsburg',
    projectName: '2-Tages Projekttour',
    status: 'pending',
    hasReceipt: true,
    receiptUrl: '/receipts/exp3.jpg',
    createdAt: '2025-02-05T18:00:00',
    isOverLimit: true,
  },
  {
    id: 'exp4',
    employeeId: 'emp1',
    employeeName: 'Michael Schmidt',
    date: '2025-02-04',
    category: 'parking',
    amount: 12.00,
    description: 'Parkhaus Marienplatz',
    status: 'approved',
    hasReceipt: true,
    receiptUrl: '/receipts/exp4.jpg',
    createdAt: '2025-02-04T15:00:00',
    approvedBy: 'Thomas Buch',
    approvedAt: '2025-02-05T09:00:00',
  },
  {
    id: 'exp5',
    employeeId: 'emp1',
    employeeName: 'Michael Schmidt',
    date: '2025-02-03',
    category: 'entertainment',
    amount: 156.00,
    description: 'Restaurant Augustiner',
    status: 'rejected',
    hasReceipt: false,
    createdAt: '2025-02-03T20:00:00',
    rejectionReason: 'Fehlende Teilnehmerliste',
    attendees: ['Maria Schmidt', 'Thomas Weber'],
    purpose: 'Vertragsverhandlung',
  },
];

// Category Labels
export const categoryLabels: Record<ExpenseCategory, string> = {
  meals: 'Verpflegung',
  fuel: 'Benzin',
  hotel: 'Hotel',
  parking: 'Parken',
  entertainment: 'Bewirtung',
  other: 'Sonstige',
};

// Status Badge Component
export function ExpenseStatusBadge({ status }: { status: ExpenseStatus }) {
  const config = {
    draft: { 
      label: 'Entwurf', 
      icon: FileEdit,
      className: 'bg-gray-100 text-gray-700 border-gray-300'
    },
    pending: { 
      label: 'Ausstehend', 
      icon: Clock,
      className: 'bg-blue-50 text-blue-700 border-blue-300'
    },
    approved: { 
      label: 'Genehmigt', 
      icon: CheckCircle,
      className: 'bg-green-50 text-green-700 border-green-300'
    },
    rejected: { 
      label: 'Abgelehnt', 
      icon: XCircle,
      className: 'bg-red-50 text-red-700 border-red-300'
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

// Receipt Preview Component
export function ReceiptPreview({ expense }: { expense: Expense }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="h-3 w-3 mr-1" />
          Beleg ansehen
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              Beleg
            </h4>
          </div>

          {/* Receipt Image Placeholder */}
          <div className="w-full h-48 rounded-lg border bg-muted flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Belegvorschau</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <p className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
              {expense.description}
            </p>
            <p className="text-sm text-muted-foreground">
              €{expense.amount.toFixed(2)} • {new Date(expense.date).toLocaleDateString('de-DE')}
            </p>

            {expense.attendees && expense.attendees.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Bewirtung mit:</p>
                <ul className="text-xs space-y-0.5">
                  {expense.attendees.map((attendee, idx) => (
                    <li key={idx}>- {attendee} (Kunde)</li>
                  ))}
                </ul>
              </div>
            )}

            {expense.purpose && (
              <div>
                <p className="text-xs text-muted-foreground">Anlass:</p>
                <p className="text-xs">{expense.purpose}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Maximize2 className="h-3 w-3 mr-1" />
              Vollbild
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Filter Panel Component
export interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterPanel({ open, onOpenChange }: FilterPanelProps) {
  const [period, setPeriod] = useState('current_month');
  const [employees, setEmployees] = useState<string[]>(['all']);
  const [categories, setCategories] = useState<string[]>(['meals', 'fuel', 'hotel', 'parking', 'entertainment', 'other']);
  const [statuses, setStatuses] = useState<string[]>(['pending']);
  const [minAmount, setMinAmount] = useState('0');
  const [maxAmount, setMaxAmount] = useState('500');

  const handleReset = () => {
    setPeriod('current_month');
    setEmployees(['all']);
    setCategories(['meals', 'fuel', 'hotel', 'parking', 'entertainment', 'other']);
    setStatuses(['pending']);
    setMinAmount('0');
    setMaxAmount('500');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {/* Period */}
            <div className="space-y-2">
              <Label>Zeitraum</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">Diesen Monat</SelectItem>
                  <SelectItem value="last_month">Letzten Monat</SelectItem>
                  <SelectItem value="current_quarter">Dieses Quartal</SelectItem>
                  <SelectItem value="current_year">Dieses Jahr</SelectItem>
                  <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employees */}
            <div className="space-y-2">
              <Label>Mitarbeiter</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emp-all"
                    checked={employees.includes('all')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEmployees(['all']);
                      }
                    }}
                  />
                  <Label htmlFor="emp-all" className="text-sm">Alle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emp-1"
                    checked={employees.includes('emp1')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEmployees((prev) => prev.filter((e) => e !== 'all').concat('emp1'));
                      } else {
                        setEmployees((prev) => prev.filter((e) => e !== 'emp1'));
                      }
                    }}
                  />
                  <Label htmlFor="emp-1" className="text-sm">Michael Schmidt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emp-2"
                    checked={employees.includes('emp2')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEmployees((prev) => prev.filter((e) => e !== 'all').concat('emp2'));
                      } else {
                        setEmployees((prev) => prev.filter((e) => e !== 'emp2'));
                      }
                    }}
                  />
                  <Label htmlFor="emp-2" className="text-sm">Anna Weber</Label>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <div className="space-y-2">
                {(Object.keys(categoryLabels) as ExpenseCategory[]).map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat}`}
                      checked={categories.includes(cat)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCategories((prev) => [...prev, cat]);
                        } else {
                          setCategories((prev) => prev.filter((c) => c !== cat));
                        }
                      }}
                    />
                    <Label htmlFor={`cat-${cat}`} className="text-sm">
                      {categoryLabels[cat]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-pending"
                    checked={statuses.includes('pending')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatuses((prev) => [...prev, 'pending']);
                      } else {
                        setStatuses((prev) => prev.filter((s) => s !== 'pending'));
                      }
                    }}
                  />
                  <Label htmlFor="status-pending" className="text-sm">Ausstehend</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-approved"
                    checked={statuses.includes('approved')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatuses((prev) => [...prev, 'approved']);
                      } else {
                        setStatuses((prev) => prev.filter((s) => s !== 'approved'));
                      }
                    }}
                  />
                  <Label htmlFor="status-approved" className="text-sm">Genehmigt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status-rejected"
                    checked={statuses.includes('rejected')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatuses((prev) => [...prev, 'rejected']);
                      } else {
                        setStatuses((prev) => prev.filter((s) => s !== 'rejected'));
                      }
                    }}
                  />
                  <Label htmlFor="status-rejected" className="text-sm">Abgelehnt</Label>
                </div>
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <Label>Betrag</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="min-amount" className="text-xs text-muted-foreground">Von:</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="€ 0"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max-amount" className="text-xs text-muted-foreground">Bis:</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="€ 500"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Zurücksetzen
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Anwenden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export Dialog Component
export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [format, setFormat] = useState<'datev' | 'excel' | 'csv'>('datev');
  const [period, setPeriod] = useState('january_2025');
  const [onlyApproved, setOnlyApproved] = useState(true);
  const [includeReceipts, setIncludeReceipts] = useState(true);

  const handleExport = () => {
    toast.success('Export wird erstellt...', {
      description: `Format: ${format.toUpperCase()} | Zeitraum: ${period}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ausgaben exportieren</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Format */}
          <div className="space-y-3">
            <Label>Format</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-datev"
                  checked={format === 'datev'}
                  onChange={() => setFormat('datev')}
                  className="h-4 w-4"
                />
                <Label htmlFor="format-datev" className="text-sm cursor-pointer">
                  DATEV (Standard)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-excel"
                  checked={format === 'excel'}
                  onChange={() => setFormat('excel')}
                  className="h-4 w-4"
                />
                <Label htmlFor="format-excel" className="text-sm cursor-pointer">
                  Excel (.xlsx)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="format-csv"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="h-4 w-4"
                />
                <Label htmlFor="format-csv" className="text-sm cursor-pointer">
                  CSV
                </Label>
              </div>
            </div>
          </div>

          {/* Period */}
          <div className="space-y-2">
            <Label>Zeitraum</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january_2025">Januar 2025</SelectItem>
                <SelectItem value="february_2025">Februar 2025</SelectItem>
                <SelectItem value="q1_2025">Q1 2025</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-approved"
                checked={onlyApproved}
                onCheckedChange={(checked) => setOnlyApproved(!!checked)}
              />
              <Label htmlFor="only-approved" className="text-sm">
                Nur genehmigte Ausgaben
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-receipts"
                checked={includeReceipts}
                onCheckedChange={(checked) => setIncludeReceipts(!!checked)}
              />
              <Label htmlFor="include-receipts" className="text-sm">
                Belege als ZIP anhängen
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Expense Row Component (BUCH View)
export interface ExpenseRowProps {
  expense: Expense;
  selected: boolean;
  onSelect: (selected: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
  role: UserRole;
}

export function ExpenseRow({ expense, selected, onSelect, onApprove, onReject, role }: ExpenseRowProps) {
  const isBuch = role === 'BUCH' || role === 'GF';

  return (
    <div className="border rounded-lg p-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start gap-3">
        {/* Checkbox (BUCH only) */}
        {isBuch && expense.status === 'pending' && (
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
            className="mt-1"
          />
        )}

        {/* Receipt Thumbnail */}
        <div className="flex-shrink-0 w-12 h-12 rounded border bg-muted flex items-center justify-center" style={{ borderColor: 'var(--border)' }}>
          {expense.hasReceipt ? (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          ) : (
            <FileText className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                  {expense.employeeName}
                </p>
                <span className="text-sm text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString('de-DE')}
                </span>
                <Badge variant="outline" className="text-xs">
                  {categoryLabels[expense.category]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{expense.description}</p>
              {expense.projectName && (
                <p className="text-xs text-muted-foreground mt-1">{expense.projectName}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                €{expense.amount.toFixed(2)}
              </p>
              {!isBuch && <ExpenseStatusBadge status={expense.status} />}
            </div>
          </div>

          {/* Warnings */}
          {expense.isOverLimit && (
            <div className="flex items-center gap-1.5 text-sm text-orange-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Über Tageslimit (€100)</span>
            </div>
          )}

          {expense.status === 'rejected' && expense.rejectionReason && (
            <div className="flex items-center gap-1.5 text-sm text-red-600">
              <XCircle className="h-3.5 w-3.5" />
              <span>{expense.rejectionReason}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {expense.hasReceipt && <ReceiptPreview expense={expense} />}
            
            {isBuch && expense.status === 'pending' && (
              <>
                <Button onClick={onApprove} size="sm" variant="default">
                  <Check className="h-3 w-3 mr-1" />
                  Genehmigen
                </Button>
                <Button onClick={onReject} size="sm" variant="outline">
                  <X className="h-3 w-3 mr-1" />
                  Ablehnen
                </Button>
              </>
            )}

            {!isBuch && expense.status === 'rejected' && (
              <Button size="sm" variant="outline">
                <FileEdit className="h-3 w-3 mr-1" />
                Bearbeiten und erneut einreichen
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Expense List View
export interface ExpenseListViewProps {
  role?: UserRole;
}

export function ExpenseListView({ role = 'BUCH' }: ExpenseListViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const isBuch = role === 'BUCH' || role === 'GF';

  // Filter expenses by tab
  const filteredExpenses = mockExpenses.filter((exp) => {
    if (activeTab === 'all') return true;
    return exp.status === activeTab;
  });

  const pendingExpenses = mockExpenses.filter((exp) => exp.status === 'pending');
  const thisMonthExpenses = mockExpenses.filter((exp) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  const approvedExpenses = mockExpenses.filter((exp) => exp.status === 'approved');

  // Calculations
  const pendingTotal = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const selectedTotal = filteredExpenses
    .filter((exp) => selectedExpenses.includes(exp.id))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const handleSelectAll = () => {
    if (selectedExpenses.length === filteredExpenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(filteredExpenses.map((exp) => exp.id));
    }
  };

  const handleApprove = (expenseId: string) => {
    const expense = mockExpenses.find((e) => e.id === expenseId);
    toast.success('Ausgabe genehmigt', {
      description: `${expense?.description} - €${expense?.amount.toFixed(2)}`,
    });
    setSelectedExpenses((prev) => prev.filter((id) => id !== expenseId));
  };

  const handleReject = (expenseId: string) => {
    const expense = mockExpenses.find((e) => e.id === expenseId);
    toast.error('Ausgabe abgelehnt', {
      description: `${expense?.description} - €${expense?.amount.toFixed(2)}`,
    });
    setSelectedExpenses((prev) => prev.filter((id) => id !== expenseId));
  };

  const handleBulkApprove = () => {
    toast.success(`${selectedExpenses.length} Ausgaben genehmigt`, {
      description: `Gesamtbetrag: €${selectedTotal.toFixed(2)}`,
    });
    setSelectedExpenses([]);
  };

  const handleBulkReject = () => {
    toast.error(`${selectedExpenses.length} Ausgaben abgelehnt`);
    setSelectedExpenses([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2>Ausgabenübersicht</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilterPanel(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ausgabe
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="all">Alle</TabsTrigger>
          <TabsTrigger value="pending">
            Offen
            {pendingExpenses.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingExpenses.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Genehmigt</TabsTrigger>
          <TabsTrigger value="rejected">Abgelehnt</TabsTrigger>
        </TabsList>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Offen</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                €{pendingTotal.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingExpenses.length} Belege
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Diesen Monat</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                €{thisMonthTotal.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {thisMonthExpenses.length} Belege
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Ø Bearbeitungszeit</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                1,5 Tage
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Letzte 30 Tage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm text-muted-foreground">Export bereit</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                {approvedExpenses.length}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="h-3 w-3 mr-1" />
                DATEV Export
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* List Content */}
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm" style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                    {activeTab === 'pending' && 'Zur Genehmigung'}
                    {activeTab === 'approved' && 'Genehmigte Ausgaben'}
                    {activeTab === 'rejected' && 'Abgelehnte Ausgaben'}
                    {activeTab === 'all' && 'Alle Ausgaben'}
                  </h3>
                  <Badge variant="secondary">
                    {filteredExpenses.length}
                  </Badge>
                </div>
                {isBuch && activeTab === 'pending' && filteredExpenses.length > 0 && (
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedExpenses.length === filteredExpenses.length
                      ? 'Auswahl aufheben'
                      : 'Alle auswählen'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Keine Ausgaben gefunden</p>
                  </div>
                ) : (
                  filteredExpenses.map((expense) => (
                    <ExpenseRow
                      key={expense.id}
                      expense={expense}
                      selected={selectedExpenses.includes(expense.id)}
                      onSelect={(checked) => {
                        if (checked) {
                          setSelectedExpenses((prev) => [...prev, expense.id]);
                        } else {
                          setSelectedExpenses((prev) => prev.filter((id) => id !== expense.id));
                        }
                      }}
                      onApprove={() => handleApprove(expense.id)}
                      onReject={() => handleReject(expense.id)}
                      role={role}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions Bar */}
          {selectedExpenses.length > 0 && isBuch && (
            <Card className="mt-4 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
                      {selectedExpenses.length} Ausgaben ausgewählt (€{selectedTotal.toFixed(2)})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleBulkApprove} size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Alle genehmigen
                    </Button>
                    <Button onClick={handleBulkReject} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Alle ablehnen
                    </Button>
                    <Button
                      onClick={() => setShowExportDialog(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Als Report exportieren
                    </Button>
                    <Button
                      onClick={() => setSelectedExpenses([])}
                      variant="ghost"
                      size="sm"
                    >
                      Auswahl aufheben
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Filter Panel */}
      <FilterPanel open={showFilterPanel} onOpenChange={setShowFilterPanel} />

      {/* Export Dialog */}
      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
    </div>
  );
}

// Demo Component
export function ExpenseListViewDemo() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('BUCH');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Ausgabenübersicht</h2>
        <p className="text-sm text-muted-foreground">
          Umfassende Ausgabenliste mit Genehmigungsworkflow, Filteroptionen und
          Buchhaltungsexport-Funktionen für verschiedene Benutzerrollen
        </p>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <h3>Rollenansicht</h3>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={selectedRole === 'BUCH' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('BUCH')}
            >
              BUCH (Buchhaltung)
            </Button>
            <Button
              variant={selectedRole === 'ADM' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('ADM')}
            >
              ADM (Mitarbeiter)
            </Button>
            <Button
              variant={selectedRole === 'GF' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('GF')}
            >
              GF (Geschäftsführung)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main List View */}
      <ExpenseListView role={selectedRole} />

      {/* Features */}
      <Card>
        <CardHeader>
          <h3>Features & Funktionen</h3>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Status-Tabs:</strong> Alle, Offen, Genehmigt, Abgelehnt
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Summary Cards:</strong> Offene Ausgaben, Monatssumme, Ø Bearbeitungszeit, Export-Status
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Belegvorschau:</strong> Popover mit Beleg-Details und Download-Option
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Genehmigungsaktionen:</strong> Einzeln oder als Massenoperation
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Filter:</strong> Zeitraum, Mitarbeiter, Kategorie, Status, Betragsspanne
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Export:</strong> DATEV, Excel, CSV mit optionalen Belegen
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Warnungen:</strong> Über Limit, fehlende Angaben, Ablehnungsgründe
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
            <div>
              <strong>Rollenbasiert:</strong> Unterschiedliche Ansichten für BUCH, ADM, GF
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
