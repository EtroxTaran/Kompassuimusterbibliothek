import { AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function InlineFormError() {
  return (
    <div className="space-y-6 max-w-md">
      {/* Valid field for comparison */}
      <div className="space-y-2">
        <Label htmlFor="company-name">Firmenname</Label>
        <Input
          id="company-name"
          type="text"
          defaultValue="Müller Bau GmbH"
          className="bg-input-background"
        />
      </div>

      {/* Invalid field with error */}
      <div className="space-y-2">
        <Label htmlFor="vat-id">Umsatzsteuer-ID</Label>
        <Input
          id="vat-id"
          type="text"
          defaultValue="123456789"
          className="border-destructive bg-destructive/5 focus-visible:ring-destructive"
          aria-invalid="true"
          aria-describedby="vat-id-error"
        />
        <div
          id="vat-id-error"
          role="alert"
          className="flex items-start gap-2 text-destructive"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="text-destructive" style={{ fontSize: '12px' }}>
            Die Umsatzsteuer-ID muss im Format DE123456789 sein
          </p>
        </div>
      </div>
    </div>
  );
}
