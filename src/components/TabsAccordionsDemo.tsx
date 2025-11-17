import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Home,
  MapPin,
  Users,
  Activity,
  FileText,
  Settings,
  Shield,
  Bell,
  Lock,
  User,
  Building2,
  Mail,
  Phone,
  CreditCard,
  Eye,
  Plus,
} from 'lucide-react';
import { cn } from './ui/utils';

// Standard Horizontal Tabs (Customer Detail Page)
function StandardHorizontalTabs() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Standard Horizontale Tabs (Kundendetails)</h4>

      <div className="border border-border rounded-lg">
        <Tabs defaultValue="uebersicht">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-12">
            <TabsTrigger
              value="uebersicht"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Übersicht
            </TabsTrigger>
            <TabsTrigger
              value="standorte"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Standorte
            </TabsTrigger>
            <TabsTrigger
              value="kontakte"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Kontakte
            </TabsTrigger>
            <TabsTrigger
              value="aktivitaeten"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Aktivitäten
            </TabsTrigger>
            <TabsTrigger
              value="dokumente"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Dokumente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uebersicht" className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Firmenname</p>
                <p>Hofladen Müller GmbH</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Umsatzsteuer-ID</p>
                <p>DE123456789</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Standort</p>
                <p>München</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>Aktiv</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="standorte" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4>Standorte</h4>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Neuer Standort
                </Button>
              </div>
              <div className="space-y-2">
                <div className="border border-border rounded-lg p-4">
                  <p className="font-medium">Hauptsitz München</p>
                  <p className="text-sm text-muted-foreground">Musterstraße 123, 80333 München</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="font-medium">Lager Garching</p>
                  <p className="text-sm text-muted-foreground">Industrieweg 45, 85748 Garching</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kontakte" className="p-6">
            <p className="text-muted-foreground">Kontaktliste wird hier angezeigt...</p>
          </TabsContent>

          <TabsContent value="aktivitaeten" className="p-6">
            <p className="text-muted-foreground">Aktivitätsverlauf wird hier angezeigt...</p>
          </TabsContent>

          <TabsContent value="dokumente" className="p-6">
            <p className="text-muted-foreground">Dokumente werden hier angezeigt...</p>
          </TabsContent>
        </Tabs>
      </div>

      <p className="text-sm text-muted-foreground">
        2px blauer Unterstrich für aktiven Tab, glatte Übergänge
      </p>
    </div>
  );
}

// Tabs with Icons
function TabsWithIcons() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Tabs mit Icons</h4>

      <div className="border border-border rounded-lg">
        <Tabs defaultValue="uebersicht">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-12">
            <TabsTrigger
              value="uebersicht"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Home className="mr-2 h-4 w-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger
              value="standorte"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Standorte
            </TabsTrigger>
            <TabsTrigger
              value="kontakte"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Users className="mr-2 h-4 w-4" />
              Kontakte
            </TabsTrigger>
            <TabsTrigger
              value="aktivitaeten"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Activity className="mr-2 h-4 w-4" />
              Aktivitäten
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uebersicht" className="p-6">
            <p>Übersichtsseite mit allgemeinen Informationen</p>
          </TabsContent>

          <TabsContent value="standorte" className="p-6">
            <p>Standortverwaltung</p>
          </TabsContent>

          <TabsContent value="kontakte" className="p-6">
            <p>Kontaktverwaltung</p>
          </TabsContent>

          <TabsContent value="aktivitaeten" className="p-6">
            <p>Aktivitätsverlauf</p>
          </TabsContent>
        </Tabs>
      </div>

      <p className="text-sm text-muted-foreground">
        Icons links vom Text, 20px Größe, Farbe passt sich an Tab-Status an
      </p>
    </div>
  );
}

// Tabs with Badge Counts
function TabsWithBadges() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Tabs mit Zähler-Badges</h4>

      <div className="border border-border rounded-lg">
        <Tabs defaultValue="uebersicht">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-12">
            <TabsTrigger
              value="uebersicht"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Übersicht
            </TabsTrigger>
            <TabsTrigger
              value="standorte"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Standorte
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="kontakte"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Kontakte
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                12
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="aktivitaeten"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Aktivitäten
              <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1.5">
                5
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="dokumente"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Dokumente
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5">
                8
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uebersicht" className="p-6">
            <p>Übersichtsseite</p>
          </TabsContent>

          <TabsContent value="standorte" className="p-6">
            <p>3 Standorte gefunden</p>
          </TabsContent>

          <TabsContent value="kontakte" className="p-6">
            <p>12 Kontakte gefunden</p>
          </TabsContent>

          <TabsContent value="aktivitaeten" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="destructive">5 neue</Badge>
              <span className="text-sm text-muted-foreground">
                Ungelesene Aktivitäten
              </span>
            </div>
            <p>Aktivitätsverlauf...</p>
          </TabsContent>

          <TabsContent value="dokumente" className="p-6">
            <p>8 Dokumente gefunden</p>
          </TabsContent>
        </Tabs>
      </div>

      <p className="text-sm text-muted-foreground">
        Kleine Badges zeigen Anzahl verwandter Elemente, rot für ausstehende Aktionen
      </p>
    </div>
  );
}

