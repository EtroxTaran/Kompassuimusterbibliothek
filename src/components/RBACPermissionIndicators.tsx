import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  Lock,
  Shield,
  Eye,
  Crown,
  Edit3,
  Trash2,
  AlertTriangle,
  Info,
  Check,
  X,
  Mail,
  ExternalLink,
  User,
} from 'lucide-react';

// Types
type UserRole = 'GF' | 'PLAN' | 'ADM' | 'KALK' | 'BUCH' | 'INNEN';
type PermissionLevel = 'allowed' | 'restricted' | 'read-only' | 'conditional';

interface RoleConfig {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface Permission {
  action: string;
  allowed: boolean;
}

// Role configurations
const roleConfigs: Record<UserRole, RoleConfig> = {
  GF: { name: 'Geschäftsführer', color: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
  PLAN: { name: 'Planung', color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  ADM: { name: 'Außendienst', color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
  KALK: { name: 'Kalkulation', color: 'text-amber-700', bgColor: 'bg-amber-100', borderColor: 'border-amber-200' },
  BUCH: { name: 'Buchhaltung', color: 'text-purple-700', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' },
  INNEN: { name: 'Innendienst', color: 'text-gray-700', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' },
};

// Get role permissions
function getRolePermissions(role: UserRole): Permission[] {
  const permissions: Record<UserRole, Permission[]> = {
    GF: [
      { action: 'Kunden anzeigen', allowed: true },
      { action: 'Kunden erstellen', allowed: true },
      { action: 'Kunden bearbeiten', allowed: true },
      { action: 'Kunden löschen', allowed: true },
      { action: 'Aktivitäten erstellen', allowed: true },
      { action: 'Finanzdaten anzeigen', allowed: true },
      { action: 'Entscheidungsrollen bearbeiten', allowed: true },
    ],
    PLAN: [
      { action: 'Kunden anzeigen', allowed: true },
      { action: 'Kunden erstellen', allowed: false },
      { action: 'Kunden bearbeiten', allowed: false },
      { action: 'Kunden löschen', allowed: true },
      { action: 'Aktivitäten erstellen', allowed: true },
      { action: 'Finanzdaten anzeigen', allowed: false },
      { action: 'Entscheidungsrollen bearbeiten', allowed: true },
    ],
    ADM: [
      { action: 'Kunden anzeigen (eigene)', allowed: true },
      { action: 'Kunden erstellen', allowed: true },
      { action: 'Kunden bearbeiten (eigene)', allowed: true },
      { action: 'Kunden löschen', allowed: false },
      { action: 'Aktivitäten erstellen', allowed: true },
      { action: 'Finanzdaten anzeigen', allowed: false },
      { action: 'Entscheidungsrollen bearbeiten', allowed: false },
    ],
    KALK: [
      { action: 'Kunden anzeigen', allowed: true },
      { action: 'Kunden erstellen', allowed: false },
      { action: 'Kunden bearbeiten', allowed: false },
      { action: 'Kunden löschen', allowed: false },
      { action: 'Aktivitäten erstellen', allowed: true },
      { action: 'Finanzdaten anzeigen', allowed: false },
      { action: 'Entscheidungsrollen bearbeiten', allowed: false },
    ],
    BUCH: [
      { action: 'Kunden anzeigen', allowed: true },
      { action: 'Kunden erstellen', allowed: false },
      { action: 'Kunden bearbeiten', allowed: false },
      { action: 'Kunden löschen', allowed: false },
      { action: 'Aktivitäten erstellen', allowed: true },
      { action: 'Finanzdaten anzeigen', allowed: true },
      { action: 'Entscheidungsrollen bearbeiten', allowed: false },
    ],
    INNEN: [
      { action: 'Kunden anzeigen', allowed: true },
      { action: 'Kunden erstellen', allowed: true },
      { action: 'Kunden bearbeiten', allowed: true },
      { action: 'Kunden löschen', allowed: false },
      { action: 'Aktivitäten erstellen', allowed: true },
      { action: 'Finanzdaten anzeigen', allowed: false },
      { action: 'Entscheidungsrollen bearbeiten', allowed: false },
    ],
  };
  return permissions[role];
}

// Check if user can edit field
function canEditField(role: UserRole, field: string, isOwner: boolean = true): PermissionLevel {
  // Financial fields - only GF and BUCH
  if (['creditLimit', 'paymentTerms', 'totalRevenue'].includes(field)) {
    if (role === 'GF' || role === 'BUCH') return 'allowed';
    return 'restricted';
  }

  // Decision-making fields - only GF and PLAN
  if (['decisionMakingRole', 'authorityLevel', 'approvalLimit'].includes(field)) {
    if (role === 'GF' || role === 'PLAN') return 'allowed';
    return 'read-only';
  }

  // Regular fields - ownership-based for ADM
  if (role === 'ADM') {
    return isOwner ? 'allowed' : 'read-only';
  }

  // GF and INNEN can edit all regular fields
  if (role === 'GF' || role === 'INNEN') return 'allowed';

  // Others read-only
  return 'read-only';
}

// Check if user can delete
function canDelete(role: UserRole): boolean {
  return role === 'GF' || role === 'PLAN';
}

// Role Badge Component
export function RoleBadge({ role }: { role: UserRole }) {
  const config = roleConfigs[role];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.bgColor} ${config.color} ${config.borderColor}`}>
            {role}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// User Context Header Component
export function UserContextHeader({ role, userName }: { role: UserRole; userName: string }) {
  const config = roleConfigs[role];
  
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            {userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="mb-0.5">{userName}</p>
          <RoleBadge role={role} />
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="mb-2">Ihre Berechtigungen als {config.name}</p>
            <p className="text-xs text-muted-foreground">
              Klicken Sie für eine vollständige Übersicht
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

// Owner Badge Component
export function OwnerBadge({ owner, isOwner }: { owner: string; isOwner: boolean }) {
  return (
    <Badge variant="outline" className={isOwner ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
      <User className="h-3 w-3 mr-1" />
      Eigentümer: {owner}
    </Badge>
  );
}

// Restricted Field Component
export function RestrictedField({
  label,
  value,
  role,
  requiredRoles,
  isSensitive = false,
}: {
  label: string;
  value: string;
  role: UserRole;
  requiredRoles: UserRole[];
  isSensitive?: boolean;
}) {
  const hasAccess = requiredRoles.includes(role);
  const displayValue = hasAccess ? value : (isSensitive ? '€ XXX.XXX' : value);
  
  return (
    <div>
      <Label className="flex items-center gap-2 mb-2">
        {label}
        {!hasAccess && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {isSensitive ? (
                  <Shield className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p className="mb-1">
                  {isSensitive ? 'Sensible Daten - Keine Berechtigung' : 'Nur-Lese-Zugriff'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Nur {requiredRoles.join('/')} können {isSensitive ? 'anzeigen' : 'bearbeiten'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Label>
      <Input
        value={displayValue}
        readOnly
        disabled={!hasAccess}
        className={!hasAccess ? 'bg-muted cursor-not-allowed' : ''}
      />
      {!hasAccess && isSensitive && (
        <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs">
          Zugriff anfordern
        </Button>
      )}
    </div>
  );
}

// Decision Authority Field Component
export function DecisionAuthorityField({
  label,
  value,
  role,
}: {
  label: string;
  value: string;
  role: UserRole;
}) {
  const canEdit = role === 'GF' || role === 'PLAN';
  
  return (
    <div>
      <Label className="flex items-center gap-2 mb-2">
        {label}
        {!canEdit && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Crown className="h-4 w-4 text-amber-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="mb-1">Entscheidungsbefugnis - Nur GF/PLAN bearbeiten</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Label>
      <Input
        value={value}
        readOnly={!canEdit}
        disabled={!canEdit}
        className={!canEdit ? 'bg-muted cursor-not-allowed' : ''}
      />
    </div>
  );
}

// Restricted Action Button Component
export function RestrictedActionButton({
  action,
  allowed,
  requiredRoles,
  onClick,
  variant = 'default',
}: {
  action: string;
  allowed: boolean;
  requiredRoles?: UserRole[];
  onClick?: () => void;
  variant?: 'default' | 'destructive';
}) {
  const icon = action === 'Löschen' ? <Trash2 className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />;
  
  if (!allowed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              <Button
                variant={variant}
                disabled
                className="relative opacity-40 cursor-not-allowed"
              >
                {icon}
                {action}
                <Lock className="h-4 w-4 ml-2 absolute top-1/2 right-2 -translate-y-1/2" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white max-w-xs">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="mb-1">Keine Berechtigung</p>
                <p className="text-xs text-gray-300 mb-2">
                  {requiredRoles ? `Nur ${requiredRoles.join('/')} kann ${action.toLowerCase()}` : `Sie können diese Aktion nicht ausführen`}
                </p>
                <p className="text-xs text-gray-400">
                  Kontaktieren Sie Ihren Administrator
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Button variant={variant} onClick={onClick}>
      {icon}
      {action}
    </Button>
  );
}

// Conditional Access Button Component
export function ConditionalActionButton({
  action,
  isOwner,
  onClick,
}: {
  action: string;
  isOwner: boolean;
  onClick?: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <Button
              variant="default"
              disabled={!isOwner}
              onClick={onClick}
              className={!isOwner ? 'opacity-40 cursor-not-allowed' : ''}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {action}
              {!isOwner && <Lock className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </TooltipTrigger>
        {!isOwner && (
          <TooltipContent className="bg-amber-600 text-white max-w-xs">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="mb-1">Eingeschränkter Zugriff</p>
                <p className="text-xs mb-2">
                  Sie können nur Ihre eigenen Kunden bearbeiten
                </p>
                <p className="text-xs text-amber-100">
                  Kontaktieren Sie PLAN für Zugriff auf andere Kunden
                </p>
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

// Insufficient Permission Dialog Component
export function InsufficientPermissionDialog({
  isOpen,
  onClose,
  action,
  requiredRoles,
  currentRole,
}: {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  requiredRoles: UserRole[];
  currentRole: UserRole;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle>Zugriff verweigert</DialogTitle>
          </div>
          <DialogDescription>
            Sie haben keine Berechtigung, diese Aktion auszuführen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-900">
              <p className="mb-2">
                <strong>Aktion:</strong> {action}
              </p>
              <p className="mb-2">
                <strong>Erforderliche Rolle:</strong> {requiredRoles.join(' oder ')}
              </p>
              <p>
                <strong>Ihre Rolle:</strong> {roleConfigs[currentRole].name} ({currentRole})
              </p>
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground">
            Diese Aktion erfordert erweiterte Berechtigungen. Kontaktieren Sie Ihren Administrator oder einen
            Benutzer mit {requiredRoles.join('/')} Rolle, um Hilfe zu erhalten.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Verstanden
          </Button>
          <Button variant="default" asChild>
            <a href="mailto:admin@kompass.de">
              <Mail className="h-4 w-4 mr-2" />
              Administrator kontaktieren
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Ownership Mismatch Dialog Component
export function OwnershipMismatchDialog({
  isOpen,
  onClose,
  owner,
}: {
  isOpen: boolean;
  onClose: () => void;
  owner: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <DialogTitle>Zugriff eingeschränkt</DialogTitle>
          </div>
          <DialogDescription>
            Dieser Kunde gehört zu einem anderen Außendienstmitarbeiter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-900">
              <p className="mb-2">
                <strong>Eigentümer:</strong> {owner} (ADM)
              </p>
              <p>
                Als Außendienstmitarbeiter können Sie nur Ihre eigenen Kunden bearbeiten.
              </p>
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 mb-2">
              <strong>Vorschlag:</strong>
            </p>
            <p className="text-sm text-blue-800">
              Kontaktieren Sie PLAN für Zugriff oder Übertragung dieses Kunden an Sie.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="default" asChild>
            <a href="mailto:planung@kompass.de">
              <Mail className="h-4 w-4 mr-2" />
              PLAN kontaktieren
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Permission Summary Panel Component
export function PermissionSummaryPanel({ role }: { role: UserRole }) {
  const permissions = getRolePermissions(role);
  const config = roleConfigs[role];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meine Berechtigungen</CardTitle>
        <CardDescription>Übersicht Ihrer Zugriffsrechte als {config.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rolle:</span>
          <RoleBadge role={role} />
        </div>

        <Separator />

        <div className="space-y-2">
          {permissions.map((permission, index) => (
            <div key={index} className="flex items-center gap-2">
              {permission.allowed ? (
                <Check className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span className={permission.allowed ? 'text-foreground' : 'text-muted-foreground'}>
                {permission.action}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <Button variant="link" className="p-0 h-auto" asChild>
          <a href="#" className="flex items-center gap-1">
            Mehr erfahren über Rollen
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// Customer View Card (Different views based on role)
export function CustomerViewCard({
  role,
  isOwner,
  customerOwner,
}: {
  role: UserRole;
  isOwner: boolean;
  customerOwner: string;
}) {
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);
  const [showOwnershipDialog, setShowOwnershipDialog] = useState(false);

  const handleDeleteClick = () => {
    if (!canDelete(role)) {
      setShowInsufficientDialog(true);
    }
  };

  const handleEditClick = () => {
    if (role === 'ADM' && !isOwner) {
      setShowOwnershipDialog(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2">Hofladen Müller GmbH</CardTitle>
              <div className="flex items-center gap-2">
                <OwnerBadge owner={customerOwner} isOwner={isOwner} />
                {isOwner && role === 'ADM' && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    Mein Kunde
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Banner for ADM viewing other's customer */}
          {role === 'ADM' && !isOwner && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Kunde von {customerOwner} - Kontaktieren Sie PLAN für Zugriff
              </AlertDescription>
            </Alert>
          )}

          {/* Banner for PLAN (read-only) */}
          {role === 'PLAN' && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-sm">
                Sie haben Lesezugriff auf Kundendaten für Projektplanung. Für Änderungen kontaktieren Sie INNEN oder GF.
              </AlertDescription>
            </Alert>
          )}

          {/* Regular Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Firmenname</Label>
              <Input
                value="Hofladen Müller GmbH"
                readOnly={role === 'ADM' ? !isOwner : role === 'PLAN'}
                className={role === 'ADM' && !isOwner ? 'bg-muted' : ''}
              />
            </div>

            <div>
              <Label className="mb-2 block">Telefon</Label>
              <Input
                value="+49-89-1234567"
                readOnly={role === 'ADM' ? !isOwner : role === 'PLAN'}
                className={role === 'ADM' && !isOwner ? 'bg-muted' : ''}
              />
            </div>
          </div>

          {/* Financial Fields (Restricted) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RestrictedField
              label="Kreditlimit"
              value="€ 25.000,00"
              role={role}
              requiredRoles={['GF', 'BUCH']}
              isSensitive
            />

            <RestrictedField
              label="Gesamtumsatz"
              value="€ 156.400,00"
              role={role}
              requiredRoles={['GF', 'BUCH']}
              isSensitive
            />
          </div>

          {/* Decision Authority Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DecisionAuthorityField
              label="Entscheidungsrolle"
              value="Geschäftsführer"
              role={role}
            />

            <DecisionAuthorityField
              label="Genehmigungsgrenze"
              value="€ 100.000,00"
              role={role}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {role === 'ADM' ? (
              <ConditionalActionButton
                action="Bearbeiten"
                isOwner={isOwner}
                onClick={handleEditClick}
              />
            ) : (
              <RestrictedActionButton
                action="Bearbeiten"
                allowed={role === 'GF' || role === 'INNEN'}
                requiredRoles={['GF', 'INNEN']}
              />
            )}

            <RestrictedActionButton
              action="Löschen"
              allowed={canDelete(role)}
              requiredRoles={['GF', 'PLAN']}
              onClick={handleDeleteClick}
              variant="destructive"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <InsufficientPermissionDialog
        isOpen={showInsufficientDialog}
        onClose={() => setShowInsufficientDialog(false)}
        action="Kunde löschen"
        requiredRoles={['GF', 'PLAN']}
        currentRole={role}
      />

      <OwnershipMismatchDialog
        isOpen={showOwnershipDialog}
        onClose={() => setShowOwnershipDialog(false)}
        owner={customerOwner}
      />
    </>
  );
}

// Demo Component
export function RBACPermissionIndicatorsDemo() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADM');
  const [isOwner, setIsOwner] = useState(true);
  const [showPermissionSummary, setShowPermissionSummary] = useState(true);

  const userName = selectedRole === 'ADM' ? 'Michael Schmidt' : 
                   selectedRole === 'GF' ? 'Dr. Schmidt' :
                   selectedRole === 'PLAN' ? 'Anna Weber' :
                   selectedRole === 'BUCH' ? 'Thomas Wagner' :
                   selectedRole === 'KALK' ? 'Sarah Müller' :
                   'Lisa Fischer';

  const customerOwner = isOwner ? userName : 'Anna Weber';

  return (
    <div className="space-y-6">
      {/* Demo Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-2 block">Benutzerrolle</Label>
                <div className="flex flex-wrap gap-2">
                  {(['GF', 'PLAN', 'ADM', 'KALK', 'BUCH', 'INNEN'] as UserRole[]).map((role) => (
                    <Button
                      key={role}
                      variant={selectedRole === role ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedRole(role)}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Kundeneigentümer</Label>
                <div className="flex gap-2">
                  <Button
                    variant={isOwner ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsOwner(true)}
                  >
                    Ich bin Eigentümer
                  </Button>
                  <Button
                    variant={!isOwner ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsOwner(false)}
                  >
                    Anderer Eigentümer
                  </Button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Ansichten</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPermissionSummary(!showPermissionSummary)}
                  >
                    {showPermissionSummary ? 'Panel ausblenden' : 'Panel anzeigen'}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="border border-border rounded-lg p-6 bg-muted/50">
              <h3 className="mb-4">Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Role Badges (6 Rollen mit Farben)</li>
                  <li>• User Context Header (Avatar + Rolle)</li>
                  <li>• Owner Badges (Eigentümer-Anzeige)</li>
                  <li>• Restricted Fields (Shield/Eye Icons)</li>
                  <li>• Masked Values (€ XXX.XXX)</li>
                  <li>• Decision Authority Fields (Crown Icon)</li>
                  <li>• Restricted Action Buttons (Lock Overlay)</li>
                  <li>• Conditional Access Buttons (Ownership)</li>
                  <li>• Permission Tooltips (4 Farben)</li>
                  <li>• Insufficient Permission Dialog</li>
                </ul>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Ownership Mismatch Dialog</li>
                  <li>• Permission Summary Panel (Checklist)</li>
                  <li>• ADM: Ownership-based editing</li>
                  <li>• GF: Full access (Gold badge)</li>
                  <li>• PLAN: Read-only with info banner</li>
                  <li>• BUCH: Financial data access</li>
                  <li>• Financial shields (GF/BUCH only)</li>
                  <li>• Decision authority locks (GF/PLAN only)</li>
                  <li>• "Zugriff anfordern" links</li>
                  <li>• Complete RBAC matrix</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Context */}
      <UserContextHeader role={selectedRole} userName={userName} />

      {/* Permission Summary (Optional) */}
      {showPermissionSummary && (
        <PermissionSummaryPanel role={selectedRole} />
      )}

      {/* Customer View Card */}
      <CustomerViewCard
        role={selectedRole}
        isOwner={isOwner}
        customerOwner={customerOwner}
      />

      {/* Quick Reference Guide */}
      <Card>
        <CardHeader>
          <CardTitle>RBAC-Schnellreferenz</CardTitle>
          <CardDescription>Berechtigungsmatrix für alle Rollen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Aktion</th>
                  <th className="text-center p-2">GF</th>
                  <th className="text-center p-2">PLAN</th>
                  <th className="text-center p-2">ADM</th>
                  <th className="text-center p-2">KALK</th>
                  <th className="text-center p-2">BUCH</th>
                  <th className="text-center p-2">INNEN</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Kunden löschen</td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Kunden bearbeiten</td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2">
                    <span className="text-xs text-amber-600">Eigene</span>
                  </td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Finanzdaten anzeigen</td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-2">Entscheidungsrollen</td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-2"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                  <td className="text-center p-2"><X className="h-4 w-4 text-red-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
