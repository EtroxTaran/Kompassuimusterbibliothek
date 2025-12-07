import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Search, Download, Filter, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';

// Mock Payment Data
interface Payment {
  id: string;
  date: string;
  amount: number;
  type: 'incoming' | 'outgoing';
  reference: string;
  partner: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

const mockPayments: Payment[] = [
  { id: 'pay1', date: '2025-02-15', amount: 12500.00, type: 'incoming', reference: 'R-2025-001', partner: 'REWE München', status: 'completed', method: 'Bank Transfer' },
  { id: 'pay2', date: '2025-02-14', amount: 450.00, type: 'outgoing', reference: 'EXP-2025-089', partner: 'Deutsche Bahn', status: 'completed', method: 'Credit Card' },
  { id: 'pay3', date: '2025-02-12', amount: 2340.50, type: 'incoming', reference: 'R-2025-003', partner: 'Bäckerei Schmidt', status: 'completed', method: 'Bank Transfer' },
  { id: 'pay4', date: '2025-02-10', amount: 1200.00, type: 'outgoing', reference: 'Miete Büro', partner: 'Immobilien GmbH', status: 'pending', method: 'Direct Debit' },
  { id: 'pay5', date: '2025-02-08', amount: 5600.00, type: 'incoming', reference: 'R-2024-156', partner: 'Edeka Hamburg', status: 'completed', method: 'Bank Transfer' },
];

export function PaymentList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = mockPayments.filter(p => 
    p.partner.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Zahlungen</h2>
          <p className="text-muted-foreground">Übersicht aller Ein- und Ausgänge</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Einnahmen (Feb)</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+20.440,50 €</div>
            <p className="text-xs text-muted-foreground">+12% gegenüber Vormonat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausgaben (Feb)</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-1.650,00 €</div>
            <p className="text-xs text-muted-foreground">-5% gegenüber Vormonat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offen</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">1.200,00 €</div>
            <p className="text-xs text-muted-foreground">1 Zahlung ausstehend</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaktionen</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Suchen..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Referenz</TableHead>
                <TableHead>Methode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="font-medium">{payment.partner}</TableCell>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'completed' ? 'outline' : 'secondary'} className={
                      payment.status === 'completed' ? 'text-green-600 border-green-200 bg-green-50' : 
                      payment.status === 'pending' ? 'text-amber-600 border-amber-200 bg-amber-50' : ''
                    }>
                      {payment.status === 'completed' ? 'Abgeschlossen' : 'Ausstehend'}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${payment.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                    {payment.type === 'incoming' ? '+' : '-'}{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(payment.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
