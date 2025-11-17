import { MapPin, Star, MoreVertical, Phone, Mail, Building2, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function ListItemCards() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Kundenkarten (Listenansicht)</h4>
        <div className="space-y-3">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">HM</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1">Hofladen Müller GmbH</h4>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span>DE123456789</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      München
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                    Aktiv
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Anzeigen</DropdownMenuItem>
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-chart-2 text-white">WF</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1">Weingut Fischer</h4>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span>DE987654321</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Heidelberg
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                    <Star className="h-4 w-4 text-muted" />
                  </div>
                  <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                    Aktiv
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Anzeigen</DropdownMenuItem>
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-chart-3 text-white">CM</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1">Café am Markt GmbH</h4>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <span>DE456789123</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Frankfurt
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                    {[4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-muted" />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    Inaktiv
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Anzeigen</DropdownMenuItem>
                      <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Horizontale Kundenkarten mit Avatar, Rating, Status und Aktions-Menü
        </p>
      </div>

      <div>
        <h4 className="mb-4">Erweiterte Kundenkarten mit Kontaktinfo</h4>
        <div className="space-y-3">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Building2 className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="mb-1">REWE München Süd</h4>
                      <p className="text-muted-foreground">DE234567890</p>
                    </div>
                    <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                      Großkunde
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>kontakt@rewe-sued.de</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+49 89 1234567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>München, Bayern</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Kunde seit 2020</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Details anzeigen</DropdownMenuItem>
                    <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                    <DropdownMenuItem>E-Mail senden</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Erweiterte Ansicht mit Kontaktinformationen in Grid-Layout
        </p>
      </div>

      <div>
        <h4 className="mb-4">Kompakte Listenkarten</h4>
        <div className="space-y-2">
          <Card className="cursor-pointer transition-all hover:bg-muted/30">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">HM</AvatarFallback>
                  </Avatar>
                  <span>Hofladen Müller GmbH</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">€ 125.450</span>
                  <Badge variant="outline">12 Projekte</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:bg-muted/30">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">WF</AvatarFallback>
                  </Avatar>
                  <span>Weingut Fischer</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">€ 89.200</span>
                  <Badge variant="outline">8 Projekte</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:bg-muted/30">
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">CM</AvatarFallback>
                  </Avatar>
                  <span>Café am Markt GmbH</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">€ 45.800</span>
                  <Badge variant="outline">3 Projekte</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Sehr kompakte Variante für dichte Listen mit Hover-Effekt
        </p>
      </div>

      <div>
        <h4 className="mb-4">Karten mit Performance-Indikatoren</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardContent className="py-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">BH</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4>Biomarkt Heidelberg</h4>
                    <p className="text-muted-foreground">DE345678901</p>
                  </div>
                </div>
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">A-Kunde</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                <div>
                  <p className="text-muted-foreground">Umsatz</p>
                  <p>€ 185K</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Projekte</p>
                  <p>15</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Wachstum</p>
                  <div className="flex items-center gap-1 text-chart-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>+24%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardContent className="py-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-chart-2 text-white">RS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4>Restaurant Sonnenschein</h4>
                    <p className="text-muted-foreground">DE567890123</p>
                  </div>
                </div>
                <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">B-Kunde</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                <div>
                  <p className="text-muted-foreground">Umsatz</p>
                  <p>€ 92K</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Projekte</p>
                  <p>7</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Wachstum</p>
                  <div className="flex items-center gap-1 text-chart-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Karten mit Leistungskennzahlen und Klassifizierung
        </p>
      </div>
    </div>
  );
}