// Vertical Tabs (Settings Style)
function VerticalTabs() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Vertikale Tabs (Einstellungen)</h4>

      <div className="border border-border rounded-lg">
        <div className="flex">
          <Tabs defaultValue="profil" orientation="vertical" className="flex w-full">
            <TabsList className="flex flex-col h-auto w-48 bg-muted/50 rounded-none border-r p-2 gap-1">
              <TabsTrigger
                value="profil"
                className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-none border-l-2 border-transparent data-[state=active]:border-primary rounded-r-md rounded-l-none"
              >
                <User className="mr-2 h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger
                value="sicherheit"
                className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-none border-l-2 border-transparent data-[state=active]:border-primary rounded-r-md rounded-l-none"
              >
                <Shield className="mr-2 h-4 w-4" />
                Sicherheit
              </TabsTrigger>
              <TabsTrigger
                value="benachrichtigungen"
                className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-none border-l-2 border-transparent data-[state=active]:border-primary rounded-r-md rounded-l-none"
              >
                <Bell className="mr-2 h-4 w-4" />
                Benachrichtigungen
              </TabsTrigger>
              <TabsTrigger
                value="datenschutz"
                className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-none border-l-2 border-transparent data-[state=active]:border-primary rounded-r-md rounded-l-none"
              >
                <Lock className="mr-2 h-4 w-4" />
                Datenschutz
              </TabsTrigger>
            </TabsList>

            <div className="flex-1">
              <TabsContent value="profil" className="p-6 m-0 space-y-4">
                <div>
                  <h4 className="mb-4">Profildetails</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Max Mustermann" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail</Label>
                      <Input id="email" type="email" defaultValue="max@beispiel.de" />
                    </div>
                    <Button>Änderungen speichern</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sicherheit" className="p-6 m-0 space-y-4">
                <div>
                  <h4 className="mb-4">Sicherheitseinstellungen</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Aktuelles Passwort</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Neues Passwort</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <Button>Passwort ändern</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="benachrichtigungen" className="p-6 m-0">
                <h4 className="mb-4">Benachrichtigungseinstellungen</h4>
                <p className="text-muted-foreground">
                  Verwalten Sie Ihre E-Mail- und Push-Benachrichtigungen
                </p>
              </TabsContent>

              <TabsContent value="datenschutz" className="p-6 m-0">
                <h4 className="mb-4">Datenschutzeinstellungen</h4>
                <p className="text-muted-foreground">
                  Kontrollieren Sie Ihre Privatsphäre-Einstellungen
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        3px linker Rahmen für aktiven Tab, ideal für Einstellungsseiten
      </p>
    </div>
  );
}

// Standard Accordion (Single-Open)
function StandardAccordion() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Standard-Akkordeon (Einzeln öffnend)</h4>

      <Accordion type="single" collapsible className="border border-border rounded-lg">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-6">
            Was ist KOMPASS?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-muted-foreground">
            KOMPASS ist eine professionelle CRM- und Projektmanagement-Anwendung für den
            deutschen Bau- und Innenausbaumarkt. Es hilft Ihnen, Kunden zu verwalten,
            Projekte zu planen und Ihre Geschäftsprozesse zu optimieren.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="px-6">
            Wie erstelle ich einen neuen Kunden?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-muted-foreground">
            Klicken Sie auf die Schaltfläche "Neuer Kunde" in der oberen rechten Ecke
            der Kundenliste. Füllen Sie das Formular mit den Kundeninformationen aus
            und klicken Sie auf "Speichern".
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="px-6">
            Wie funktioniert die Offline-Synchronisierung?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-muted-foreground">
            KOMPASS speichert Ihre Änderungen lokal, wenn Sie offline sind, und
            synchronisiert sie automatisch, sobald eine Internetverbindung verfügbar ist.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-b-0">
          <AccordionTrigger className="px-6">
            Welche Benutzerrollen gibt es?
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-muted-foreground">
            KOMPASS bietet fünf Benutzerrollen: Geschäftsführung (GF), Planer (PLAN),
            Administrator (ADM), Kalkulator (KALK) und Buchhaltung (BUCH).
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-sm text-muted-foreground">
        Nur ein Element gleichzeitig geöffnet, ideal für FAQs
      </p>
    </div>
  );
}

