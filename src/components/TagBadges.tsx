import { useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export function TagBadges() {
  const [tags, setTags] = useState([
    'Großkunde',
    'VIP',
    'Landwirtschaft',
    'Bio',
    'Premium',
  ]);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const resetTags = () => {
    setTags(['Großkunde', 'VIP', 'Landwirtschaft', 'Bio', 'Premium']);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3">Einfache Tags</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Großkunde</Badge>
          <Badge variant="outline">VIP</Badge>
          <Badge variant="outline">Landwirtschaft</Badge>
          <Badge variant="outline">Bio</Badge>
          <Badge variant="outline">Premium</Badge>
          <Badge variant="outline">Stammkunde</Badge>
          <Badge variant="outline">Neukunde</Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Entfernbare Tags</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="pr-1 hover:bg-accent transition-colors"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive transition-colors rounded-sm p-0.5"
                aria-label={`${tag} entfernen`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {tags.length === 0 && (
          <p className="text-muted-foreground">Alle Tags wurden entfernt.</p>
        )}
        <Button onClick={resetTags} variant="outline" size="sm">
          Tags zurücksetzen
        </Button>
      </div>

      <div>
        <h4 className="mb-3">Farbige Tags</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-chart-2/20 text-chart-2 border-chart-2/30">
            Aktiver Kunde
          </Badge>
          <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30">
            Neue Anfrage
          </Badge>
          <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            Wartend
          </Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            Wichtig
          </Badge>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Kategorien mit Icons</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            🏢 Gewerbe
          </Badge>
          <Badge variant="outline">
            🌾 Landwirtschaft
          </Badge>
          <Badge variant="outline">
            🏠 Privat
          </Badge>
          <Badge variant="outline">
            🏭 Industrie
          </Badge>
          <Badge variant="outline">
            🏪 Einzelhandel
          </Badge>
        </div>
      </div>
    </div>
  );
}
