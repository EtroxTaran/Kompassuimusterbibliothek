import { Calendar, Euro, Users, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

export function ProjectCards() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4">Projekt-Portfolio-Karten</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>P-2024-B023</CardTitle>
                  <p className="text-muted-foreground mt-1">REWE München Süd</p>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  In Bearbeitung
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>15.10.2024 - 15.12.2024</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Fortschritt</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p>€ 450.000</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Marge</p>
                    <p className="text-chart-2">+15%</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground">MS</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">M. Schmidt</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>5 Mitarbeiter</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>P-2024-B015</CardTitle>
                  <p className="text-muted-foreground mt-1">Biomarkt Heidelberg</p>
                </div>
                <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30">
                  Planung
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>01.12.2024 - 28.02.2025</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Fortschritt</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-4 h-2 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p>€ 125.000</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Marge</p>
                    <p className="text-chart-2">+18%</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-chart-2 text-white">AW</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">A. Weber</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>3 Mitarbeiter</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>P-2024-A089</CardTitle>
                  <p className="text-muted-foreground mt-1">Weingut Fischer</p>
                </div>
                <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                  Abgeschlossen
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>01.08.2024 - 30.09.2024</span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Fortschritt</span>
                    <span className="flex items-center gap-1 text-chart-2">
                      <CheckCircle2 className="h-4 w-4" />
                      100%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-chart-2 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p>€ 89.500</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Marge</p>
                    <p className="text-chart-2">+22%</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-chart-3 text-white">TK</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">T. Klein</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>4 Mitarbeiter</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <p className="text-muted-foreground mt-3">
          Vertikale Projekt-Portfolio-Karten mit Fortschritt, Budget und Team
        </p>
      </div>

      <div>
        <h4 className="mb-4">Opportunity-Karten (Pipeline/Kanban)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="mb-3 text-muted-foreground">Angebot erstellt</h4>
            <div className="space-y-3">
              <Card className="cursor-move transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle>Biomarkt Heidelberg</CardTitle>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <p className="text-chart-2">€ 125.000</p>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">Wahrscheinlichkeit</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-chart-2 h-1.5 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-lg p-2">
                      <Clock className="h-4 w-4" />
                      <span>Follow-up: 20.11.2024</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-muted">AW</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">A. Weber</span>
                    </div>
                    <span className="text-muted-foreground">Vor 2 Tagen</span>
                  </div>
                </CardFooter>
              </Card>

              <Card className="cursor-move transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle>Restaurant Adler</CardTitle>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <p className="text-chart-2">€ 78.500</p>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">Wahrscheinlichkeit</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-chart-4 h-1.5 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-lg p-2">
                      <Clock className="h-4 w-4" />
                      <span>Telefonat: 18.11.2024</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-muted">MS</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">M. Schmidt</span>
                    </div>
                    <span className="text-muted-foreground">Vor 5 Tagen</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-muted-foreground">Verhandlung</h4>
            <div className="space-y-3">
              <Card className="cursor-move transition-all hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle>Café Zentral</CardTitle>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <p className="text-chart-2">€ 52.000</p>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">Wahrscheinlichkeit</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-chart-2 h-1.5 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-lg p-2">
                      <Clock className="h-4 w-4" />
                      <span>Meeting: 16.11.2024</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-muted">TK</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">T. Klein</span>
                    </div>
                    <span className="text-muted-foreground">Vor 1 Tag</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-muted-foreground">Gewonnen</h4>
            <div className="space-y-3">
              <Card className="cursor-move transition-all hover:shadow-lg border-chart-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle>Hofladen Müller</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-chart-2" />
                  </div>
                  <p className="text-chart-2">€ 95.000</p>
                </CardHeader>
                <CardContent className="py-3">
                  <div className="space-y-3">
                    <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30 w-full justify-center">
                      Auftrag erteilt
                    </Badge>
                    <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-lg p-2">
                      <Calendar className="h-4 w-4" />
                      <span>Start: 01.12.2024</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-muted">AW</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">A. Weber</span>
                    </div>
                    <span className="text-muted-foreground">Gestern</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-3">
          Kanban-Board-Karten mit Drag-Handle und Wahrscheinlichkeitsindikatoren
        </p>
      </div>
    </div>
  );
}