// Multi-Open Accordion
function MultiOpenAccordion() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Mehrfach-Akkordeon (Mehrere gleichzeitig öffnen)</h4>

      <Accordion type="multiple" className="border border-border rounded-lg">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <span>Grundinformationen</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="company">Firmenname</Label>
                  <Input id="company" defaultValue="Hofladen Müller GmbH" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat">Umsatzsteuer-ID</Label>
                  <Input id="vat" defaultValue="DE123456789" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="px-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Adressdaten</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="street">Straße und Hausnummer</Label>
                <Input id="street" defaultValue="Musterstraße 123" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="zip">PLZ</Label>
                  <Input id="zip" defaultValue="80333" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Stadt</Label>
                  <Input id="city" defaultValue="München" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="px-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>Kontaktdaten</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="contact-email">E-Mail</Label>
                <Input id="contact-email" type="email" defaultValue="info@hofladen.de" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" type="tel" defaultValue="+49 89 1234567" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-b-0">
          <AccordionTrigger className="px-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span>Zahlungsinformationen</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" defaultValue="DE89 3704 0044 0532 0130 00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-terms">Zahlungsziel</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="payment-terms">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14">14 Tage</SelectItem>
                    <SelectItem value="30">30 Tage</SelectItem>
                    <SelectItem value="60">60 Tage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-sm text-muted-foreground">
        Mehrere Elemente gleichzeitig geöffnet, ideal für Formulare mit Abschnitten
      </p>
    </div>
  );
}

// Flush Accordion (No Border)
function FlushAccordion() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Flush-Akkordeon (Ohne Rahmen)</h4>

      <Accordion type="single" collapsible className="divide-y divide-border">
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger>Allgemeine Einstellungen</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Sprache, Zeitzone und Währungseinstellungen konfigurieren.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-0">
          <AccordionTrigger>Benachrichtigungen</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            E-Mail- und Push-Benachrichtigungen verwalten.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-0">
          <AccordionTrigger>Datenschutz</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Datenschutz- und Sicherheitseinstellungen anpassen.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="border-0">
          <AccordionTrigger>Erweitert</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            Erweiterte Systemeinstellungen und Entwickleroptionen.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-sm text-muted-foreground">
        Minimale Darstellung ohne Containerrahmen, nur Trennlinien
      </p>
    </div>
  );
}

// Combined: Tabs with Accordion Content
function TabsWithAccordion() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Kombiniert: Tabs mit Akkordeon-Inhalt</h4>

      <div className="border border-border rounded-lg">
        <Tabs defaultValue="allgemein">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-12">
            <TabsTrigger
              value="allgemein"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Settings className="mr-2 h-4 w-4" />
              Allgemein
            </TabsTrigger>
            <TabsTrigger
              value="sicherheit"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Shield className="mr-2 h-4 w-4" />
              Sicherheit
            </TabsTrigger>
            <TabsTrigger
              value="benachrichtigungen"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Bell className="mr-2 h-4 w-4" />
              Benachrichtigungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="allgemein" className="p-6">
            <Accordion type="single" collapsible className="border border-border rounded-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6">Sprache & Region</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="language">Sprache</Label>
                      <Select defaultValue="de">
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zeitzone</Label>
                      <Select defaultValue="berlin">
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="berlin">Europe/Berlin</SelectItem>
                          <SelectItem value="vienna">Europe/Vienna</SelectItem>
                          <SelectItem value="zurich">Europe/Zurich</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="px-6">Währung & Format</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Währung</Label>
                    <Select defaultValue="eur">
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="chf">CHF (Fr.)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="sicherheit" className="p-6">
            <Accordion type="single" collapsible className="border border-border rounded-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-6">Passwort ändern</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="old-pw">Altes Passwort</Label>
                      <Input id="old-pw" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-pw">Neues Passwort</Label>
                      <Input id="new-pw" type="password" />
                    </div>
                    <Button>Passwort aktualisieren</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="px-6">Zwei-Faktor-Authentifizierung</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Erhöhen Sie die Sicherheit Ihres Kontos durch Aktivierung der
                    Zwei-Faktor-Authentifizierung.
                  </p>
                  <Button variant="outline">2FA aktivieren</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="benachrichtigungen" className="p-6">
            <p className="text-muted-foreground">Benachrichtigungseinstellungen...</p>
          </TabsContent>
        </Tabs>
      </div>

      <p className="text-sm text-muted-foreground">
        Tabs zur Hauptnavigation, Akkordeon zur Unterorganisation innerhalb jedes Tabs
      </p>
    </div>
  );
}

