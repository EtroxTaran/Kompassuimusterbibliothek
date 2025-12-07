import { useState, useMemo } from 'react';
import { MainLayout } from './layout/MainLayout';
import { DataProvider, useData } from './providers/DataProvider';

// Dashboard
import { INNDashboardDemo } from './INNDashboard';

// Customers
import { CustomerListDemo } from './CustomerListDemo';
import { LocationListDemo } from './LocationListDemo';
import { ContactListDemo } from './ContactListDemo';
import { CustomerDetailPage } from './CustomerDetailPage';

// Sales
import { OpportunityPipelineDemo } from './OpportunityPipelineDemo';
import { OfferListDemo } from './OfferList';

// Projects
import { ProjectPortfolioDemo } from './ProjectPortfolioDemo';
import { TimeTrackingList } from './TimeTrackingList';
import { TimeEntryFormDemo } from './TimeEntryForm';

// Invoices
import { InvoiceListDemo } from './InvoiceListDemo';
import { PaymentList } from './PaymentList';

// Activities
import { ActivityTimelineDemo } from './ActivityTimelineDemo';
import { TaskDashboard } from './TaskDashboard';

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

function KompassAppContent() {
  const [activePage, setActivePage] = useState('dashboard');
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
      const permissions: Record<string, string[]> = {
          'dashboard': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'],
          'rechnungen-list': ['GF', 'BUCH'],
          'zahlungen': ['GF', 'BUCH'],
          'projekte': ['GF', 'ADM', 'PLAN', 'KALK'], // ADM can see projects?
          'einstellungen': ['GF', 'ADM', 'PLAN', 'KALK', 'BUCH'], // Everyone can access settings
          // ... add others
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
    
    // Project Detail placeholder
    if (activePage === 'project-detail' && activeId) {
         return <PlaceholderPage title={`Projekt Details: ${activeId}`} />;
    }

    switch (activePage) {
      // Dashboard
      case 'dashboard':
        return <INNDashboardDemo />;
      
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
      
      // Projekte
      case 'projektuebersicht':
        return <ProjectPortfolioDemo onProjectClick={(id) => navigate('project-detail', id)} />;
      case 'zeiterfassung':
        return <TimeEntryFormDemo />; // Use the full demo which includes the list? No, use TimeTrackingList for list
      case 'zeiterfassung-list': // New key for list
         return <TimeTrackingList />;
      case 'zeiterfassung': // Keep legacy key mapping to list
         return <TimeTrackingList />;
      
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

    const mapping: Record<string, { label: string; href?: string }[]> = {
      dashboard: [{ label: 'Dashboard' }],
      kundenliste: [{ label: 'Kunden' }, { label: 'Kundenliste' }],
      standorte: [{ label: 'Kunden' }, { label: 'Standorte' }],
      kontakte: [{ label: 'Kunden' }, { label: 'Kontakte' }],
      opportunities: [{ label: 'Vertrieb' }, { label: 'Opportunities' }],
      angebote: [{ label: 'Vertrieb' }, { label: 'Angebote' }],
      pipeline: [{ label: 'Vertrieb' }, { label: 'Pipeline' }],
      projektuebersicht: [{ label: 'Projekte' }, { label: 'Übersicht' }],
      zeiterfassung: [{ label: 'Projekte' }, { label: 'Zeiterfassung' }],
      'rechnungen-list': [{ label: 'Rechnungen' }, { label: 'Übersicht' }],
      zahlungen: [{ label: 'Rechnungen' }, { label: 'Zahlungen' }],
      protokolle: [{ label: 'Aktivitäten' }, { label: 'Protokolle' }],
      aufgaben: [{ label: 'Aktivitäten' }, { label: 'Aufgaben' }],
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
      activeId={activePage.startsWith('customer-detail') ? 'kundenliste' : activePage} // Highlight parent in sidebar
      onNavigate={(id) => navigate(id)}
    >
      {renderContent()}
    </MainLayout>
  );
}

export function KompassApp() {
    return (
        <DataProvider>
            <KompassAppContent />
        </DataProvider>
    );
}
