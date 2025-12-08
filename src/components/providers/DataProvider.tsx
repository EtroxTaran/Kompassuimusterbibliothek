import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---

export type LocationType = 'headquarter' | 'branch' | 'warehouse' | 'project' | 'other';
export type LocationStatus = 'active' | 'inactive';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  status: LocationStatus;
  isPrimary: boolean;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  primaryContact?: {
    name: string;
    phone: string;
  };
  additionalContacts?: number;
  deliveryNotes?: string;
  openingHours?: string;
  parkingInfo?: string;
}

export type DecisionRole =
  | 'decision-maker'
  | 'key-influencer'
  | 'recommender'
  | 'gatekeeper'
  | 'operational'
  | 'informational';

export type AuthorityLevel = 'low' | 'medium' | 'high' | 'final';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  position: string;
  decisionRole: DecisionRole;
  authorityLevel: AuthorityLevel;
  approvalLimit?: number;
  phone?: string;
  mobile?: string;
  email: string;
  preferredContact: 'email' | 'phone' | 'mobile';
  functions?: string[];
  assignedLocations: string[];
  isPrimaryContact?: boolean;
  primaryForLocations?: string[];
  lastActivity?: string; // ISO date
  canApprove?: boolean;
}

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
  locations?: Location[];
  contacts?: Contact[];
}

export interface Task {
  id: string;
  number: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'inProgress' | 'completed' | 'blocked';
  progress: number;
  assignedTo?: string; // Initials or name
  dependencies?: string[]; // IDs of tasks this task depends on
}

// Detailed types for Project View
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isProjectLead: boolean;
  avatarUrl?: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
  description: string;
}