// Nested Accordion
function NestedAccordion() {
  return (
    <div className="space-y-4">
      <h4 className="mb-4">Verschachteltes Akkordeon</h4>

      <Accordion type="single" collapsible className="border border-border rounded-lg">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-6">Benutzerverwaltung</AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Verwalten Sie Benutzer und deren Berechtigungen.
            </p>
            
            {/* Nested Accordion */}
            <Accordion type="single" collapsible className="border border-border rounded-lg">
              <AccordionItem value="nested-1">
                <AccordionTrigger className="px-4 text-sm">
                  Benutzerrollen
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                  GF, PLAN, ADM, KALK, BUCH - Jede Rolle hat spezifische Berechtigungen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="nested-2" className="border-b-0">
                <AccordionTrigger className="px-4 text-sm">
                  Berechtigungen
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                  Lesen, Schreiben, Löschen - Granulare Zugriffskontrolle.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-b-0">
          <AccordionTrigger className="px-6">Systemeinstellungen</AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Erweiterte Systemkonfiguration.
            </p>

            {/* Nested Accordion */}
            <Accordion type="single" collapsible className="border border-border rounded-lg">
              <AccordionItem value="nested-1">
                <AccordionTrigger className="px-4 text-sm">
                  Datenbankeinstellungen
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                  Verbindungsparameter und Backup-Konfiguration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="nested-2" className="border-b-0">
                <AccordionTrigger className="px-4 text-sm">
                  API-Konfiguration
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-sm text-muted-foreground">
                  REST-API Endpunkte und Authentifizierung.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="text-sm text-muted-foreground">
        Verschachtelte Akkordeons mit eingerücktem Inhalt, ideal für hierarchische Inhalte
      </p>
    </div>
  );
}

export function TabsAccordionsDemo() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Horizontale Tabs</CardTitle>
          <CardDescription>
            Standard-Tab-Navigation mit Unterstrich-Indikator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StandardHorizontalTabs />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabs mit Icons</CardTitle>
          <CardDescription>
            Icons verbessern die visuelle Erkennbarkeit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsWithIcons />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabs mit Zähler-Badges</CardTitle>
          <CardDescription>
            Zeigt die Anzahl der zugehörigen Elemente an
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsWithBadges />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Vertikale Tabs</CardTitle>
          <CardDescription>
            Seitenleisten-Stil für Einstellungsseiten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerticalTabs />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Standard-Akkordeon</CardTitle>
          <CardDescription>
            Einzeln öffnend, ideal für FAQs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StandardAccordion />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mehrfach-Akkordeon</CardTitle>
          <CardDescription>
            Mehrere Abschnitte gleichzeitig geöffnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiOpenAccordion />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flush-Akkordeon</CardTitle>
          <CardDescription>
            Minimale Darstellung ohne Containerrahmen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FlushAccordion />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Tabs mit Akkordeon-Inhalt</CardTitle>
          <CardDescription>
            Kombinierte Navigation für komplexe Einstellungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsWithAccordion />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verschachteltes Akkordeon</CardTitle>
          <CardDescription>
            Hierarchische Inhaltsorganisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NestedAccordion />
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h4 className="mb-4">Design-Richtlinien</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Horizontale Tabs</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Höhe: 48px</li>
              <li>• Aktiv: 2px blauer Unterstrich</li>
              <li>• Inaktiv: Grauer Text</li>
              <li>• Hover: Hellblauer Hintergrund</li>
              <li>• Übergang: 200ms fade-in</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Vertikale Tabs</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Breite: 200px Seitenleiste</li>
              <li>• Aktiv: 3px linker Rahmen</li>
              <li>• Aktiver BG: Hellblau</li>
              <li>• Vollbreite, linksbündig</li>
              <li>• Icons: 20px links</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Tab-Badges</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Größe: 18px Kreis</li>
              <li>• Position: Rechts vom Text</li>
              <li>• Grau: Normale Anzahl</li>
              <li>• Rot: Ausstehende Aktionen</li>
              <li>• Min-Breite: 18px</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Akkordeon-Struktur</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Kopfhöhe: 56px</li>
              <li>• Padding: 16px 24px</li>
              <li>• Chevron: Rechts, 20px</li>
              <li>• Rotation: 180° in 300ms</li>
              <li>• Rahmen: 1px durchgehend</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Akkordeon-Inhalt</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• BG: Hellgrau (#f9fafb)</li>
              <li>• Padding: 16px 24px</li>
              <li>• Oben: 1px Trennlinie</li>
              <li>• Animation: 300ms ease</li>
              <li>• Max-Höhe: 0 → auto</li>
            </ul>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h4 className="mb-2">Barrierefreiheit</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Tabs: role="tablist"</li>
              <li>• aria-selected auf Tabs</li>
              <li>• Akkordeon: role="button"</li>
              <li>• aria-expanded Status</li>
              <li>• Tastaturnavigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
