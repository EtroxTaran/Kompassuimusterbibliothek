import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from './ui/table';
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import {
  Building2,
  MapPin,
  Star,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  MoreVertical,
  Mail,
  Trash2,
  Copy,
  Lock,
} from 'lucide-react';
import { useData, Customer } from './providers/DataProvider';

import { CustomerForm } from './CustomerFormDemo';

// Helper functions
const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' }> = {
  active: { label: 'Aktiv', variant: 'default' },
  inactive: { label: 'Inaktiv', variant: 'destructive' },
};

const ratingConfig: Record<string, { stars: number; color: string }> = {
  A: { stars: 5, color: 'text-green-600' },
  B: { stars: 3, color: 'text-amber-600' },
  C: { stars: 1, color: 'text-gray-600' },
  D: { stars: 0, color: 'text-red-600' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Heute';
  if (days === 1) return 'Gestern';
  if (days < 7) return `Vor ${days} Tagen`;
  if (days < 30) return `Vor ${Math.floor(days / 7)} Wochen`;
  if (days < 365) return `Vor ${Math.floor(days / 30)} Monaten`;
  return `Vor ${Math.floor(days / 365)} Jahren`;
}

function RatingDisplay({ rating }: { rating: string }) {
  const config = ratingConfig[rating];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={rating === 'A' ? 'default' : rating === 'B' ? 'secondary' : 'outline'}
        className={rating === 'A' ? 'bg-green-600' : rating === 'B' ? 'bg-amber-600 text-white' : ''}
      >
        {rating}
      </Badge>
      <div className="flex items-center">
        {Array.from({ length: config?.stars || 0 }).map((_, i) => (
          <Star key={i} className={`h-3 w-3 fill-current ${config?.color}`} />
        ))}
      </div>
    </div>
  );
}

function CustomerRow({
  customer,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: {
  customer: Customer;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusCfg = statusConfig[customer.status] || { label: customer.status, variant: 'secondary' };

  return (
    <TableRow className={isSelected ? 'bg-accent/30' : ''}>
      <TableCell className="w-12">
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell>
        <button
          onClick={onView}
          className="flex items-center gap-2 hover:text-primary transition-colors group text-left"
        >
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium group-hover:underline">{customer.companyName}</span>
        </button>
      </TableCell>
      <TableCell>
        <span className="font-mono text-sm">{customer.vatId}</span>
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.city}</span>
                {customer.additionalLocations && customer.additionalLocations > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +{customer.additionalLocations} weitere
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{customer.city} und {customer.additionalLocations || 0} weitere Standorte</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </TableCell>
      <TableCell>
        <RatingDisplay rating={customer.rating} />
      </TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{formatDate(customer.createdAt)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getRelativeTime(customer.createdAt)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">{customer.owner.initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{customer.owner.name.split(' ').map((n) => n[0] + '.').join(' ')}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          <CustomerForm 
            isEdit={true} 
            customTrigger={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplizieren
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                E-Mail senden
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Lock className="mr-2 h-4 w-4" />
                Deaktivieren
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Updated CustomerListView to use DataProvider
export function CustomerListView({ userRole = 'PLAN', onCustomerClick }: { userRole?: 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH', onCustomerClick?: (id: string) => void }) {
  const { customers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string[]>(['active']);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    let result = customers;
    // Mock user filter for ADM role
    if (userRole === 'ADM') {
      result = result.filter(c => c.ownerId === '1');
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.companyName.toLowerCase().includes(q) || 
        c.city.toLowerCase().includes(q)
      );
    }
    if (filterStatus.length > 0) {
      result = result.filter(c => filterStatus.includes(c.status));
    }
    return result;
  }, [customers, userRole, searchQuery, filterStatus]);

  const toggleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Kunden</h2>
          <p className="text-sm text-muted-foreground">
            {filteredCustomers.length} Kunden
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
           <div className="flex gap-4 mb-4">
             <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Suche..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
             <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Filter</SheetTitle>
                    </SheetHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <Label>Status</Label>
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="active" 
                                        checked={filterStatus.includes('active')}
                                        onCheckedChange={(checked) => {
                                            if (checked) setFilterStatus([...filterStatus, 'active']);
                                            else setFilterStatus(filterStatus.filter(s => s !== 'active'));
                                        }}
                                    />
                                    <Label htmlFor="active">Aktiv</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="inactive" 
                                        checked={filterStatus.includes('inactive')}
                                        onCheckedChange={(checked) => {
                                            if (checked) setFilterStatus([...filterStatus, 'inactive']);
                                            else setFilterStatus(filterStatus.filter(s => s !== 'inactive'));
                                        }}
                                    />
                                    <Label htmlFor="inactive">Inaktiv</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
             </Sheet>
             <CustomerForm />
           </div>

           <div className="border rounded-lg overflow-hidden">
             <Table>
               <TableBody>
                 {filteredCustomers.map(customer => (
                   <CustomerRow
                     key={customer.id}
                     customer={customer}
                     isSelected={selectedIds.has(customer.id)}
                     onSelect={(checked) => toggleSelect(customer.id, checked)}
                     onView={() => onCustomerClick && onCustomerClick(customer.id)}
                     onEdit={() => toast.info('Bearbeiten')}
                     onDelete={() => toast.info('Löschen')}
                   />
                 ))}
                 {filteredCustomers.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Keine Kunden gefunden
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CustomerListDemo({ onCustomerClick }: { onCustomerClick?: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kundenliste</CardTitle>
          <CardDescription>
            Übersicht aller Kundenkonten
          </CardDescription>
        </CardHeader>
      </Card>
      <Separator />
      <CustomerListView onCustomerClick={onCustomerClick} />
    </div>
  );
}