export interface BudgetItem {
  category: string;
  planned: number;
  actual: number;
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  hours: number;
  description: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Project {
  id: string;
  number: string;
  customer: string; // Legacy name field for lists
  customerId: string;
  customerLocation: string;
  name: string;
  status: 'new' | 'planning' | 'inProgress' | 'completed' | 'paused' | 'cancelled';
  description?: string;
  
  // Progress & Dates
  progress: number;
  startDate: string;
  endDate: string;
  
  // Financials
  budget: number;
  actualCost?: number; // Optional as it can be calculated from breakdown
  contractValue?: number;
  margin?: number;
  budgetBreakdown?: BudgetItem[];
  
  // Team
  manager: { // Keep for backward compatibility
    name: string;
    initials: string;
  };
  teamSize: number; // Keep for backward compatibility
  team?: TeamMember[];
  projectLeadId?: string;
  
  // Details
  milestones: { completed: number; total: number } | Milestone[]; // Support both for now, prefer array
  tasks: Task[];
  timeEntries?: TimeEntry[];
  documents?: Document[];
  
  opportunityId?: string;
  opportunityTitle?: string;
  createdAt?: string;
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
    locations: [
      {
        id: '1-1',
        name: 'Hauptsitz München',
        type: 'headquarter',
        status: 'active',
        isPrimary: true,
        address: { street: 'Hauptstraße 15', postalCode: '80331', city: 'München', country: 'Deutschland' },
        primaryContact: { name: 'Michael Schmidt', phone: '+49-89-1234567' }
      },
      {
        id: '1-2',
        name: 'Filiale Schwabing',
        type: 'branch',
        status: 'active',
        isPrimary: false,
        address: { street: 'Leopoldstraße 50', postalCode: '80802', city: 'München', country: 'Deutschland' },
      }
    ],
    contacts: [
      {
        id: 'c1-1',
        firstName: 'Michael',
        lastName: 'Schmidt',
        position: 'Geschäftsführer',
        decisionRole: 'decision-maker',
        authorityLevel: 'final',
        email: 'michael.schmidt@hofladen-mueller.de',
        phone: '+49-89-1234567',
        preferredContact: 'email',
        assignedLocations: ['Hauptsitz München'],
        isPrimaryContact: true
      }
    ]
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
    locations: [
       {
        id: '2-1',
        name: 'Bäckerei Schmidt Hauptfiliale',
        type: 'headquarter',
        status: 'active',
        isPrimary: true,
        address: { street: 'Bäckerweg 3', postalCode: '86150', city: 'Augsburg', country: 'Deutschland' },
      }
    ],
    contacts: [
        {
            id: 'c2-1',
            firstName: 'Anna',
            lastName: 'Weber',
            position: 'Inhaberin',
            decisionRole: 'decision-maker',
            authorityLevel: 'final',
            email: 'anna.weber@baeckerei-schmidt.de',
            phone: '+49-821-987654',
            preferredContact: 'phone',
            assignedLocations: ['Bäckerei Schmidt Hauptfiliale'],
            isPrimaryContact: true
        }
    ]
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
    locations: [
         {
            id: '3-1',
            name: 'REWE Markt München Süd',
            type: 'branch',
            status: 'active',
            isPrimary: true,
            address: { street: 'Grünwalder Str. 200', postalCode: '81545', city: 'München', country: 'Deutschland' },
          }
    ],
    contacts: [
        {
            id: 'c3-1',
            firstName: 'Markus',
            lastName: 'Leitner',
            position: 'Marktleiter',
            decisionRole: 'decision-maker',
            authorityLevel: 'high',
            email: 'markus.leitner@rewe.de',
            phone: '+49-89-555666',
            preferredContact: 'email',
            assignedLocations: ['REWE Markt München Süd'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '4',
    companyName: 'Musterladen GmbH',
    status: 'active',
    rating: 'B',
    customerType: 'Einzelhandel',
    industry: 'Lebensmittel',
    vatId: 'DE887766554',
    ownerId: '3',
    owner: { id: '3', name: 'Anna Schmidt', initials: 'AS' },
    city: 'Berlin',
    additionalLocations: 1,
    createdAt: '2024-05-10',
    billingAddress: {
      street: 'Alexanderplatz 5',
      postalCode: '10178',
      city: 'Berlin',
      country: 'Deutschland',
    },
    email: 'kontakt@musterladen-gmbh.de',
    phone: '+49-30-12345678',
    website: 'https://www.musterladen-gmbh.de',
    creditLimit: 30000,
    paymentTerms: '30 Tage',
    outstandingBalance: 1200,
    locations: [
        {
            id: '4-1',
            name: 'Musterladen Berlin Mitte',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
            address: { street: 'Alexanderplatz 5', postalCode: '10178', city: 'Berlin', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c4-1',
            firstName: 'Anna',
            lastName: 'Schmidt',
            position: 'Geschäftsführerin',
            decisionRole: 'decision-maker',
            authorityLevel: 'final',
            email: 'anna.schmidt@musterladen-gmbh.de',
            phone: '+49-30-12345678',
            preferredContact: 'email',
            assignedLocations: ['Musterladen Berlin Mitte'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '5',
    companyName: 'Hofladen & Co.',
    status: 'active',
    rating: 'A',
    customerType: 'Direktvermarkter',
    industry: 'Landwirtschaft',
    vatId: 'DE998877665',
    ownerId: '4',
    owner: { id: '4', name: 'Michael Bauer', initials: 'MB' },
    city: 'Hamburg',
    createdAt: '2024-03-22',
    billingAddress: {
      street: 'Elbchaussee 112',
      postalCode: '22763',
      city: 'Hamburg',
      country: 'Deutschland',
    },
    email: 'info@hofladen-co.de',
    phone: '+49-40-87654321',
    creditLimit: 45000,
    paymentTerms: '14 Tage',
    outstandingBalance: 0,
    notes: 'Spezialisiert auf Bio-Produkte aus dem Alten Land.',
    locations: [
         {
            id: '5-1',
            name: 'Hofladen & Co. Hamburg',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
            address: { street: 'Elbchaussee 112', postalCode: '22763', city: 'Hamburg', country: 'Deutschland' },
         }
    ],
    contacts: [
        {
            id: 'c5-1',
            firstName: 'Michael',
            lastName: 'Bauer',
            position: 'Inhaber',
            decisionRole: 'decision-maker',
            authorityLevel: 'final',
            email: 'michael.bauer@hofladen-co.de',
            phone: '+49-40-87654321',
            preferredContact: 'mobile',
            assignedLocations: ['Hofladen & Co. Hamburg'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '6',
    companyName: 'Vinothek Meyer',
    status: 'active',
    rating: 'A',
    customerType: 'Fachhandel',
    industry: 'Weinhandel',
    vatId: 'DE554433221',
    ownerId: '5',
    owner: { id: '5', name: 'Sabine Fischer', initials: 'SF' },
    city: 'München',
    createdAt: '2024-07-05',
    billingAddress: {
      street: 'Leopoldstraße 45',
      postalCode: '80802',
      city: 'München',
      country: 'Deutschland',
    },
    email: 'genuss@vinothek-meyer.de',
    phone: '+49-89-98765432',
    website: 'https://www.vinothek-meyer.de',
    creditLimit: 60000,
    paymentTerms: '30 Tage',
    outstandingBalance: 5600,
     locations: [
         {
            id: '6-1',
            name: 'Vinothek Meyer Schwabing',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
            address: { street: 'Leopoldstraße 45', postalCode: '80802', city: 'München', country: 'Deutschland' },
         }
    ],
    contacts: [
        {
            id: 'c6-1',
            firstName: 'Sabine',
            lastName: 'Fischer',
            position: 'Sommelière & Inhaberin',
            decisionRole: 'decision-maker',
            authorityLevel: 'final',
            email: 'sabine.fischer@vinothek-meyer.de',
            phone: '+49-89-98765432',
            preferredContact: 'email',
            assignedLocations: ['Vinothek Meyer Schwabing'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '7',
    companyName: 'Gärtnerei Huber',
    status: 'active',
    rating: 'C',
    customerType: 'Gartenbau',
    industry: 'Gartenbau',
    vatId: 'DE111222333',
    ownerId: '6',
    owner: { id: '6', name: 'Thomas Huber', initials: 'TH' },
    city: 'Köln',
    createdAt: '2024-04-12',
    billingAddress: {
      street: 'Domstraße 7',
      postalCode: '50668',
      city: 'Köln',
      country: 'Deutschland',
    },
    email: 'buero@gaertnerei-huber.de',
    phone: '+49-221-123456',
    creditLimit: 15000,
    paymentTerms: 'Vorkasse',
    outstandingBalance: 0,
    locations: [
        {
            id: '7-1',
            name: 'Gärtnerei Huber Köln',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Domstraße 7', postalCode: '50668', city: 'Köln', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c7-1',
            firstName: 'Thomas',
            lastName: 'Huber',
            position: 'Gärtnermeister',
            decisionRole: 'decision-maker',
            authorityLevel: 'final',
            email: 'thomas.huber@gaertnerei-huber.de',
            phone: '+49-221-123456',
            preferredContact: 'phone',
            assignedLocations: ['Gärtnerei Huber Köln'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '8',
    companyName: 'Biohof Schmidt',
    status: 'active',
    rating: 'A',
    customerType: 'Direktvermarkter',
    industry: 'Landwirtschaft',
    vatId: 'DE444555666',
    ownerId: '7',
    owner: { id: '7', name: 'Lisa Schmidt', initials: 'LS' },
    city: 'Frankfurt',
    createdAt: '2024-08-18',
    billingAddress: {
      street: 'Mainzer Landstraße 123',
      postalCode: '60327',
      city: 'Frankfurt',
      country: 'Deutschland',
    },
    email: 'hallo@biohof-schmidt.de',
    phone: '+49-69-1234567',
    creditLimit: 40000,
    paymentTerms: '14 Tage',
    outstandingBalance: 2300,
    locations: [
        {
            id: '8-1',
            name: 'Biohof Schmidt Frankfurt',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Mainzer Landstraße 123', postalCode: '60327', city: 'Frankfurt', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
             id: 'c8-1',
            firstName: 'Lisa',
            lastName: 'Schmidt',
            position: 'Betriebsleiterin',
            decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'lisa.schmidt@biohof-schmidt.de',
            phone: '+49-69-1234567',
             preferredContact: 'email',
             assignedLocations: ['Biohof Schmidt Frankfurt'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '9',
    companyName: 'Landmarkt Klein',
    status: 'inactive',
    rating: 'D',
    customerType: 'Einzelhandel',
    industry: 'Lebensmittel',
    vatId: 'DE777888999',
    ownerId: '8',
    owner: { id: '8', name: 'Peter Klein', initials: 'PK' },
    city: 'Stuttgart',
    createdAt: '2024-01-30',
    billingAddress: {
      street: 'Königstraße 77',
      postalCode: '70173',
      city: 'Stuttgart',
      country: 'Deutschland',
    },
    email: 'info@landmarkt-klein.de',
    phone: '+49-711-987654',
    creditLimit: 5000,
    paymentTerms: 'Sofort',
    outstandingBalance: 800,
    notes: 'Kunde ist momentan inaktiv wegen Umbau.',
    locations: [
        {
            id: '9-1',
            name: 'Landmarkt Klein Stuttgart',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
            address: { street: 'Königstraße 77', postalCode: '70173', city: 'Stuttgart', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
             id: 'c9-1',
            firstName: 'Peter',
            lastName: 'Klein',
            position: 'Geschäftsführer',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'peter.klein@landmarkt-klein.de',
             phone: '+49-711-987654',
            preferredContact: 'phone',
             assignedLocations: ['Landmarkt Klein Stuttgart'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '10',
    companyName: 'Feinkost Müller',
    status: 'active',
    rating: 'A',
    customerType: 'Fachhandel',
    industry: 'Feinkost',
    vatId: 'DE666555444',
    ownerId: '9',
    owner: { id: '9', name: 'Claudia Müller', initials: 'CM' },
    city: 'Düsseldorf',
    createdAt: '2024-06-15',
    billingAddress: {
      street: 'Königsallee 34',
      postalCode: '40212',
      city: 'Düsseldorf',
      country: 'Deutschland',
    },
    email: 'kontakt@feinkost-mueller.de',
    phone: '+49-211-123456',
    creditLimit: 75000,
    paymentTerms: '30 Tage',
    outstandingBalance: 15000,
    locations: [
        {
            id: '10-1',
            name: 'Feinkost Müller Kö',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Königsallee 34', postalCode: '40212', city: 'Düsseldorf', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
             id: 'c10-1',
            firstName: 'Claudia',
            lastName: 'Müller',
            position: 'Inhaberin',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'claudia.mueller@feinkost-mueller.de',
            phone: '+49-211-123456',
             preferredContact: 'email',
             assignedLocations: ['Feinkost Müller Kö'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '11',
    companyName: 'Wein & Genuss',
    status: 'active',
    rating: 'B',
    customerType: 'Fachhandel',
    industry: 'Weinhandel',
    vatId: 'DE333222111',
    ownerId: '10',
    owner: { id: '10', name: 'Florian Weber', initials: 'FW' },
    city: 'Bremen',
    createdAt: '2024-02-20',
    billingAddress: {
      street: 'Am Wall 89',
      postalCode: '28195',
      city: 'Bremen',
      country: 'Deutschland',
    },
    email: 'info@wein-genuss-bremen.de',
    phone: '+49-421-123456',
    creditLimit: 20000,
    paymentTerms: '14 Tage',
    outstandingBalance: 0,
    locations: [
         {
            id: '11-1',
            name: 'Wein & Genuss Bremen',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
            address: { street: 'Am Wall 89', postalCode: '28195', city: 'Bremen', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c11-1',
             firstName: 'Florian',
            lastName: 'Weber',
             position: 'Inhaber',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'florian.weber@wein-genuss-bremen.de',
            phone: '+49-421-123456',
             preferredContact: 'email',
            assignedLocations: ['Wein & Genuss Bremen'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '12',
    companyName: 'Naturkostladen Grün',
    status: 'active',
    rating: 'B',
    customerType: 'Einzelhandel',
    industry: 'Bio-Lebensmittel',
    vatId: 'DE999000111',
    ownerId: '11',
    owner: { id: '11', name: 'Andreas Grün', initials: 'AG' },
    city: 'Hannover',
    createdAt: '2024-09-01',
    billingAddress: {
      street: 'Georgstraße 11',
      postalCode: '30159',
      city: 'Hannover',
      country: 'Deutschland',
    },
    email: 'laden@naturkost-gruen.de',
    phone: '+49-511-123456',
    creditLimit: 25000,
    paymentTerms: '14 Tage',
    outstandingBalance: 450,
     locations: [
        {
            id: '12-1',
            name: 'Naturkostladen Grün Hannover',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Georgstraße 11', postalCode: '30159', city: 'Hannover', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c12-1',
             firstName: 'Andreas',
            lastName: 'Grün',
             position: 'Inhaber',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'andreas.gruen@naturkost-gruen.de',
            phone: '+49-511-123456',
             preferredContact: 'email',
             assignedLocations: ['Naturkostladen Grün Hannover'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '13',
    companyName: 'Bauernmarkt Seidel',
    status: 'active',
    rating: 'C',
    customerType: 'Direktvermarkter',
    industry: 'Landwirtschaft',
    vatId: 'DE222333444',
    ownerId: '12',
    owner: { id: '12', name: 'Ulrich Seidel', initials: 'US' },
    city: 'Leipzig',
    createdAt: '2024-10-05',
    billingAddress: {
      street: 'Markt 3',
      postalCode: '04109',
      city: 'Leipzig',
      country: 'Deutschland',
    },
    email: 'info@bauernmarkt-seidel.de',
    phone: '+49-341-123456',
    creditLimit: 10000,
    paymentTerms: '14 Tage',
    outstandingBalance: 0,
    locations: [
        {
            id: '13-1',
            name: 'Bauernmarkt Seidel Leipzig',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Markt 3', postalCode: '04109', city: 'Leipzig', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c13-1',
            firstName: 'Ulrich',
            lastName: 'Seidel',
             position: 'Inhaber',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'ulrich.seidel@bauernmarkt-seidel.de',
            phone: '+49-341-123456',
             preferredContact: 'phone',
             assignedLocations: ['Bauernmarkt Seidel Leipzig'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '14',
    companyName: 'Hofladen am See',
    status: 'active',
    rating: 'A',
    customerType: 'Direktvermarkter',
    industry: 'Landwirtschaft',
    vatId: 'DE555666777',
    ownerId: '13',
    owner: { id: '13', name: 'Karin Richter', initials: 'KR' },
    city: 'Rostock',
    createdAt: '2024-05-30',
    billingAddress: {
      street: 'Seestraße 22',
      postalCode: '18055',
      city: 'Rostock',
      country: 'Deutschland',
    },
    email: 'kontakt@hofladen-am-see.de',
    phone: '+49-381-123456',
    creditLimit: 35000,
    paymentTerms: '30 Tage',
    outstandingBalance: 200,
    notes: 'Saisonale Angebote beachten.',
    locations: [
        {
            id: '14-1',
            name: 'Hofladen am See Rostock',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Seestraße 22', postalCode: '18055', city: 'Rostock', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c14-1',
             firstName: 'Karin',
            lastName: 'Richter',
             position: 'Inhaberin',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'karin.richter@hofladen-am-see.de',
            phone: '+49-381-123456',
             preferredContact: 'email',
             assignedLocations: ['Hofladen am See Rostock'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '15',
    companyName: 'Vinothek Schneider',
    status: 'active',
    rating: 'B',
    customerType: 'Fachhandel',
    industry: 'Weinhandel',
    vatId: 'DE888999000',
    ownerId: '14',
    owner: { id: '14', name: 'Jens Schneider', initials: 'JS' },
    city: 'Nürnberg',
    createdAt: '2024-03-15',
    billingAddress: {
      street: 'Hauptmarkt 14',
      postalCode: '90403',
      city: 'Nürnberg',
      country: 'Deutschland',
    },
    email: 'info@vinothek-schneider.de',
    phone: '+49-911-123456',
    creditLimit: 22000,
    paymentTerms: '14 Tage',
    outstandingBalance: 1200,
    locations: [
        {
            id: '15-1',
            name: 'Vinothek Schneider Nürnberg',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Hauptmarkt 14', postalCode: '90403', city: 'Nürnberg', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c15-1',
             firstName: 'Jens',
            lastName: 'Schneider',
             position: 'Sommelier & Inhaber',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'jens.schneider@vinothek-schneider.de',
            phone: '+49-911-123456',
             preferredContact: 'email',
             assignedLocations: ['Vinothek Schneider Nürnberg'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '16',
    companyName: 'Gärtnerei Sommerfeld',
    status: 'active',
    rating: 'A',
    customerType: 'Gartenbau',
    industry: 'Gartenbau',
    vatId: 'DE123123123',
    ownerId: '15',
    owner: { id: '15', name: 'Eva Sommerfeld', initials: 'ES' },
    city: 'Dortmund',
    createdAt: '2024-04-25',
    billingAddress: {
      street: 'Westenhellweg 60',
      postalCode: '44137',
      city: 'Dortmund',
      country: 'Deutschland',
    },
    email: 'blumen@sommerfeld.de',
    phone: '+49-231-123456',
    creditLimit: 28000,
    paymentTerms: '30 Tage',
    outstandingBalance: 0,
     locations: [
        {
            id: '16-1',
            name: 'Gärtnerei Sommerfeld Dortmund',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Westenhellweg 60', postalCode: '44137', city: 'Dortmund', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c16-1',
             firstName: 'Eva',
            lastName: 'Sommerfeld',
             position: 'Gärtnermeisterin',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'eva.sommerfeld@sommerfeld.de',
            phone: '+49-231-123456',
             preferredContact: 'email',
             assignedLocations: ['Gärtnerei Sommerfeld Dortmund'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '17',
    companyName: 'Obst- und Gemüseladen Frisch',
    status: 'active',
    rating: 'C',
    customerType: 'Einzelhandel',
    industry: 'Lebensmittel',
    vatId: 'DE456456456',
    ownerId: '16',
    owner: { id: '16', name: 'Manfred Frisch', initials: 'MF' },
    city: 'Essen',
    createdAt: '2024-08-08',
    billingAddress: {
      street: 'Limbecker Platz 5',
      postalCode: '45127',
      city: 'Essen',
      country: 'Deutschland',
    },
    email: 'info@frisch-essen.de',
    phone: '+49-201-123456',
    creditLimit: 12000,
    paymentTerms: 'Sofort',
    outstandingBalance: 350,
    locations: [
        {
            id: '17-1',
            name: 'Obst & Gemüse Frisch Essen',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Limbecker Platz 5', postalCode: '45127', city: 'Essen', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c17-1',
             firstName: 'Manfred',
            lastName: 'Frisch',
             position: 'Inhaber',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'manfred.frisch@frisch-essen.de',
            phone: '+49-201-123456',
             preferredContact: 'phone',
             assignedLocations: ['Obst & Gemüse Frisch Essen'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '18',
    companyName: 'Feinkost Delikat',
    status: 'active',
    rating: 'A',
    customerType: 'Fachhandel',
    industry: 'Feinkost',
    vatId: 'DE789789789',
    ownerId: '17',
    owner: { id: '17', name: 'Dieter Lang', initials: 'DL' },
    city: 'Bonn',
    createdAt: '2024-01-20',
    billingAddress: {
      street: 'Münsterplatz 8',
      postalCode: '53111',
      city: 'Bonn',
      country: 'Deutschland',
    },
    email: 'genuss@feinkost-delikat.de',
    phone: '+49-228-123456',
    creditLimit: 55000,
    paymentTerms: '30 Tage',
    outstandingBalance: 8900,
    locations: [
        {
            id: '18-1',
            name: 'Feinkost Delikat Bonn',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Münsterplatz 8', postalCode: '53111', city: 'Bonn', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
             id: 'c18-1',
            firstName: 'Dieter',
            lastName: 'Lang',
            position: 'Inhaber',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'dieter.lang@feinkost-delikat.de',
            phone: '+49-228-123456',
             preferredContact: 'email',
             assignedLocations: ['Feinkost Delikat Bonn'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '19',
    companyName: 'Winzerhof Becker',
    status: 'active',
    rating: 'B',
    customerType: 'Direktvermarkter',
    industry: 'Weinbau',
    vatId: 'DE321321321',
    ownerId: '18',
    owner: { id: '18', name: 'Harald Becker', initials: 'HB' },
    city: 'Freiburg',
    createdAt: '2024-06-30',
    billingAddress: {
      street: 'Kaiser-Joseph-Straße 18',
      postalCode: '79098',
      city: 'Freiburg',
      country: 'Deutschland',
    },
    email: 'wein@winzerhof-becker.de',
    phone: '+49-761-123456',
    creditLimit: 18000,
    paymentTerms: '14 Tage',
    outstandingBalance: 0,
    locations: [
        {
            id: '19-1',
            name: 'Winzerhof Becker Freiburg',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Kaiser-Joseph-Straße 18', postalCode: '79098', city: 'Freiburg', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c19-1',
             firstName: 'Harald',
            lastName: 'Becker',
             position: 'Winzer',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'harald.becker@winzerhof-becker.de',
            phone: '+49-761-123456',
             preferredContact: 'phone',
             assignedLocations: ['Winzerhof Becker Freiburg'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '20',
    companyName: 'Hofladen Urban',
    status: 'active',
    rating: 'B',
    customerType: 'Direktvermarkter',
    industry: 'Landwirtschaft',
    vatId: 'DE654654654',
    ownerId: '19',
    owner: { id: '19', name: 'Birgit Urban', initials: 'BU' },
    city: 'Heidelberg',
    createdAt: '2024-09-12',
    billingAddress: {
      street: 'Hauptstraße 30',
      postalCode: '69117',
      city: 'Heidelberg',
      country: 'Deutschland',
    },
    email: 'info@hofladen-urban.de',
    phone: '+49-6221-123456',
    creditLimit: 24000,
    paymentTerms: '14 Tage',
    outstandingBalance: 600,
    locations: [
        {
            id: '20-1',
            name: 'Hofladen Urban Heidelberg',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Hauptstraße 30', postalCode: '69117', city: 'Heidelberg', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c20-1',
             firstName: 'Birgit',
            lastName: 'Urban',
             position: 'Inhaberin',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'birgit.urban@hofladen-urban.de',
            phone: '+49-6221-123456',
             preferredContact: 'phone',
             assignedLocations: ['Hofladen Urban Heidelberg'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '21',
    companyName: 'Gärtnerei Blütezeit',
    status: 'active',
    rating: 'C',
    customerType: 'Gartenbau',
    industry: 'Gartenbau',
    vatId: 'DE987987987',
    ownerId: '20',
    owner: { id: '20', name: 'Markus Blum', initials: 'MB' },
    city: 'Wiesbaden',
    createdAt: '2024-03-05',
    billingAddress: {
      street: 'Wilhelmstraße 48',
      postalCode: '65183',
      city: 'Wiesbaden',
      country: 'Deutschland',
    },
    email: 'blumen@bluetezeit-wiesbaden.de',
    phone: '+49-611-123456',
    creditLimit: 12000,
    paymentTerms: 'Vorkasse',
    outstandingBalance: 0,
    locations: [
        {
            id: '21-1',
            name: 'Gärtnerei Blütezeit Wiesbaden',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Wilhelmstraße 48', postalCode: '65183', city: 'Wiesbaden', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
             id: 'c21-1',
            firstName: 'Markus',
            lastName: 'Blum',
            position: 'Gärtner',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'markus.blum@bluetezeit-wiesbaden.de',
            phone: '+49-611-123456',
             preferredContact: 'email',
             assignedLocations: ['Gärtnerei Blütezeit Wiesbaden'],
            isPrimaryContact: true
        }
    ]
  },
  {
    id: '22',
    companyName: 'Vinothek König',
    status: 'active',
    rating: 'A',
    customerType: 'Fachhandel',
    industry: 'Weinhandel',
    vatId: 'DE147258369',
    ownerId: '21',
    owner: { id: '21', name: 'Stefan König', initials: 'SK' },
    city: 'Karlsruhe',
    createdAt: '2024-07-22',
    billingAddress: {
      street: 'Kaiserstraße 65',
      postalCode: '76133',
      city: 'Karlsruhe',
      country: 'Deutschland',
    },
    email: 'info@vinothek-koenig.de',
    phone: '+49-721-123456',
    creditLimit: 42000,
    paymentTerms: '30 Tage',
    outstandingBalance: 2100,
     locations: [
        {
            id: '22-1',
            name: 'Vinothek König Karlsruhe',
            type: 'headquarter',
            status: 'active',
            isPrimary: true,
             address: { street: 'Kaiserstraße 65', postalCode: '76133', city: 'Karlsruhe', country: 'Deutschland' },
        }
    ],
    contacts: [
        {
            id: 'c22-1',
             firstName: 'Stefan',
            lastName: 'König',
             position: 'Inhaber',
             decisionRole: 'decision-maker',
            authorityLevel: 'final',
             email: 'stefan.koenig@vinothek-koenig.de',
            phone: '+49-721-123456',
             preferredContact: 'email',
             assignedLocations: ['Vinothek König Karlsruhe'],
            isPrimaryContact: true
        }
    ]
  },
];

const mockProjects: Project[] = [
  {
    id: '1',
    number: 'P-2025-B023',
    customer: 'REWE München Süd',
    customerId: '3',
    customerLocation: 'München',
    name: 'Ladeneinrichtung Neueröffnung',
    status: 'inProgress',
    description: 'Komplette Ladeneinrichtung für neue REWE Filiale in München Süd. Umfasst Kühlsysteme, Regale, Beleuchtung, Kassensysteme und alle notwendigen Montagearbeiten. Projekt muss bis Ende Februar 2026 abgeschlossen sein für geplante Eröffnung im März.',
    opportunityId: '1',
    opportunityTitle: 'Ladeneinrichtung Neueröffnung',
    progress: 65,
    milestones: [
        { id: 'm1', name: 'Vertragsunterzeichnung', date: '2025-11-01', status: 'completed', description: 'Vertrag mit Kunde unterzeichnet' },
        { id: 'm2', name: 'Planung abgeschlossen', date: '2025-11-15', status: 'completed', description: 'Detailplanung fertiggestellt' },
        { id: 'm3', name: 'Material bestellt', date: '2025-11-20', status: 'completed', description: 'Alle Materialien bestellt' },
        { id: 'm4', name: 'Montage begonnen', date: '2026-01-08', status: 'completed', description: 'Beginn der Montagearbeiten' },
        { id: 'm5', name: 'Kühlsysteme installiert', date: '2026-01-22', status: 'pending', description: 'Installation Kühlsysteme' },
        { id: 'm6', name: 'Endabnahme', date: '2026-02-25', status: 'pending', description: 'Finale Abnahme' },
    ],
    startDate: '2025-11-01',
    endDate: '2026-02-28',
    budget: 380000,
    contractValue: 450000,
    actualCost: 290000,
    margin: 70000,
    budgetBreakdown: [
        { category: 'Material', planned: 200000, actual: 185000 },
        { category: 'Personal', planned: 120000, actual: 95000 },
        { category: 'Fremdleistungen', planned: 50000, actual: 48000 },
        { category: 'Sonstiges', planned: 10000, actual: 7500 },
    ],
    manager: { name: 'Thomas Fischer', initials: 'TF' },
    projectLeadId: '1',
    teamSize: 5,
    team: [
        { id: '1', name: 'Thomas Fischer', role: 'Projektleiter', email: 't.fischer@kompass.de', phone: '+49 89 1234 5601', isProjectLead: true },
        { id: '2', name: 'Anna Weber', role: 'Kalkulation', email: 'a.weber@kompass.de', phone: '+49 89 1234 5602', isProjectLead: false },
        { id: '3', name: 'Michael Schmidt', role: 'Montage', email: 'm.schmidt@kompass.de', phone: '+49 89 1234 5603', isProjectLead: false },
        { id: '4', name: 'Sarah Müller', role: 'Administration', email: 's.mueller@kompass.de', phone: '+49 89 1234 5604', isProjectLead: false },
    ],
    timeEntries: [
        { id: 'te1', userId: '1', userName: 'Thomas Fischer', date: '2026-01-10', hours: 8, description: 'Projektleitung, Baustellenbegehung' },
        { id: 'te2', userId: '3', userName: 'Michael Schmidt', date: '2026-01-10', hours: 9, description: 'Montagearbeiten Regalaufbau' },
    ],
    documents: [
        { id: 'd1', name: 'Vertrag_REWE.pdf', type: 'Vertrag', size: '1.2 MB', uploadedAt: '2025-11-01', uploadedBy: 'Thomas Fischer' },
        { id: 'd2', name: 'Planung.dwg', type: 'Plan', size: '8.5 MB', uploadedAt: '2025-11-15', uploadedBy: 'Anna Weber' },
    ],
    tasks: [
      { id: 't1-1', number: 'T-001', name: 'Planung & Genehmigung', startDate: '2025-11-01', endDate: '2025-11-15', status: 'completed', progress: 100, assignedTo: 'TF' },
      { id: 't1-2', number: 'T-002', name: 'Bodenarbeiten', startDate: '2025-11-16', endDate: '2025-12-10', status: 'completed', progress: 100, assignedTo: 'EXT', dependencies: ['t1-1'] },
      { id: 't1-3', number: 'T-003', name: 'Trockenbau & Wände', startDate: '2025-12-05', endDate: '2025-12-23', status: 'completed', progress: 100, assignedTo: 'EXT', dependencies: ['t1-2'] },
      { id: 't1-4', number: 'T-004', name: 'Elektroinstallation Roh', startDate: '2025-12-15', endDate: '2026-01-10', status: 'inProgress', progress: 80, assignedTo: 'MS', dependencies: ['t1-3'] },
      { id: 't1-5', number: 'T-005', name: 'Regalmontage', startDate: '2026-01-15', endDate: '2026-02-15', status: 'pending', progress: 0, assignedTo: 'Team A', dependencies: ['t1-4'] },
      { id: 't1-6', number: 'T-006', name: 'Kühlmöbel Installation', startDate: '2026-01-20', endDate: '2026-02-10', status: 'pending', progress: 0, assignedTo: 'Team B', dependencies: ['t1-4'] },
      { id: 't1-7', number: 'T-007', name: 'Endreinigung & Übergabe', startDate: '2026-02-25', endDate: '2026-02-28', status: 'pending', progress: 0, assignedTo: 'TF', dependencies: ['t1-5', 't1-6'] },
    ],
    createdAt: '2025-11-01',
  },
  {
    id: '2',
    number: 'P-2025-A015',
    customer: 'Hofladen Müller GmbH',
    customerId: '1',
    customerLocation: 'Augsburg',
    name: 'Renovierung Verkaufsfläche',
    status: 'completed',
    description: 'Renovierung der Verkaufsfläche inkl. neuer Beleuchtung und Malerarbeiten.',
    progress: 100,
    milestones: { completed: 8, total: 8 }, // Use simple format for other projects
    startDate: '2025-09-01',
    endDate: '2025-10-30',
    budget: 85000,
    contractValue: 95000,
    actualCost: 82000,
    margin: 13000,
    manager: { name: 'Michael Schmidt', initials: 'MS' },
    teamSize: 3,
    tasks: [
      { id: 't2-1', number: 'T-010', name: 'Abriss Altbestand', startDate: '2025-09-01', endDate: '2025-09-10', status: 'completed', progress: 100, assignedTo: 'MS' },
      { id: 't2-2', number: 'T-011', name: 'Malerarbeiten', startDate: '2025-09-12', endDate: '2025-09-25', status: 'completed', progress: 100, assignedTo: 'Team A', dependencies: ['t2-1'] },
      { id: 't2-3', number: 'T-012', name: 'Beleuchtung Erneuerung', startDate: '2025-09-20', endDate: '2025-10-05', status: 'completed', progress: 100, assignedTo: 'MS', dependencies: ['t2-1'] },
      { id: 't2-4', number: 'T-013', name: 'Möbelaufbau', startDate: '2025-10-06', endDate: '2025-10-25', status: 'completed', progress: 100, assignedTo: 'EXT', dependencies: ['t2-2', 't2-3'] },
      { id: 't2-5', number: 'T-014', name: 'Abnahme', startDate: '2025-10-28', endDate: '2025-10-30', status: 'completed', progress: 100, assignedTo: 'MS', dependencies: ['t2-4'] },
    ],
    createdAt: '2025-09-01',
  },
  {
    id: '3',
    number: 'P-2025-C008',
    customer: 'Bäckerei Schmidt',
    customerId: '2',
    customerLocation: 'Augsburg',
    name: 'Neubau Filiale West',
    status: 'planning',
    progress: 15,
    milestones: { completed: 2, total: 12 },
    startDate: '2026-01-15',
    endDate: '2026-05-30',
    budget: 220000,
    contractValue: 260000,
    actualCost: 15000,
    margin: 40000,
    manager: { name: 'Anna Weber', initials: 'AW' },
    teamSize: 4,
    tasks: [
      { id: 't3-1', number: 'T-020', name: 'Bauantrag & Genehmigung', startDate: '2026-01-15', endDate: '2026-02-28', status: 'inProgress', progress: 40, assignedTo: 'AW' },
      { id: 't3-2', number: 'T-021', name: 'Rohbau', startDate: '2026-03-01', endDate: '2026-04-15', status: 'pending', progress: 0, assignedTo: 'EXT', dependencies: ['t3-1'] },
      { id: 't3-3', number: 'T-022', name: 'Innenausbau', startDate: '2026-04-10', endDate: '2026-05-20', status: 'pending', progress: 0, assignedTo: 'Team B', dependencies: ['t3-2'] },
      { id: 't3-4', number: 'T-023', name: 'Fassadengestaltung', startDate: '2026-05-01', endDate: '2026-05-25', status: 'pending', progress: 0, assignedTo: 'EXT', dependencies: ['t3-2'] },
    ]
  },
  {
    id: '4',
    number: 'P-2025-D042',
    customer: 'BioMarkt Grün',
    customerId: '4',
    customerLocation: 'Stuttgart',
    name: 'Regalsysteme Rollout',
    status: 'inProgress',
    progress: 45,
    milestones: { completed: 4, total: 10 },
    startDate: '2025-12-01',
    endDate: '2026-01-31',
    budget: 120000,
    contractValue: 150000,
    actualCost: 55000,
    margin: 30000,
    manager: { name: 'Markus Lang', initials: 'ML' },
    teamSize: 6,
    tasks: [
      { id: 't4-1', number: 'T-030', name: 'Materiallieferung', startDate: '2025-12-01', endDate: '2025-12-05', status: 'completed', progress: 100, assignedTo: 'ML' },
      { id: 't4-2', number: 'T-031', name: 'Montage Team 1', startDate: '2025-12-06', endDate: '2025-12-20', status: 'completed', progress: 100, assignedTo: 'Team A', dependencies: ['t4-1'] },
      { id: 't4-3', number: 'T-032', name: 'Montage Team 2', startDate: '2025-12-10', endDate: '2025-12-23', status: 'inProgress', progress: 80, assignedTo: 'Team B', dependencies: ['t4-1'] },
      { id: 't4-4', number: 'T-033', name: 'Qualitätsprüfung', startDate: '2026-01-10', endDate: '2026-01-15', status: 'pending', progress: 0, assignedTo: 'ML', dependencies: ['t4-2', 't4-3'] },
      { id: 't4-5', number: 'T-034', name: 'Restarbeiten', startDate: '2026-01-16', endDate: '2026-01-30', status: 'pending', progress: 0, assignedTo: 'Team A', dependencies: ['t4-4'] },
    ]
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
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
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

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
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
        addProject,
        updateProject,
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
