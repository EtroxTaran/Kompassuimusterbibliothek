import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Sheet, SheetContent } from './ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import {
  Camera,
  X,
  FlipHorizontal,
  Zap,
  Grid3x3,
  Image as ImageIcon,
  Check,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Pen,
  Type,
  ArrowUpRight,
  Circle,
  Square,
  Palette,
  Undo2,
  Redo2,
  Mic,
  Link,
  Tag,
  Eye,
  EyeOff,
  Users,
  Download,
  Share2,
  ZoomIn,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  GripVertical,
} from 'lucide-react';

// Types
type CaptureMode = 'camera' | 'review' | 'annotation' | 'final';
type FlashMode = 'auto' | 'on' | 'off';
type AnnotationTool = 'pen' | 'text' | 'arrow' | 'circle' | 'rectangle';
type AnnotationColor = 'red' | 'blue' | 'green' | 'yellow';

interface CapturedPhoto {
  id: string;
  url: string;
  timestamp: Date;
  description?: string;
  linkedEntity?: {
    type: 'project' | 'customer' | 'activity' | 'opportunity';
    id: string;
    name: string;
  };
  tags: string[];
  visibleToTeam: boolean;
  visibleToCustomer: boolean;
  hasAnnotations: boolean;
  uploadStatus?: 'pending' | 'uploading' | 'uploaded' | 'error';
}

// Mock data
const predefinedTags = ['Rohbau', 'Elektrik', 'Möbel', 'Beleuchtung', 'Fertigstellung'];

const mockProjects = [
  { id: 'P-2024-B023', name: 'Hofladen Ladenbau' },
  { id: 'P-2024-C045', name: 'REWE München Süd' },
];

