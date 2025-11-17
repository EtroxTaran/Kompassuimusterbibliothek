import { StandardBreadcrumbs } from './StandardBreadcrumbs';
import { TruncatedBreadcrumbs } from './TruncatedBreadcrumbs';
import { ResponsiveBreadcrumbs } from './ResponsiveBreadcrumbs';
import { BreadcrumbsWithIcons } from './BreadcrumbsWithIcons';
import { BreadcrumbSizeVariants } from './BreadcrumbSizeVariants';
import { BreadcrumbsInContext } from './BreadcrumbsInContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function BreadcrumbDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Standard-Breadcrumbs</CardTitle>
          <CardDescription>
            Grundlegende Breadcrumb-Navigation mit deutschen Beschriftungen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StandardBreadcrumbs />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gekürzte Breadcrumbs mit Ellipsis</CardTitle>
          <CardDescription>
            Lange Pfade mit Dropdown-Menü für versteckte Elemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TruncatedBreadcrumbs />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsive Breadcrumbs</CardTitle>
          <CardDescription>
            Anpassung für Mobile mit Zurück-Button und horizontalem Scrollen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveBreadcrumbs />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breadcrumbs mit Symbolen</CardTitle>
          <CardDescription>
            Icons für bessere visuelle Erkennung der Navigationsstufen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BreadcrumbsWithIcons />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Größenvarianten</CardTitle>
          <CardDescription>
            Klein (12px), Standard (14px) und Groß (16px) Varianten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BreadcrumbSizeVariants />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Breadcrumbs im Kontext</CardTitle>
          <CardDescription>
            Praktische Anwendungsbeispiele in Seitenköpfen und Layouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BreadcrumbsInContext />
        </CardContent>
      </Card>
    </div>
  );
}
