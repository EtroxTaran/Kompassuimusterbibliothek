import { useState, useMemo } from 'react';
import { MainLayout } from './layout/MainLayout';
import { DataProvider, useData } from './providers/DataProvider';

// Dashboard
import { INNDashboardDemo } from './INNDashboard';
import { GFDashboardDemo } from './GFDashboard';
import { ADMDashboardDemo } from './ADMDashboard';
import { PLANDashboardDemo } from './PLANDashboard';
import { KALKDashboardDemo } from './KALKDashboard';
import { BUCHDashboardDemo } from './BUCHDashboard';

// Customers
import { CustomerListDemo } from './CustomerListDemo';
import { LocationListDemo } from './LocationListDemo';
import { ContactListDemo } from './ContactListDemo';
import { CustomerDetailPage } from './CustomerDetailPage';

// Sales
import { OpportunityPipelineDemo } from './OpportunityPipelineDemo';
import { OfferListDemo } from './OfferList';
import { MapRoutePlannerDemo } from './MapRoutePlanner';

// Projects
import { ProjectPortfolioDemo } from './ProjectPortfolioDemo';
import { TimeTrackingList } from './TimeTrackingList';
import { TimeEntryFormDemo } from './TimeEntryForm';
import { ProjectDetailView } from './ProjectDetailView';
import { ProjectMaterialsViewDemo } from './ProjectMaterialsView';
import { SupplierListViewDemo } from './SupplierListView';

// Invoices
import { InvoiceListDemo } from './InvoiceListDemo';
import { PaymentList } from './PaymentList';

// Activities
import { ActivityTimelineDemo } from './ActivityTimelineDemo';
import { TaskDashboard } from './TaskDashboard';
import { CalendarViewDemo } from './CalendarView';

// Settings
import { SettingsPage } from './SettingsPage';

// Placeholder for missing components
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Construction, Lock } from 'lucide-react';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <Card className="w-full h-96 flex flex-col items-center justify-center text-center">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Construction className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Diese Ansicht ist derzeit in Entwicklung. Bitte versuchen Sie es später erneut oder nutzen Sie die verfügbaren Module.
        </p>
        <Button onClick={() => window.history.back()}>Zurück zur Übersicht</Button>
      </CardContent>
    </Card>
  );
}

function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center h-full pt-20">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Zugriff verweigert</h2>
            <p className="text-muted-foreground max-w-md text-center mb-6">
                Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen. Bitte wenden Sie sich an Ihren Administrator.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>Zurück</Button>
        </div>
    );
}

// Wrapper to inject data into Detail Page
function CustomerDetailWrapper({ id, onBack }: { id: string, onBack: () => void }) {
    const { getCustomer } = useData();
    const customer = getCustomer(id);

    if (!customer) return <div>Kunde nicht gefunden</div>;

    return (
        <CustomerDetailPage 
            customer={customer} 
            currentUserRole="ADM" // Mock
            currentUserId="1" // Mock
            onBack={onBack}
        />
    );
}

function ProjectDetailWrapper({ id, userRole }: { id: string, userRole: any }) {
    const { getProject } = useData();
    const project = getProject(id);

    if (!project) return <div>Projekt nicht gefunden</div>;

    return (
        <ProjectDetailView 
            project={project}
            currentUserRole={userRole}
            currentUserId="1"
        />
    );
}