// Camera View Component
function CameraView({
  photoCount,
  onCapture,
  onClose,
  capturedPhotos,
}: {
  photoCount: number;
  onCapture: (file: File) => void;
  onClose: () => void;
  capturedPhotos: CapturedPhoto[];
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [flashMode, setFlashMode] = useState<FlashMode>('auto');
  const [showGrid, setShowGrid] = useState(false);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
      toast.success('Foto aufgenommen');
      // Reset input
      e.target.value = '';
    }
  };

  const cycleFlash = () => {
    setFlashMode((prev) => {
      if (prev === 'auto') return 'on';
      if (prev === 'on') return 'off';
      return 'auto';
    });
  };

  return (
    <div className="relative h-screen bg-black flex items-center justify-center">
      {/* Camera Preview (Mock) */}
      <div className="absolute inset-0 flex items-center justify-center text-white/50">
        <div className="text-center">
          <Camera className="h-24 w-24 mx-auto mb-4" />
          <p>Kamera-Vorschau</p>
          <p className="text-sm mt-2">Tippen Sie auf den Auslöser, um ein Foto aufzunehmen</p>
        </div>
      </div>

      {/* Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="text-white h-10 w-10 p-0" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white h-10 w-10 p-0"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3x3 className={`h-5 w-5 ${showGrid ? 'text-blue-400' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" className="text-white h-10 w-10 p-0" onClick={cycleFlash}>
            <Zap className={`h-5 w-5 ${flashMode === 'on' ? 'fill-white' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" className="text-white h-10 w-10 p-0">
            <FlipHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Flash Mode Indicator */}
      {flashMode !== 'auto' && (
        <div className="absolute top-20 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          Blitz: {flashMode === 'on' ? 'Ein' : 'Aus'}
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
        {/* Gallery Thumbnail */}
        <div className="relative">
          {capturedPhotos.length > 0 ? (
            <div className="h-12 w-12 rounded-lg border-2 border-white overflow-hidden relative">
              <img src={capturedPhotos[capturedPhotos.length - 1].url} alt="" className="h-full w-full object-cover" />
              {capturedPhotos.length > 1 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                  {capturedPhotos.length}
                </Badge>
              )}
            </div>
          ) : (
            <div className="h-12 w-12 rounded-lg border-2 border-white/30 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-white/30" />
            </div>
          )}
        </div>

        {/* Capture Button */}
        <button
          className="h-20 w-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
          onClick={handleCapture}
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </button>

        {/* Photo Count */}
        <div className="text-white text-sm w-12 text-right">
          {photoCount > 0 && `${photoCount} von 10`}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

// Photo Grid Review Component
function PhotoGridReview({
  photos,
  onRemove,
  onContinue,
  onAddMore,
}: {
  photos: CapturedPhoto[];
  onRemove: (id: string) => void;
  onContinue: () => void;
  onAddMore: () => void;
}) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="mb-1">Aufgenommene Fotos</h2>
        <p className="text-muted-foreground">{photos.length} Foto{photos.length !== 1 && 's'}</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square">
              <img src={photo.url} alt="" className="h-full w-full object-cover rounded-lg" />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(photo.timestamp)}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => onRemove(photo.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {photos.length < 10 && (
          <button
            className="w-full mt-4 p-4 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            onClick={onAddMore}
          >
            <Camera className="h-5 w-5" />
            <span>Weitere Fotos aufnehmen</span>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border bg-background">
        <Button className="w-full" size="lg" onClick={onContinue}>
          Weiter zur Beschriftung
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// Annotation View Component
function AnnotationView({
  photos,
  currentIndex,
  onPrevious,
  onNext,
  onSkip,
  onUpdatePhoto,
}: {
  photos: CapturedPhoto[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSkip: () => void;
  onUpdatePhoto: (id: string, updates: Partial<CapturedPhoto>) => void;
}) {
  const currentPhoto = photos[currentIndex];
  const [activeTool, setActiveTool] = useState<AnnotationTool | null>(null);
  const [activeColor, setActiveColor] = useState<AnnotationColor>('red');
  const [description, setDescription] = useState(currentPhoto.description || '');
  const [linkedEntity, setLinkedEntity] = useState(currentPhoto.linkedEntity);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentPhoto.tags);
  const [visibleToTeam, setVisibleToTeam] = useState(currentPhoto.visibleToTeam);
  const [visibleToCustomer, setVisibleToCustomer] = useState(currentPhoto.visibleToCustomer);
  const [customTag, setCustomTag] = useState('');

  const colors: { value: AnnotationColor; hex: string }[] = [
    { value: 'red', hex: '#EF4444' },
    { value: 'blue', hex: '#3B82F6' },
    { value: 'green', hex: '#10B981' },
    { value: 'yellow', hex: '#F59E0B' },
  ];

  const handleNext = () => {
    // Save current photo data
    onUpdatePhoto(currentPhoto.id, {
      description,
      linkedEntity,
      tags: selectedTags,
      visibleToTeam,
      visibleToCustomer,
      hasAnnotations: activeTool !== null,
    });
    onNext();
  };

  const handlePrevious = () => {
    // Save current photo data
    onUpdatePhoto(currentPhoto.id, {
      description,
      linkedEntity,
      tags: selectedTags,
      visibleToTeam,
      visibleToCustomer,
    });
    onPrevious();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <p>
          {currentIndex + 1} von {photos.length}
        </p>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Überspringen
        </Button>
      </div>

      {/* Photo with Annotation Tools */}
      <div className="relative">
        <img src={currentPhoto.url} alt="" className="w-full aspect-video object-cover" />
        
        {/* Annotation Toolbar */}
        {activeTool && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-border flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setActiveTool('pen')}
            >
              <Pen className={`h-4 w-4 ${activeTool === 'pen' ? 'text-primary' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setActiveTool('text')}
            >
              <Type className={`h-4 w-4 ${activeTool === 'text' ? 'text-primary' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setActiveTool('arrow')}
            >
              <ArrowUpRight className={`h-4 w-4 ${activeTool === 'arrow' ? 'text-primary' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setActiveTool('circle')}
            >
              <Circle className={`h-4 w-4 ${activeTool === 'circle' ? 'text-primary' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setActiveTool('rectangle')}
            >
              <Square className={`h-4 w-4 ${activeTool === 'rectangle' ? 'text-primary' : ''}`} />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            {colors.map((color) => (
              <button
                key={color.value}
                className={`h-6 w-6 rounded-full border-2 ${activeColor === color.value ? 'border-foreground' : 'border-border'}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setActiveColor(color.value)}
              />
            ))}
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {!activeTool && (
          <Button
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
            onClick={() => setActiveTool('pen')}
          >
            <Pen className="mr-2 h-4 w-4" />
            Beschriftung hinzufügen
          </Button>
        )}
      </div>

      {/* Metadata Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Description */}
        <div>
          <Label>Beschreibung</Label>
          <div className="relative mt-2">
            <Textarea
              placeholder="Beschreibung hinzufügen..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => toast.info('Spracherkennung aktiviert...')}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            {description.length}/200
          </p>
        </div>

        {/* Linked Entity */}
        <div>
          <Label>Verknüpfung</Label>
          <div className="mt-2 space-y-2">
            <Select
              value={linkedEntity?.type}
              onValueChange={(type: any) => {
                if (type === 'project') {
                  setLinkedEntity({
                    type: 'project',
                    id: mockProjects[0].id,
                    name: mockProjects[0].name,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Verknüpfen mit..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Projekt</SelectItem>
                <SelectItem value="customer">Kunde</SelectItem>
                <SelectItem value="activity">Aktivität</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
              </SelectContent>
            </Select>
            
            {linkedEntity?.type === 'project' && (
              <Select
                value={linkedEntity.id}
                onValueChange={(id) => {
                  const project = mockProjects.find((p) => p.id === id);
                  if (project) {
                    setLinkedEntity({
                      type: 'project',
                      id: project.id,
                      name: project.name,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {linkedEntity && (
              <Badge variant="outline" className="flex items-center gap-2 w-fit">
                <Link className="h-3 w-3" />
                {linkedEntity.type === 'project' && 'Projekt: '}
                {linkedEntity.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {predefinedTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
            {selectedTags
              .filter((tag) => !predefinedTags.includes(tag))
              .map((tag) => (
                <Badge key={tag} variant="default" className="cursor-pointer" onClick={() => toggleTag(tag)}>
                  {tag}
                </Badge>
              ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Eigenes Tag..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <Button variant="outline" size="sm" onClick={addCustomTag}>
              <Tag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Visibility */}
        <div className="space-y-3">
          <Label>Sichtbarkeit</Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Für Team sichtbar</span>
            </div>
            <Switch checked={visibleToTeam} onCheckedChange={setVisibleToTeam} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {visibleToCustomer ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              )}
              <span>Für Kunde sichtbar</span>
            </div>
            <Switch checked={visibleToCustomer} onCheckedChange={setVisibleToCustomer} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border bg-background">
        <Button className="w-full" size="lg" onClick={handleNext}>
          {currentIndex === photos.length - 1 ? 'Zur Übersicht' : 'Nächstes Foto'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// Final Review Component
function FinalReview({
  photos,
  onEdit,
  onRemove,
  onSave,
  onCancel,
  isUploading,
  uploadProgress,
}: {
  photos: CapturedPhoto[];
  onEdit: (index: number) => void;
  onRemove: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isUploading: boolean;
  uploadProgress?: { current: number; total: number };
}) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="mb-1">Übersicht</h2>
        <p className="text-muted-foreground">
          {photos.length} Foto{photos.length !== 1 && 's'} zur Speicherung bereit
        </p>
      </div>

      {/* Photo List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {photos.map((photo, index) => (
          <Card key={photo.id} className="cursor-pointer" onClick={() => onEdit(index)}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative h-20 w-20 shrink-0">
                  <img src={photo.url} alt="" className="h-full w-full object-cover rounded" />
                  {photo.uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                  {photo.uploadStatus === 'uploaded' && (
                    <div className="absolute inset-0 bg-green-600/50 flex items-center justify-center rounded">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                  )}
                  {photo.uploadStatus === 'error' && (
                    <div className="absolute inset-0 bg-red-600/50 flex items-center justify-center rounded">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex-1 min-w-0">
                  <p className="mb-1 truncate">{photo.description || 'Keine Beschreibung'}</p>
                  {photo.linkedEntity && (
                    <p className="text-muted-foreground mb-1">
                      {photo.linkedEntity.type === 'project' && 'Projekt: '}
                      {photo.linkedEntity.name}
                    </p>
                  )}
                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{photo.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(photo.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Progress */}
      {isUploading && uploadProgress && (
        <div className="px-4 py-3 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">
              Uploading {uploadProgress.current} von {uploadProgress.total}...
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
            </span>
          </div>
          <Progress value={(uploadProgress.current / uploadProgress.total) * 100} />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-border bg-background space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={onSave}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Wird hochgeladen...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Fotos speichern
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onCancel}
          disabled={isUploading}
        >
          Abbrechen
        </Button>
      </div>
    </div>
  );
}

// Main Photo Documentation Component
export function PhotoDocumentation() {
  const [mode, setMode] = useState<CaptureMode>('camera');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>();

  // Handle photo capture
  const handleCapture = (file: File) => {
    const url = URL.createObjectURL(file);
    const newPhoto: CapturedPhoto = {
      id: `photo-${Date.now()}`,
      url,
      timestamp: new Date(),
      tags: [],
      visibleToTeam: true,
      visibleToCustomer: false,
      hasAnnotations: false,
      uploadStatus: 'pending',
    };
    setPhotos([...photos, newPhoto]);
  };

  // Handle remove photo
  const handleRemove = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
    toast.success('Foto entfernt');
  };

  // Handle continue from review
  const handleContinueToAnnotation = () => {
    setCurrentPhotoIndex(0);
    setMode('annotation');
  };

  // Handle update photo
  const handleUpdatePhoto = (id: string, updates: Partial<CapturedPhoto>) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Handle navigation in annotation
  const handleNext = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      setMode('final');
    }
  };

  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else {
      setMode('review');
    }
  };

  const handleSkip = () => {
    setMode('final');
  };

  // Handle edit from final review
  const handleEdit = (index: number) => {
    setCurrentPhotoIndex(index);
    setMode('annotation');
  };

  // Handle save
  const handleSave = () => {
    setIsUploading(true);
    setUploadProgress({ current: 0, total: photos.length });

    // Simulate upload
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setUploadProgress({ current, total: photos.length });
      
      // Update photo upload status
      setPhotos((prev) =>
        prev.map((p, i) =>
          i < current ? { ...p, uploadStatus: 'uploaded' as const } : p
        )
      );

      if (current >= photos.length) {
        clearInterval(interval);
        setIsUploading(false);
        toast.success('Fotos gespeichert', {
          description: `${photos.length} Foto${photos.length !== 1 ? 's' : ''} erfolgreich hochgeladen`,
        });
        // Reset
        setTimeout(() => {
          setPhotos([]);
          setMode('camera');
          setUploadProgress(undefined);
        }, 1500);
      }
    }, 800);
  };

  // Handle cancel
  const handleCancel = () => {
    setPhotos([]);
    setMode('camera');
    toast.info('Abgebrochen');
  };

  return (
    <div className="h-screen bg-background">
      {mode === 'camera' && (
        <CameraView
          photoCount={photos.length}
          onCapture={handleCapture}
          onClose={() => {
            if (photos.length > 0) {
              setMode('review');
            } else {
              toast.info('Keine Fotos aufgenommen');
            }
          }}
          capturedPhotos={photos}
        />
      )}

      {mode === 'review' && (
        <PhotoGridReview
          photos={photos}
          onRemove={handleRemove}
          onContinue={handleContinueToAnnotation}
          onAddMore={() => setMode('camera')}
        />
      )}

      {mode === 'annotation' && (
        <AnnotationView
          photos={photos}
          currentIndex={currentPhotoIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSkip={handleSkip}
          onUpdatePhoto={handleUpdatePhoto}
        />
      )}

      {mode === 'final' && (
        <FinalReview
          photos={photos}
          onEdit={handleEdit}
          onRemove={handleRemove}
          onSave={handleSave}
          onCancel={handleCancel}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      )}
    </div>
  );
}

// Demo Component
export function PhotoDocumentationDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4">Foto-Dokumentation (Mobile)</h2>
          <p className="text-muted-foreground mb-6">
            Mobile PWA-Komponente für Foto-Dokumentation mit Multi-Foto-Erfassung, Beschriftung,
            Tagging, Entity-Verknüpfung und Offline-Unterstützung
          </p>

          <div>
            <h3 className="mb-3">Features:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Vollbild-Kamera-Ansicht mit Kontrollen</li>
              <li>• Blitz-Modi: Auto/Ein/Aus</li>
              <li>• Raster-Overlay (Drittel-Regel)</li>
              <li>• Multi-Foto-Modus (bis zu 10 Fotos)</li>
              <li>• Foto-Galerie mit Zeitstempel</li>
              <li>• Beschriftungs-Werkzeuge (Stift, Text, Pfeile, Formen)</li>
              <li>• Farbauswahl für Beschriftungen</li>
              <li>• Rückgängig/Wiederholen</li>
              <li>• Beschreibung mit Spracherkennung</li>
              <li>• Entity-Verknüpfung (Projekt/Kunde/Aktivität/Opportunity)</li>
              <li>• Vordefinierte und benutzerdefinierte Tags</li>
              <li>• Sichtbarkeitseinstellungen (Team/Kunde)</li>
              <li>• Foto-Übersicht vor dem Speichern</li>
              <li>• Upload-Fortschrittsanzeige</li>
              <li>• Offline-Warteschlange</li>
              <li>• Komprimierung für Speicheroptimierung</li>
            </ul>
          </div>

          <Separator className="my-6" />

          <div className="max-w-sm mx-auto border border-border rounded-lg overflow-hidden shadow-xl">
            <PhotoDocumentation />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
