import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './components/ui/select';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeSwitcher } from './components/ThemeSwitcher';

// Design System
import { DesignSystemInfo } from './components/DesignSystemInfo';

// Error States
import { NetworkErrorState } from './components/NetworkErrorState';
import { ToastsNotificationsDemo } from './components/ToastsNotificationsDemo';
import { CriticalErrorDialog } from './components/CriticalErrorDialog';

// Empty States
import { EmptyCustomerList } from './components/EmptyCustomerList';
import { EmptySearchResults } from './components/EmptySearchResults';
import { EmptyProjectList } from './components/EmptyProjectList';
import { EmptyActivityTimeline } from './components/EmptyActivityTimeline';

// Permission States
import { PermissionDenied } from './components/PermissionDenied';
import { OwnerOnlyCustomer } from './components/OwnerOnlyCustomer';
import { GoBDInvoiceError } from './components/GoBDInvoiceError';

// Conflict States
import { ConflictResolutionInterfaceDemo } from './components/ConflictResolutionInterface';

// Loading States
import { CustomerListSkeleton } from './components/CustomerListSkeleton';
import { CustomerDetailSkeleton } from './components/CustomerDetailSkeleton';
import { DashboardKPISkeleton } from './components/DashboardKPISkeleton';
import { FormLoadingSkeleton } from './components/FormLoadingSkeleton';
import { ButtonLoadingStates } from './components/ButtonLoadingStates';
import { ProgressIndicator } from './components/ProgressIndicator';
import { InlineLoadingText } from './components/InlineLoadingText';
import { LoadingStateDemo } from './components/LoadingStateDemo';
import { SkeletonTransitionDemo } from './components/SkeletonTransitionDemo';
import { OfflineSyncStatusDemo } from './components/OfflineSyncStatus';

// Navigation
import { TopBarDemo } from './components/TopBarDemo';
import { RoleBasedNavDemo } from './components/RoleBasedNavDemo';
import { MobileNavDemo } from './components/MobileNavDemo';

// UI Components
import { BadgeDemo } from './components/BadgeDemo';
import { BreadcrumbDemo } from './components/BreadcrumbDemo';
import { ButtonDemo } from './components/ButtonDemo';
import { CardDemo } from './components/CardDemo';
import { DateTimePickerDemo } from './components/DateTimePickerDemo';
import { DialogsModalsDemo } from './components/DialogsModalsDemo';
import { DropdownsSelectsDemo } from './components/DropdownsSelectsDemo';
import { FormInputsDemo } from './components/FormInputsDemo';
import { PaginationDemo } from './components/PaginationDemo';
import { ProgressIndicatorsDemo } from './components/ProgressIndicatorsDemo';
import { SearchFiltersDemo } from './components/SearchFiltersDemo';
import { TablesDataGridsDemo } from './components/TablesDataGridsDemo';
import { TabsAccordionsDemo } from './components/TabsAccordionsDemo';
import { TooltipsPopoversDemo } from './components/TooltipsPopoversDemo';
import { TaskCardDemo } from './components/TaskCard';

// Forms
import { ActivityProtocolFormDemo } from './components/ActivityProtocolFormDemo';
import { BulkImportFormDemo } from './components/BulkImportFormDemo';
import { ContactFormDemo } from './components/ContactFormDemo';
import { CustomerFormDemo } from './components/CustomerFormDemo';
import { LocationFormDemo } from './components/LocationFormDemo';
import { OpportunityFormDemo } from './components/OpportunityFormDemo';
import { ProjectFormDemo } from './components/ProjectFormDemo';
import { OfferFormDemo } from './components/OfferForm';
import { ContractFormDemo } from './components/ContractForm';
import { TaskFormDemo } from './components/TaskForm';
import { RichTextEditorDemo } from './components/RichTextEditorDemo';
import { RichTextEditorFieldsDemo } from './components/RichTextEditorFieldsDemo';
import { TimeEntryFormDemo } from './components/TimeEntryForm';
import { MileageLogFormDemo } from './components/MileageLogForm';
import { ProjectCostFormDemo } from './components/ProjectCostForm';
import { ExpenseEntryFormDemo } from './components/ExpenseEntryForm';
import { SupplierFormDemo } from './components/SupplierForm';
import { TourPlanningFormDemo } from './components/TourPlanningForm';
import { MaterialCatalogFormDemo } from './components/MaterialCatalogForm';
import { PurchaseOrderFormDemo } from './components/PurchaseOrderForm';
import { SupplierListViewDemo } from './components/SupplierListView';
import { ProjectMaterialsViewDemo } from './components/ProjectMaterialsView';
import { SupplierDetailPageDemo } from './components/SupplierDetailPage';
import { TourDetailViewDemo } from './components/TourDetailView';
import { INNDashboardDemo } from './components/INNDashboard';
import { DataImportExportDemo } from './components/DataImportExport';

