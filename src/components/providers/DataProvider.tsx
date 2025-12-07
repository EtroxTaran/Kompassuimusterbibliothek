import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---

export interface Customer {
  id: string;
  companyName: string;
  status: 'active' | 'inactive';
  rating: 'A' | 'B' | 'C' | 'D';
  customerType: string;
  industry: string;
  vatId: string;
  ownerId: string;
  owner: { id: string; name: string; initials: string };
  city: string;
  additionalLocations?: number;
  createdAt: string;
  billingAddress: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  email: string;
  phone: string;
  website?: string;
  creditLimit: number;
  paymentTerms: string;
  outstandingBalance: number;
  notes?: string;
}

export interface Project {
  id: string;
  number: string;
  customer: string;
  customerId: string;
  customerLocation: string;
  name: string;
  status: 'new' | 'planning' | 'inProgress' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  milestones: { completed: number; total: number };
  startDate: string;
  endDate: string;
  budget: number;
  actualCost?: number;
  margin?: number;
  manager: {
    name: string;
    initials: string;
  };
  teamSize: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
  paidAmount: number;
}

// --- Mock Data ---

const mockCustomers: Customer[] = [
  {
    id: '1',
    companyName: 'Hofladen Müller GmbH',
    status: 'active',
    rating: 'A',
    customerType: 'Direktvermarkter',
    industry: 'Landwirtschaft',
    vatId: 'DE123456789',
    ownerId: '1',
    owner: { id: '1', name: 'Michael Schmidt', initials: 'MS' },
    city: 'München',
    additionalLocations: 2,
    createdAt: '2024-10-12',
    billingAddress: {
      street: 'Hauptstraße 15',
      postalCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    email: 'info@hofladen-mueller.de',
    phone: '+49-89-1234567',
    website: 'https://www.hofladen-mueller.de',
    creditLimit: 50000,
    paymentTerms: '30 Tage',
    outstandingBalance: 12500,
    notes: 'VIP-Kunde, bevorzugte Behandlung.',
  },
  {
    id: '2',
    companyName: 'Bäckerei Schmidt',
    status: 'active',
    rating: 'B',
    customerType: 'Filialist',
    industry: 'Lebensmittel',
    vatId: 'DE987654321',
    ownerId: '2',
    owner: { id: '2', name: 'Anna Weber', initials: 'AW' },
    city: 'Augsburg',
    additionalLocations: 5,
    createdAt: '2024-09-15',
    billingAddress: {
      street: 'Bäckerweg 3',
      postalCode: '86150',
      city: 'Augsburg',
      country: 'Deutschland',
    },
    email: 'kontakt@baeckerei-schmidt.de',
    phone: '+49-821-987654',
    creditLimit: 25000,
    paymentTerms: '14 Tage',
    outstandingBalance: 4500,
  },
  {
    id: '3',
    companyName: 'REWE München Süd',
    status: 'active',
    rating: 'A',
    customerType: 'LEH',
    industry: 'Einzelhandel',
    vatId: 'DE112233445',
    ownerId: '1',
    owner: { id: '1', name: 'Michael Schmidt', initials: 'MS' },
    city: 'München',
    createdAt: '2024-11-01',
    billingAddress: {
      street: 'Grünwalder Str. 200',
      postalCode: '81545',
      city: 'München',
      country: 'Deutschland',
    },
    email: 'marktleitung@rewe-muenchen.de',
    phone: '+49-89-555666',
    creditLimit: 100000,
    paymentTerms: '45 Tage',
    outstandingBalance: 0,
  },
];

const mockProjects: Project[] = [
  {
    id: '1',
    number: 'P-2024-B023',
    customer: 'REWE München Süd',
    customerId: '3',
    customerLocation: 'München',
    name: 'Ladeneinrichtung Neueröffnung',
    status: 'inProgress',
    progress: 65,
    milestones: { completed: 12, total: 18 },
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    budget: 450000,
    actualCost: 290000,
    margin: 15.6,
    manager: { name: 'Thomas Fischer', initials: 'TF' },
    teamSize: 5,
  },
  {
    id: '2',
    number: 'P-2024-A015',
    customer: 'Hofladen Müller GmbH',
    customerId: '1',
    customerLocation: 'Augsburg',
    name: 'Renovierung Verkaufsfläche',
    status: 'completed',
    progress: 100,
    milestones: { completed: 8, total: 8 },
    startDate: '2024-09-01',
    endDate: '2024-10-30',
    budget: 85000,
    actualCost: 82000,
    margin: 18.2,
    manager: { name: 'Michael Schmidt', initials: 'MS' },
    teamSize: 3,
  },
];

// --- Context & Provider ---

interface DataContextType {
  customers: Customer[];
  projects: Project[];
  getCustomer: (id: string) => Customer | undefined;
  getProject: (id: string) => Project | undefined;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  // Add other methods as needed
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const getCustomer = (id: string) => customers.find((c) => c.id === id);
  const getProject = (id: string) => projects.find((p) => p.id === id);

  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [...prev, customer]);
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        projects,
        getCustomer,
        getProject,
        addCustomer,
        updateCustomer,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
