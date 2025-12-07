import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
import { Search, Plus, Filter, Clock } from 'lucide-react';
import { TimeEntryFormDemo } from './TimeEntryForm';

// Mock Time Data
interface TimeLog {
  id: string;
  date: string;
  project: string;
  task: string;
  duration: number;
  user: string;
  billable: boolean;
  status: 'submitted' | 'approved' | 'draft';
}

const mockLogs: TimeLog[] = [
  { id: 'log1', date: '2025-02-15', project: 'P-2025-A001', task: 'Frontend Entwicklung', duration: 4.5, user: 'Michael Schmidt', billable: true, status: 'submitted' },
  { id: 'log2', date: '2025-02-15', project: 'Internal', task: 'Meeting', duration: 1.0, user: 'Michael Schmidt', billable: false, status: 'approved' },
  { id: 'log3', date: '2025-02-14', project: 'P-2025-B002', task: 'Design Review', duration: 2.0, user: 'Michael Schmidt', billable: true, status: 'submitted' },
  { id: 'log4', date: '2025-02-14', project: 'P-2025-A001', task: 'Bugfixing', duration: 3.5, user: 'Michael Schmidt', billable: true, status: 'draft' },
];

export function TimeTrackingList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredLogs = mockLogs.filter(log => 
    log.project.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showForm) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setShowForm(false)} className="mb-4">
          ← Zurück zur Liste
        </Button>
        <TimeEntryFormDemo />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Zeiterfassung</h2>
          <p className="text-muted-foreground">Stundenbuchung und Übersicht</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Zeit erfassen
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">38.5 h</div>
            <p className="text-xs text-muted-foreground">Gesamt diese Woche</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">32.0 h</div>
            <p className="text-xs text-muted-foreground">Abrechenbar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">Buchungsquote</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">3.5 h</div>
            <p className="text-xs text-muted-foreground">Offene Entwürfe</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Buchungen</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Projekt oder Aufgabe suchen..." 
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
                <TableHead>Projekt</TableHead>
                <TableHead>Aufgabe</TableHead>
                <TableHead>Dauer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Typ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell className="font-medium">{log.project}</TableCell>
                  <TableCell>{log.task}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {log.duration} h
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      log.status === 'approved' ? 'text-green-600 border-green-200 bg-green-50' :
                      log.status === 'draft' ? 'text-amber-600 border-amber-200 bg-amber-50' : ''
                    }>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {log.billable ? <Badge variant="secondary">Billable</Badge> : <span className="text-muted-foreground text-sm">Internal</span>}
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
