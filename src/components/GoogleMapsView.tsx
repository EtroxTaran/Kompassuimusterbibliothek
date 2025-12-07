import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { CustomerLocation, RouteStop } from './MapRoutePlanner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Loader2, Map as MapIcon, Key } from 'lucide-react';

interface GoogleMapsViewProps {
  customers: CustomerLocation[];
  routeStops: RouteStop[];
  onMarkerClick: (customer: CustomerLocation) => void;
  userLocation?: { lat: number; lng: number };
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 48.137154, // Munich
  lng: 11.576124,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// Internal component to handle the actual map logic
// This component is only rendered when we have a valid API key
function MapComponent({
  apiKey,
  customers,
  routeStops,
  onMarkerClick,
  userLocation,
  onClearKey
}: GoogleMapsViewProps & { apiKey: string, onClearKey: () => void }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    preventGoogleFontsLoading: true,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Monitor for global auth errors
  useEffect(() => {
    const handleAuthFailure = () => {
      setAuthError("Google Maps Authentifizierungsfehler: Bitte prüfen Sie Ihren API Key und die Google Cloud Console Einstellungen (Maps JavaScript API muss aktiviert sein).");
    };

    window.gm_authFailure = handleAuthFailure;

    return () => {
      window.gm_authFailure = () => {};
    };
  }, []);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Calculate route path from stops
  const routePath = routeStops
    .map((stop) => {
      if (stop.type === 'current') return userLocation || defaultCenter;
      return stop.location ? { lat: stop.location.lat, lng: stop.location.lng } : null;
    })
    .filter((loc): loc is { lat: number; lng: number } => loc !== null);

  if (loadError || authError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/30">
        <div className="text-center p-4">
          <MapIcon className="h-10 w-10 text-destructive mx-auto mb-2" />
          <p className="font-semibold text-destructive">Fehler beim Laden der Karte</p>
          <p className="text-xs text-muted-foreground mt-2 max-w-[400px] break-words mx-auto">
            {authError || loadError?.message}
          </p>
          {authError && (
            <p className="text-[10px] text-muted-foreground mt-1 mb-2">
              Hinweis: ApiProjectMapError bedeutet oft, dass die "Maps JavaScript API" im Google Cloud Projekt nicht aktiviert ist.
            </p>
          )}
          <Button variant="link" onClick={onClearKey} className="mt-2">
            API Key zurücksetzen
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#2563eb',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title="Ihr Standort"
          />
        )}

        {/* Customer Markers */}
        {customers.map((customer) => (
          <Marker
            key={customer.id}
            position={{ lat: customer.lat, lng: customer.lng }}
            onClick={() => onMarkerClick(customer)}
            // Determine icon based on status
            icon={
               customer.status === 'overdue' 
                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                : customer.hasOpportunity
                ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
          />
        ))}

        {/* Route Path */}
        {routePath.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#2563eb',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>

      {/* API Key Reset Control (Hidden in corner) */}
      <div className="absolute bottom-1 left-1 opacity-50 hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-[10px] bg-white/80" 
          onClick={onClearKey}
        >
          API Key ändern
        </Button>
      </div>
    </div>
  );
}

export function GoogleMapsView({
  customers,
  routeStops,
  onMarkerClick,
  userLocation = defaultCenter,
}: GoogleMapsViewProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  
  // This helps clean up dirty input if the user pasted weird stuff
  const cleanApiKey = (key: string) => {
    // If the key contains "YOUR_API_KEY_HERE=", try to extract the part after it
    if (key.includes('=')) {
      const parts = key.split('=');
      // Return the last part which is likely the key
      return parts[parts.length - 1].trim();
    }
    return key.trim();
  };

  // Load API key from local storage on mount
  useEffect(() => {
    let envKey = '';
    try {
      // Safely access env vars
      envKey = import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY || '';
    } catch (e) {
      console.warn('Could not read env vars', e);
    }
    
    const savedKey = localStorage.getItem('google_maps_api_key');
    
    // Check if envKey is valid and not the placeholder
    if (envKey && !envKey.includes('YOUR_API_KEY_HERE')) {
      setApiKey(cleanApiKey(envKey));
      setIsKeySaved(true);
    } 
    // If envKey is weird (like the error showed), try to clean it
    else if (envKey && envKey.includes('YOUR_API_KEY_HERE=')) {
       setApiKey(cleanApiKey(envKey));
       setIsKeySaved(true);
    }
    else if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      const cleaned = cleanApiKey(apiKey);
      localStorage.setItem('google_maps_api_key', cleaned);
      setApiKey(cleaned);
      setIsKeySaved(true);
      // We don't need to reload, just let React render the MapComponent with the new key
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('google_maps_api_key');
    setApiKey('');
    setIsKeySaved(false);
    
    // Aggressive cleanup attempt
    try {
      // @ts-ignore
      delete window.google;
      // @ts-ignore
      delete window.initMap; 
    } catch (e) {
      console.log('Cleanup error', e);
    }
    
    window.location.reload(); // Reload to clear google scripts
  };

  if (!isKeySaved) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Google Maps aktivieren</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Geben Sie Ihren API-Key ein, um die interaktive Karte zu laden.
                Der Key wird nur lokal in Ihrem Browser gespeichert.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Google Maps API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <Button onClick={handleSaveKey}>Speichern</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Alternativ wird die Mock-Ansicht verwendet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only render MapComponent when we have a key
  return (
    <MapComponent
      apiKey={apiKey}
      customers={customers}
      routeStops={routeStops}
      onMarkerClick={onMarkerClick}
      userLocation={userLocation}
      onClearKey={handleClearKey}
    />
  );
}