// Figma Import Template
import { FigmaImportTemplateDemo } from './components/FigmaImportTemplate';

import { KompassApp } from './components/KompassApp';
import { Button } from './components/ui/button'; // Ensure Button is imported

export default function App() {
  const [activeTab, setActiveTab] = useState('full-app-demo');

  if (activeTab === 'full-app-demo') {
    return (
      <ThemeProvider defaultTheme="system" storageKey="kompass-ui-theme">
        <KompassApp />
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={() => setActiveTab('error-states')} variant="outline" className="shadow-lg bg-background">
            Zurück zur Muster-Bibliothek
          </Button>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="kompass-ui-theme">
      <div className="min-h-screen bg-background p-8">
        <Toaster />
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2">KOMPASS UI Muster-Bibliothek</h1>
              <p className="text-muted-foreground">
                Umfassende Komponentenbibliothek mit Fehlerbehandlung, Leerzuständen, Ladeindikatoren, Navigation, Abzeichen, Breadcrumbs, Buttons, Karten, Datum/Uhrzeit-Auswahl, Dialogen, Dropdown-Menüs und Formulareingaben
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <ThemeSwitcher />
            </div>
          </div>

          <div className="mb-6">
            <DesignSystemInfo />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4">
              <label htmlFor="component-select" className="shrink-0">
                Komponente auswählen:
              </label>
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger id="component-select" className="max-w-md h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>ZUSTÄNDE</SelectLabel>
                    <SelectItem value="error-states">Fehlerzustände</SelectItem>
                    <SelectItem value="empty-states">Leerzustände</SelectItem>
                    <SelectItem value="loading-states">Ladezustände</SelectItem>
                    <SelectItem value="permission-states">Berechtigungen</SelectItem>
                    <SelectItem value="conflict-states">Konflikte</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>FORMULAR-KOMPONENTEN</SelectLabel>
                    <SelectItem value="form-inputs">Formulareingaben</SelectItem>
                    <SelectItem value="dropdowns-selects">Dropdowns & Selects</SelectItem>
                    <SelectItem value="date-time-pickers">Datum/Zeit-Auswahl</SelectItem>
                    <SelectItem value="search-filters">Suche & Filter</SelectItem>
                    <SelectItem value="rich-text-editor">Rich Text Editor</SelectItem>
                    <SelectItem value="rich-text-editor-fields">Rich Text Editor Felder</SelectItem>
                    <SelectItem value="activity-form">Aktivitätsformular</SelectItem>
                    <SelectItem value="bulk-import-form">Bulk-Import</SelectItem>
                    <SelectItem value="contact-form">Kontaktformular</SelectItem>
                    <SelectItem value="customer-form">Kundenformular</SelectItem>
                    <SelectItem value="location-form">Standortformular</SelectItem>
                    <SelectItem value="opportunity-form">Gelegenheitsformular</SelectItem>
                    <SelectItem value="project-form">Projektformular</SelectItem>
                    <SelectItem value="offer-form">Angebotsformular</SelectItem>
                    <SelectItem value="contract-form">Vertragsformular</SelectItem>
                    <SelectItem value="task-form">Aufgabenformular</SelectItem>
                    <SelectItem value="mileage-log-form">Kilometerstandformular</SelectItem>
                    <SelectItem value="project-cost-form">Projektkostenformular</SelectItem>
                    <SelectItem value="time-entry-form">Zeiteintragsformular</SelectItem>
                    <SelectItem value="supplier-form">Lieferantformular</SelectItem>
                    <SelectItem value="tour-planning-form">Tourplanungformular</SelectItem>
                    <SelectItem value="expense-entry-form">Ausgabenformular</SelectItem>
                    <SelectItem value="material-catalog-form">Materialkatalogformular</SelectItem>
                    <SelectItem value="purchase-order-form">Bestellformular</SelectItem>
                    <SelectItem value="supplier-list-view">Lieferantenliste</SelectItem>
                    <SelectItem value="project-materials-view">Projektmaterialienansicht</SelectItem>
                    <SelectItem value="supplier-detail-page">Lieferantendetailseite</SelectItem>
                    <SelectItem value="tour-detail-view">Tour-Ausführungsansicht</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>UI-KOMPONENTEN</SelectLabel>
                    <SelectItem value="buttons">Buttons</SelectItem>
                    <SelectItem value="cards">Karten</SelectItem>
                    <SelectItem value="badges">Abzeichen</SelectItem>
                    <SelectItem value="breadcrumbs">Breadcrumbs</SelectItem>
                    <SelectItem value="pagination">Pagination</SelectItem>
                    <SelectItem value="progress-indicators">Fortschrittsanzeigen</SelectItem>
                    <SelectItem value="tabs-accordions">Tabs & Akkordeons</SelectItem>
                    <SelectItem value="toasts-notifications">Toasts & Benachrichtigungen</SelectItem>
                    <SelectItem value="tooltips-popovers">Tooltips & Popovers</SelectItem>
                    <SelectItem value="task-card">Aufgabenkarte</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>DATEN-ANSICHT</SelectLabel>
                    <SelectItem value="tables-data-grids">Tabellen & Datenraster</SelectItem>
                    <SelectItem value="activity-timeline">Aktivitäts-Timeline</SelectItem>
                    <SelectItem value="contact-list">Kontaktliste</SelectItem>
                    <SelectItem value="contact-detail-view">Kontakt Details</SelectItem>
                    <SelectItem value="customer-list">Kundenliste</SelectItem>
                    <SelectItem value="customer-detail-page">Kunde Details (360°)</SelectItem>
                    <SelectItem value="location-list">Standortliste</SelectItem>
                    <SelectItem value="opportunity-pipeline">Opportunity Pipeline</SelectItem>
                    <SelectItem value="opportunity-detail-view">Opportunity Details</SelectItem>
                    <SelectItem value="project-portfolio">Projektportfolio</SelectItem>
                    <SelectItem value="project-detail-view">Projekt Details</SelectItem>
                    <SelectItem value="offer-list">Angebotsliste</SelectItem>
                    <SelectItem value="offer-detail-view">Angebot Details</SelectItem>
                    <SelectItem value="contract-list">Vertragsliste</SelectItem>
                    <SelectItem value="contract-detail-view">Vertrag Details</SelectItem>
                    <SelectItem value="expense-list-view">Ausgabenansicht</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>DASHBOARDS</SelectLabel>
                    <SelectItem value="inn-dashboard">INN Dashboard (Innendienst)</SelectItem>
                    <SelectItem value="adm-dashboard">ADM Dashboard (Außendienst)</SelectItem>
                    <SelectItem value="buch-dashboard">BUCH Dashboard (Buchhaltung)</SelectItem>
                    <SelectItem value="gf-dashboard">GF Dashboard (Geschäftsführung)</SelectItem>
                    <SelectItem value="kalk-dashboard">KALK Dashboard (Kalkulation)</SelectItem>
                    <SelectItem value="plan-dashboard">PLAN Dashboard (Planung)</SelectItem>
                    <SelectItem value="task-dashboard">Aufgaben-Dashboard</SelectItem>
                    <SelectItem value="calendar-view">Kalenderansicht</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>APPLIKATION</SelectLabel>
                    <SelectItem value="full-app-demo">Vollständige CRM App</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>OVERLAYS & DIALOGE</SelectLabel>
                    <SelectItem value="dialogs-modals">Dialoge & Modals</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>NAVIGATION</SelectLabel>
                    <SelectItem value="navigation">Navigationsmuster</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>MOBILE FEATURES</SelectLabel>
                    <SelectItem value="business-card-scanner">Visitenkarten-Scanner</SelectItem>
                    <SelectItem value="customer-quick-view">Kunden-Schnellansicht</SelectItem>
                    <SelectItem value="map-route-planner">Routeplaner</SelectItem>
                    <SelectItem value="mobile-task-management">Mobile Aufgabenverwaltung</SelectItem>
                    <SelectItem value="photo-documentation">Foto-Dokumentation</SelectItem>
                    <SelectItem value="quick-activity-log">Schnelle Aktivitätsverwaltung</SelectItem>
                    <SelectItem value="calendar-export-dialog">Kalenderexport-Dialog</SelectItem>
                    <SelectItem value="financial-flow">Finanzworkflow (Angebot → Auftrag → Rechnung)</SelectItem>
                    <SelectItem value="mobile-performance">Mobile Performance Optimierungen</SelectItem>
                    <SelectItem value="pwa-validation">PWA Validation Dashboard</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>DATENVERARBEITUNG</SelectLabel>
                    <SelectItem value="data-import-export">Daten Import & Export</SelectItem>
                    <SelectItem value="figma-import-template">Figma Import Template</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'error-states' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Kritischer Fehlerdialog</CardTitle>
                    <CardDescription>
                      Modal für kritische Fehler, die Benutzerbestätigung erfordern
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CriticalErrorDialog />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Toast-Benachrichtigung</CardTitle>
                    <CardDescription>
                      Vorübergehende Benachrichtigung für schnelles Feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ToastsNotificationsDemo />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Netzwerkfehler (Offline)</CardTitle>
                    <CardDescription>
                      Vollseitiger Zustand für Offline-Modus und ausstehende Änderungen
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NetworkErrorState />
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'empty-states' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Leere Kundenliste</CardTitle>
                    <CardDescription>
                      Angezeigt, wenn noch keine Kunden vorhanden sind
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptyCustomerList />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Leere Suchergebnisse</CardTitle>
                    <CardDescription>
                      Angezeigt, wenn eine Suche keine Ergebnisse liefert
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptySearchResults />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Leere Projektliste (Gefiltert)</CardTitle>
                    <CardDescription>
                      Angezeigt, wenn Filter keine passenden Projekte finden
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptyProjectList />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Leere Aktivitäts-Timeline</CardTitle>
                    <CardDescription>
                      Angezeigt, wenn noch keine Aktivitäten protokolliert wurden
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptyActivityTimeline />
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'permission-states' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>RBAC eingeschränkte Funktion</CardTitle>
                    <CardDescription>
                      Angezeigt, wenn der Benutzer keine Berechtigung für eine Funktion hat
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PermissionDenied />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nur-Eigentümer Kunde</CardTitle>
                    <CardDescription>
                      Banner für Lesezugriff auf Kunden anderer Außendienstmitarbeiter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OwnerOnlyCustomer />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>GoBD Unveränderliches Feld</CardTitle>
                    <CardDescription>
                      Fehler beim Versuch, eine finalisierte Rechnung zu bearbeiten
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GoBDInvoiceError />
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'conflict-states' && (
              <Card>
                <CardHeader>
                  <CardTitle>Datenkonflikt erkannt</CardTitle>
                  <CardDescription>
                    Zweispaltige Ansicht zur Lösung von Datenkonflikten
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConflictResolutionInterfaceDemo />
                </CardContent>
              </Card>
            )}

            {activeTab === 'loading-states' && (
              <>
                <CustomerListSkeleton />
                <CustomerDetailSkeleton />
                <DashboardKPISkeleton />
                <FormLoadingSkeleton />
                <ButtonLoadingStates />
                <ProgressIndicator />
                <OfflineSyncStatusDemo />
                <InlineLoadingText />
                <LoadingStateDemo />
                <SkeletonTransitionDemo />
              </>
            )}

            {activeTab === 'navigation' && (
              <>
                <TopBarDemo />
                <RoleBasedNavDemo />
                <MobileNavDemo />
              </>
            )}

            {activeTab === 'badges' && <BadgeDemo />}
            {activeTab === 'breadcrumbs' && <BreadcrumbDemo />}
            {activeTab === 'buttons' && <ButtonDemo />}
            {activeTab === 'cards' && <CardDemo />}
            {activeTab === 'date-time-pickers' && <DateTimePickerDemo />}
            {activeTab === 'dialogs-modals' && <DialogsModalsDemo />}
            {activeTab === 'dropdowns-selects' && <DropdownsSelectsDemo />}
            {activeTab === 'form-inputs' && <FormInputsDemo />}
            {activeTab === 'pagination' && <PaginationDemo />}
            {activeTab === 'progress-indicators' && <ProgressIndicatorsDemo />}
            {activeTab === 'search-filters' && <SearchFiltersDemo />}
            {activeTab === 'tables-data-grids' && <TablesDataGridsDemo />}
            {activeTab === 'tabs-accordions' && <TabsAccordionsDemo />}
            {activeTab === 'toasts-notifications' && <ToastsNotificationsDemo />}
            {activeTab === 'tooltips-popovers' && <TooltipsPopoversDemo />}
            {activeTab === 'activity-form' && <ActivityProtocolFormDemo />}
            {activeTab === 'bulk-import-form' && <BulkImportFormDemo />}
            {activeTab === 'contact-form' && <ContactFormDemo />}
            {activeTab === 'customer-form' && <CustomerFormDemo />}
            {activeTab === 'location-form' && <LocationFormDemo />}
            {activeTab === 'opportunity-form' && <OpportunityFormDemo />}
            {activeTab === 'project-form' && <ProjectFormDemo />}
            {activeTab === 'offer-form' && <OfferFormDemo />}
            {activeTab === 'contract-form' && <ContractFormDemo />}
            {activeTab === 'activity-timeline' && <ActivityTimelineDemo />}
            {activeTab === 'contact-list' && <ContactListDemo />}
            {activeTab === 'customer-list' && <CustomerListDemo />}
            {activeTab === 'location-list' && <LocationListDemo />}
            {activeTab === 'opportunity-pipeline' && <OpportunityPipelineDemo />}
            {activeTab === 'offer-list' && <OfferListDemo />}
            {activeTab === 'contract-list' && <ContractListDemo />}
            {activeTab === 'rich-text-editor' && <RichTextEditorDemo />}
            {activeTab === 'rich-text-editor-fields' && <RichTextEditorFieldsDemo />}
            {activeTab === 'project-portfolio' && <ProjectPortfolioDemo />}
            {activeTab === 'contact-detail-view' && <ContactDetailViewDemo />}
            {activeTab === 'customer-detail-page' && <CustomerDetailPageDemo />}
            {activeTab === 'opportunity-detail-view' && <OpportunityDetailViewDemo />}
            {activeTab === 'project-detail-view' && <ProjectDetailViewDemo />}
            {activeTab === 'offer-detail-view' && <OfferDetailViewDemo />}
            {activeTab === 'contract-detail-view' && <ContractDetailViewDemo />}
            {activeTab === 'adm-dashboard' && <ADMDashboardDemo />}
            {activeTab === 'buch-dashboard' && <BUCHDashboardDemo />}
            {activeTab === 'gf-dashboard' && <GFDashboardDemo />}
            {activeTab === 'kalk-dashboard' && <KALKDashboardDemo />}
            {activeTab === 'plan-dashboard' && <PLANDashboardDemo />}
            {activeTab === 'task-card' && <TaskCardDemo />}
            {activeTab === 'task-form' && <TaskFormDemo />}
            {activeTab === 'task-dashboard' && <TaskDashboardDemo />}
            {activeTab === 'business-card-scanner' && <BusinessCardScannerDemo />}
            {activeTab === 'customer-quick-view' && <CustomerQuickViewDemo />}
            {activeTab === 'map-route-planner' && <MapRoutePlannerDemo />}
            {activeTab === 'mobile-task-management' && <MobileTaskManagementDemo />}
            {activeTab === 'calendar-view' && <CalendarViewDemo />}
            {activeTab === 'photo-documentation' && <PhotoDocumentationDemo />}
            {activeTab === 'quick-activity-log' && <QuickActivityLogDemo />}
            {activeTab === 'calendar-export-dialog' && <CalendarExportDialogDemo />}
            {activeTab === 'financial-flow' && <FinancialFlowDemo />}
            {activeTab === 'mobile-performance' && <MobilePerformanceDemo />}
            {activeTab === 'pwa-validation' && <PWAValidationDemo />}
            {activeTab === 'mileage-log-form' && <MileageLogFormDemo />}
            {activeTab === 'project-cost-form' && <ProjectCostFormDemo />}
            {activeTab === 'time-entry-form' && <TimeEntryFormDemo />}
            {activeTab === 'supplier-form' && <SupplierFormDemo />}
            {activeTab === 'tour-planning-form' && <TourPlanningFormDemo />}
            {activeTab === 'expense-entry-form' && <ExpenseEntryFormDemo />}
            {activeTab === 'expense-list-view' && <ExpenseListViewDemo />}
            {activeTab === 'material-catalog-form' && <MaterialCatalogFormDemo />}
            {activeTab === 'purchase-order-form' && <PurchaseOrderFormDemo />}
            {activeTab === 'supplier-list-view' && <SupplierListViewDemo />}
            {activeTab === 'project-materials-view' && <ProjectMaterialsViewDemo />}
            {activeTab === 'supplier-detail-page' && <SupplierDetailPageDemo />}
            {activeTab === 'tour-detail-view' && <TourDetailViewDemo />}
            {activeTab === 'inn-dashboard' && <INNDashboardDemo />}
            {activeTab === 'data-import-export' && <DataImportExportDemo />}
            {activeTab === 'figma-import-template' && <FigmaImportTemplateDemo />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}