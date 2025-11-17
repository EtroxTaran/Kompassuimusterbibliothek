import { useState } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Building2, MapPin, Phone, Mail, Star } from 'lucide-react';
import { Badge } from './ui/badge';

export function SkeletonTransitionDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Button onClick={startLoading} disabled={isLoading}>
        {isLoading ? 'Lädt...' : 'Kundendaten laden'}
      </Button>

      <div className="border border-border rounded-lg p-6 bg-card">
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>

            <Skeleton className="h-6 w-[120px] rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1">Hofladen Müller GmbH</h3>
                <div className="flex items-center gap-1 text-chart-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-current"
                      strokeWidth={0}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Adresse</p>
                  <p>Hauptstraße 15, 10115 Berlin</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Telefon</p>
                  <p>+49 30 12345678</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">E-Mail</p>
                  <p>kontakt@hofladen-mueller.de</p>
                </div>
              </div>
            </div>

            <Badge className="bg-chart-2 text-white hover:bg-chart-2/90">
              Aktiver Kunde
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
