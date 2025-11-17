import { MoreVertical, CheckCircle2, AlertCircle, XCircle, Users, Calendar, Euro } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';

export function BadgesInContext() {
  const customers = [
    {
      id: 1,
      name: 'Hofladen Müller',
      status: 'Aktiv',
      rating: 'A',
      tags: ['Großkunde', 'Bio'],
    },
    {
      id: 2,
      name: 'Bäckerei Schmidt',
      status: 'Inaktiv',
      rating: 'B',
      tags: ['Stammkunde'],
    },
    {
      id: 3,
      name: 'Weingut Fischer',
      status: 'Aktiv',
      rating: 'A',
      tags: ['VIP', 'Premium'],
    },
  ];

  const projects = [
    {
      id: 1,
      name: 'Renovierung Büro',
      status: 'In Bearbeitung',
      priority: 'Hoch',
      team: 5,
    },
    {
      id: 2,
      name: 'Lagerhaus Neubau',
      status: 'Neu',
      priority: 'Mittel',
      team: 8,
    },
    {
      id: 3,
      name: 'Fassadensanierung',
      status: 'Abgeschlossen',
      priority: 'Niedrig',
      team: 3,
    },
  ];

  const invoices = [
    { id: 'RE-2024-0015', customer: 'Hofladen Müller', amount: 4500, status: 'Bezahlt' },
    { id: 'RE-2024-0016', customer: 'Weingut Fischer', amount: 8200, status: 'Ausstehend' },
    { id: 'RE-2024-0017', customer: 'Bäckerei Schmidt', amount: 3100, status: 'Überfällig' },
  ];

  return (
    <div className="space-y-8">
      {/* Customer Table */}
      <div>
        <h4 className="mb-3">Kundenliste</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kunde</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bewertung</TableHead>
                <TableHead>Kategorien</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    {customer.status === 'Aktiv' ? (
                      <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Aktiv
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3.5 w-3.5" />
                        Inaktiv
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.rating === 'A' ? (
                      <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                        A
                      </Badge>
                    ) : (
                      <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                        B
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="h-5 px-2 text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Project Cards */}
      <div>
        <h4 className="mb-3">Projektkarten</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <h4>{project.name}</h4>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.status === 'In Bearbeitung' && (
                  <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                    <AlertCircle className="h-3.5 w-3.5" />
                    In Bearbeitung
                  </Badge>
                )}
                {project.status === 'Neu' && (
                  <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
                    Neu
                  </Badge>
                )}
                {project.status === 'Abgeschlossen' && (
                  <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Abgeschlossen
                  </Badge>
                )}

                {project.priority === 'Hoch' && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Hoch
                  </Badge>
                )}
                {project.priority === 'Mittel' && (
                  <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                    Mittel
                  </Badge>
                )}
                {project.priority === 'Niedrig' && (
                  <Badge variant="secondary">
                    Niedrig
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{project.team} Mitarbeiter</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div>
        <h4 className="mb-3">Rechnungsübersicht</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rechnungsnr.</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Zahlungsstatus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      {invoice.amount.toLocaleString('de-DE')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {invoice.status === 'Bezahlt' && (
                      <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Bezahlt
                      </Badge>
                    )}
                    {invoice.status === 'Ausstehend' && (
                      <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Ausstehend
                      </Badge>
                    )}
                    {invoice.status === 'Überfällig' && (
                      <Badge variant="destructive">
                        <XCircle className="h-3.5 w-3.5" />
                        Überfällig
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* User Profile Example */}
      <div>
        <h4 className="mb-3">Benutzerprofil</h4>
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary">MS</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3>Michael Schmidt</h3>
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                  <Users className="h-3.5 w-3.5" />
                  ADM
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2" />
                <span className="text-muted-foreground">Online</span>
                <Badge variant="outline" className="h-5 px-2 text-[11px]">
                  Außendienst
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
