import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Briefcase,
  Building2,
  FileText,
  Plus,
} from 'lucide-react';

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (id: string) => void;
}

export function SearchOverlay({ open, onOpenChange, onNavigate }: SearchOverlayProps) {
  const handleSelect = (id: string) => {
    onNavigate(id);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Suche nach Kunden, Projekten oder Funktionen..." />
      <CommandList>
        <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
        
        <CommandGroup heading="Schnellzugriff">
          <CommandItem onSelect={() => handleSelect('dashboard')}>
            <Briefcase className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('aufgaben')}>
            <Calendar className="mr-2 h-4 w-4" />
            Meine Aufgaben
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('einstellungen')}>
            <Settings className="mr-2 h-4 w-4" />
            Einstellungen
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Kunden">
          <CommandItem onSelect={() => handleSelect('kundenliste')}>
            <Building2 className="mr-2 h-4 w-4" />
            Alle Kunden
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('customer-detail-1')}>
            <User className="mr-2 h-4 w-4" />
            Hofladen Müller GmbH
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('customer-detail-2')}>
            <User className="mr-2 h-4 w-4" />
            REWE Köln Süd
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Aktionen">
          <CommandItem onSelect={() => handleSelect('neuer-kunde')}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Kunde
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('neues-projekt')}>
            <Plus className="mr-2 h-4 w-4" />
            Neues Projekt
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