function KompassAppContent() {
  const [activePage, setActivePage] = useState('dashboard-overview');
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Mock User Role
  const userRole: 'GF' | 'ADM' | 'PLAN' | 'KALK' | 'BUCH' = 'ADM';

  const navigate = (page: string, id?: string) => {
      setActivePage(page);
      if (id) setActiveId(id);
      else setActiveId(null);
  };

  // Role Based Routing Logic
  const isAllowed = (page: string) => {
      // Allow all for demo purposes unless specifically restricted
      const permissions: Record<string, string[]> = {
          'dashboard-overview': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'dashboard-gf': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'dashboard-adm': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'dashboard-plan': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'dashboard-kalk': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'dashboard-buch': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'dashboard-tasks': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'dashboard-projects': ['GF', 'ADM', 'PLAN', 'KALK'],
          'rechnungen-list': ['GF', 'BUCH'],
          'zahlungen': ['GF', 'BUCH'],
          // Projects/Procurement allowed for ADM too in demo
          'projekte': ['GF', 'ADM', 'PLAN', 'KALK'],
      };

      // Specific overrides
      if (page === 'zahlungen' && userRole === 'ADM') return false;
      if (page === 'rechnungen-list' && userRole === 'ADM') return false;

      return true; 
  };

  // Navigation mapping
  const renderContent = () => {
    if (!isAllowed(activePage)) return <AccessDenied />;

    if (activePage === 'customer-detail' && activeId) {
        return <CustomerDetailWrapper id={activeId} onBack={() => navigate('kundenliste')} />;
    }
    
    if (activePage === 'project-detail') {
         if (!activeId) return <div>Kein Projekt ausgewählt</div>;
         return <ProjectDetailWrapper id={activeId} userRole={userRole} />;
    }

    switch (activePage) {
      // Dashboard
      case 'dashboard': // Fallback
      case 'dashboard-overview':
        return <INNDashboardDemo onNavigate={(id) => navigate(id)} />;
      case 'dashboard-gf':
        return <GFDashboardDemo />;
      case 'dashboard-adm':
        return <ADMDashboardDemo />;
      case 'dashboard-plan':
        return <PLANDashboardDemo />;
      case 'dashboard-kalk':
        return <KALKDashboardDemo />;
      case 'dashboard-buch':
        return <BUCHDashboardDemo />;
      case 'dashboard-tasks':
        return <TaskDashboard />;
      case 'dashboard-projects':
        return <ProjectPortfolioDemo onProjectClick={(id) => navigate('project-detail', id)} />;
      
      // Kunden
      case 'kundenliste':
        return <CustomerListDemo onCustomerClick={(id) => navigate('customer-detail', id)} />;
      case 'standorte':
        return <LocationListDemo />;
      case 'kontakte':
        return <ContactListDemo />;
      
      // Vertrieb
      case 'opportunities':
        return <OpportunityPipelineDemo />;
      case 'angebote':
        return <OfferListDemo />;
      case 'pipeline':
        return <OpportunityPipelineDemo />;
      case 'touren':
        return <MapRoutePlannerDemo />;
      
      // Projekte
      case 'projektuebersicht':
        return <ProjectPortfolioDemo onProjectClick={(id) => navigate('project-detail', id)} />;
      case 'zeiterfassung':
        return <TimeTrackingList />;
      case 'material':
        return <ProjectMaterialsViewDemo />;
      case 'lieferanten':
        return <SupplierListViewDemo userRole={userRole} />;

      // Rechnungen
      case 'rechnungen-list':
        return <InvoiceListDemo />;
      case 'zahlungen':
        return <PaymentList />;
        
      // Aktivitäten
      case 'protokolle':
        return <ActivityTimelineDemo />;
      case 'aufgaben':
        return <TaskDashboard />;
      case 'kalender':
        return <CalendarViewDemo />;
      
      // Settings
      case 'einstellungen':
        return <SettingsPage />;
        
      default:
        return <INNDashboardDemo />;
    }
  };

  const getBreadcrumbs = () => {
    const base = [{ label: 'Home', href: '#' }];
    
    // Dynamic Breadcrumbs
    if (activePage === 'customer-detail') {
        return [...base, { label: 'Kunden', href: '#' }, { label: 'Kundenliste', href: '#' }, { label: 'Details' }];
    }
    if (activePage === 'project-detail') {
        return [...base, { label: 'Projekte', href: '#' }, { label: 'Übersicht', href: '#' }, { label: 'Details' }];
    }

    const mapping: Record<string, { label: string; href?: string }[]> = {
      'dashboard-overview': [{ label: 'Dashboards' }, { label: 'Übersicht (INN)' }],
      'dashboard-gf': [{ label: 'Dashboards' }, { label: 'Geschäftsführung' }],
      'dashboard-adm': [{ label: 'Dashboards' }, { label: 'Außendienst' }],
      'dashboard-plan': [{ label: 'Dashboards' }, { label: 'Planung' }],
      'dashboard-kalk': [{ label: 'Dashboards' }, { label: 'Kalkulation' }],
      'dashboard-buch': [{ label: 'Dashboards' }, { label: 'Buchhaltung' }],
      'dashboard-tasks': [{ label: 'Dashboards' }, { label: 'Aufgaben' }],
      'dashboard-projects': [{ label: 'Dashboards' }, { label: 'Projekte' }],
      kundenliste: [{ label: 'Kunden' }, { label: 'Kundenliste' }],
      standorte: [{ label: 'Kunden' }, { label: 'Standorte' }],
      kontakte: [{ label: 'Kunden' }, { label: 'Kontakte' }],
      opportunities: [{ label: 'Vertrieb' }, { label: 'Opportunities' }],
      angebote: [{ label: 'Vertrieb' }, { label: 'Angebote' }],
      pipeline: [{ label: 'Vertrieb' }, { label: 'Pipeline' }],
      touren: [{ label: 'Vertrieb' }, { label: 'Tourenplanung' }],
      projektuebersicht: [{ label: 'Projekte' }, { label: 'Übersicht' }],
      zeiterfassung: [{ label: 'Projekte' }, { label: 'Zeiterfassung' }],
      material: [{ label: 'Projekte' }, { label: 'Material & Katalog' }],
      lieferanten: [{ label: 'Projekte' }, { label: 'Lieferanten' }],
      'rechnungen-list': [{ label: 'Rechnungen' }, { label: 'Übersicht' }],
      zahlungen: [{ label: 'Rechnungen' }, { label: 'Zahlungen' }],
      protokolle: [{ label: 'Aktivitäten' }, { label: 'Protokolle' }],
      aufgaben: [{ label: 'Aktivitäten' }, { label: 'Aufgaben' }],
      kalender: [{ label: 'Aktivitäten' }, { label: 'Kalender' }],
      einstellungen: [{ label: 'Einstellungen' }],
    };

    return [...base, ...(mapping[activePage] || [{ label: activePage }])];
  };

  return (
    <MainLayout
      userRole={userRole}
      userName="Michael Schmidt"
      breadcrumbs={getBreadcrumbs()}
      isOffline={false}
      pendingChanges={0}
      activeId={activePage.startsWith('customer-detail') ? 'kundenliste' : activePage.startsWith('project-detail') ? 'projektuebersicht' : activePage}
      onNavigate={(id) => navigate(id)}
    >
      {renderContent()}
    </MainLayout>
  );
}

export function KompassApp() {
    return (
        <KompassAppContent />
    );
}
