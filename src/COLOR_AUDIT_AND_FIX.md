# KOMPASS - Color Audit & Design System Migration

## Problem Statement

Components are using **hardcoded Tailwind color classes** instead of **CSS design system variables**. This prevents the theme from updating globally when you change colors in `/styles/globals.css`.

---

## Color Mapping Strategy

### ❌ HARDCODED → ✅ DESIGN SYSTEM

| Hardcoded Class | Design System Class | Use Case |
|-----------------|-------------------|----------|
| `bg-blue-500`, `bg-blue-600` | `bg-primary` | Primary actions, highlights |
| `text-blue-600`, `text-blue-700` | `text-primary` | Primary text |
| `bg-blue-50`, `bg-blue-100` | `bg-primary/10` or `bg-accent` | Light backgrounds |
| `border-blue-200`, `border-blue-600` | `border-primary` or `border-accent` | Borders |
| `bg-gray-50`, `bg-gray-100` | `bg-muted` | Muted backgrounds |
| `text-gray-600`, `text-gray-700` | `text-muted-foreground` | Secondary text |
| `bg-gray-200`, `bg-gray-300` | `bg-border` | Dividers, separators |
| `border-gray-200` | `border-border` | Standard borders |
| `bg-green-50`, `bg-green-100` | `bg-green-500/10` (keep semantic) | Success states |
| `text-green-600`, `text-green-700` | `text-green-600` (keep semantic) | Success text |
| `bg-red-50`, `bg-red-100` | `bg-destructive/10` | Error backgrounds |
| `text-red-600` | `text-destructive` | Error text |
| `bg-amber-50`, `bg-amber-100` | `bg-amber-500/10` (keep semantic) | Warning backgrounds |
| `text-amber-600` | `text-amber-600` (keep semantic) | Warning text |
| `bg-slate-*`, `text-slate-*` | Use gray/muted equivalents | Convert to gray |

---

## Semantic Colors Strategy

### Keep Semantic Colors for State

Some colors should remain **hardcoded for semantic meaning** (success, warning, error):

**✅ KEEP AS-IS** (Semantic State Colors):
- **Success/Positive:** `bg-green-*`, `text-green-*`, `border-green-*`
- **Warning/Attention:** `bg-amber-*`, `text-amber-*`, `border-amber-*`  
- **Error/Negative:** `bg-red-*`, `text-red-*`, `border-red-*` (or use `destructive`)
- **Info/Neutral:** Can use `bg-blue-*` or switch to `accent`

**🔄 CONVERT TO DESIGN SYSTEM** (UI Colors):
- **Primary brand color:** Convert `bg-blue-500/600` → `bg-primary`
- **Muted/neutral:** Convert `bg-gray-*` → `bg-muted` or `text-muted-foreground`
- **Borders:** Convert `border-gray-200` → `border-border`
- **Accent highlights:** Convert `bg-blue-50/100` → `bg-accent` or `bg-primary/10`

---

## Component-by-Component Fix Plan

### HIGH PRIORITY - Core UI Components

These must use design system variables:

#### 1. **RichTextEditor.tsx** (3 locations)
```tsx
// ❌ BEFORE
className="text-gray-700 hover:bg-gray-100"
<div className="w-px h-8 bg-gray-300" />
disabled || locked ? 'bg-gray-50' : ''

// ✅ AFTER
className="text-foreground hover:bg-muted"
<div className="w-px h-8 bg-border" />
disabled || locked ? 'bg-muted' : ''
```

#### 2. **SearchFiltersDemo.tsx** (2 locations)
```tsx
// ❌ BEFORE
className="bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
className="ml-2 hover:bg-blue-200 rounded-full p-0.5"

// ✅ AFTER
className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
className="ml-2 hover:bg-primary/30 rounded-full p-0.5"
```

#### 3. **TablesDataGridsDemo.tsx** (3 locations)
```tsx
// ❌ BEFORE
<div className="bg-blue-50 border border-blue-200 rounded-lg">
selectedRows.includes(customer.id) && 'bg-blue-50'

// ✅ AFTER
<div className="bg-primary/10 border border-primary/20 rounded-lg">
selectedRows.includes(customer.id) && 'bg-accent'
```

#### 4. **TooltipsPopoversDemo.tsx** (2 locations)
```tsx
// ❌ BEFORE
<div className="bg-gray-900/95 text-white">

// ✅ AFTER
<div className="bg-popover text-popover-foreground border border-border">
// OR if needs to be dark:
<div className="bg-foreground text-background">
```

---

### MEDIUM PRIORITY - Form Components

#### 5. **InvoiceFormDemo.tsx** (5+ locations)
```tsx
// ❌ BEFORE
<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">

// ✅ AFTER - Use accent for highlighted info
<div className="bg-accent/50 border border-accent">
// OR use primary with opacity
<div className="bg-primary/10 border border-primary/20">
```

#### 6. **OpportunityFormDemo.tsx** (10+ locations)
```tsx
// ❌ BEFORE
bgColor: 'bg-blue-50 dark:bg-blue-950/20'
<div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20">

// ✅ AFTER
bgColor: 'bg-accent/50'
<div className="h-12 w-12 rounded-full bg-accent">
```

#### 7. **ProjectFormDemo.tsx** (15+ locations)
```tsx
// ❌ BEFORE
<Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
<div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20">

// ✅ AFTER
<Alert className="bg-accent/50 border-accent">
<div className="h-10 w-10 rounded-full bg-accent">
```

---

### LOWER PRIORITY - List/Demo Components

#### 8. **CustomerListDemo.tsx** (5 locations)
```tsx
// ❌ BEFORE
<TableRow className={isSelected ? 'bg-blue-50' : ''}>
<div className="bg-blue-50 border border-blue-200">

// ✅ AFTER
<TableRow className={isSelected ? 'bg-accent' : ''}>
<div className="bg-accent/50 border border-accent">
```

#### 9. **ContactListDemo.tsx** (10+ locations)
Status colors - these are semantic, but mix UI and semantic:
```tsx
// Decision-maker (primary role)
// ❌ BEFORE
color: 'bg-blue-600',
bgColor: 'bg-blue-50 dark:bg-blue-950/20',
textColor: 'text-blue-700 dark:text-blue-300',

// ✅ AFTER - Use primary for important roles
color: 'bg-primary',
bgColor: 'bg-primary/10',
textColor: 'text-primary',

// Operational (neutral role)
// ❌ BEFORE
color: 'bg-gray-600',
bgColor: 'bg-gray-50 dark:bg-gray-950/20',
textColor: 'text-gray-700 dark:text-gray-300',

// ✅ AFTER
color: 'bg-muted-foreground',
bgColor: 'bg-muted',
textColor: 'text-muted-foreground',
```

#### 10. **InvoiceListDemo.tsx** (10 locations)
```tsx
// Status colors - mix semantic and UI
// Draft (neutral)
// ❌ BEFORE
color: 'text-gray-700',
bgColor: 'bg-gray-100',

// ✅ AFTER
color: 'text-muted-foreground',
bgColor: 'bg-muted',

// Partial payment (info)
// ❌ BEFORE
color: 'text-blue-700',
bgColor: 'bg-blue-100',

// ✅ AFTER
color: 'text-primary',
bgColor: 'bg-primary/10',
```

#### 11. **LocationListDemo.tsx** (5 locations)
#### 12. **OpportunityPipelineDemo.tsx** (10 locations)
#### 13. **ProjectPortfolioDemo.tsx** (8 locations)

---

### KEEP AS-IS - Semantic State Colors

#### **OfflineSyncStatus.tsx**
Keep semantic colors for connection states:
```tsx
// ✅ KEEP - Semantic success
case 'online': return 'bg-green-100 border-green-200 text-green-900';

// ✅ KEEP - Semantic warning
case 'offline': return 'bg-amber-100 border-amber-200 text-amber-900';

// 🔄 CONVERT - Use primary for syncing (action state)
case 'syncing': 
  // ❌ return 'bg-blue-100 border-blue-200 text-blue-900';
  // ✅ return 'bg-primary/10 border-primary/20 text-primary';

// ✅ KEEP - Semantic error
case 'error': return 'bg-red-100 border-red-200 text-red-900';
```

#### **ProgressIndicatorsDemo.tsx**
Keep green for success, red for error:
```tsx
// ✅ KEEP
status === 'success' && '[&>div]:bg-green-600'
<Check className="h-4 w-4 text-green-600" />
```

#### **ToastsNotificationsDemo.tsx**
Keep semantic colors for notification types:
```tsx
// ✅ KEEP
<CheckCircle className="mr-2 h-4 w-4 text-green-600" /> // Success
<AlertCircle className="mr-2 h-4 w-4 text-red-600" /> // Error
<AlertTriangle className="mr-2 h-4 w-4 text-amber-600" /> // Warning
```

#### **ActivityProtocolFormDemo.tsx**
Offline warning:
```tsx
// ✅ KEEP - Semantic warning
<div className="bg-amber-50 border border-amber-200">
  <CloudOff className="h-5 w-5 text-amber-600" />
```

---

## Implementation Strategy

### Phase 1: Core UI Components (1-2 hours)
Fix components that affect the entire UI:
1. ✅ RichTextEditor.tsx
2. ✅ RichTextEditorDemo.tsx
3. ✅ RichTextEditorFieldsDemo.tsx
4. ✅ SearchFiltersDemo.tsx
5. ✅ TablesDataGridsDemo.tsx
6. ✅ TooltipsPopoversDemo.tsx

### Phase 2: Form Components (2-3 hours)
Fix major form components:
7. ✅ InvoiceFormDemo.tsx
8. ✅ OpportunityFormDemo.tsx
9. ✅ ProjectFormDemo.tsx
10. ✅ ContactFormDemo.tsx
11. ✅ CustomerFormDemo.tsx

### Phase 3: List Components (1-2 hours)
Fix list/table views:
12. ✅ CustomerListDemo.tsx
13. ✅ ContactListDemo.tsx
14. ✅ InvoiceListDemo.tsx
15. ✅ LocationListDemo.tsx
16. ✅ OpportunityPipelineDemo.tsx
17. ✅ ProjectPortfolioDemo.tsx

### Phase 4: State Components (30 min)
Review and selectively update:
18. 🔍 OfflineSyncStatus.tsx (partial - only non-semantic)
19. ✅ ActivityTimelineDemo.tsx
20. ✅ ActivityProtocolFormDemo.tsx

---

## Testing Checklist

After each phase, verify:
- [ ] Light mode colors display correctly
- [ ] Dark mode colors display correctly
- [ ] Changing `--primary` in globals.css updates all primary elements
- [ ] Changing `--accent` in globals.css updates all accent elements
- [ ] Semantic colors (success/warning/error) still work
- [ ] No visual regressions
- [ ] Accessibility contrast ratios maintained

---

## Quick Reference: Common Replacements

```tsx
// ===== BACKGROUNDS =====
bg-blue-50      → bg-accent or bg-primary/10
bg-blue-100     → bg-accent or bg-primary/20
bg-blue-500     → bg-primary
bg-blue-600     → bg-primary
bg-gray-50      → bg-muted
bg-gray-100     → bg-muted
bg-gray-200     → bg-border
bg-gray-900     → bg-foreground
bg-white        → bg-background or bg-card

// ===== TEXT =====
text-blue-600   → text-primary
text-blue-700   → text-primary
text-gray-400   → text-muted-foreground
text-gray-500   → text-muted-foreground
text-gray-600   → text-muted-foreground
text-gray-700   → text-foreground or text-muted-foreground
text-gray-900   → text-foreground
text-white      → text-primary-foreground or text-background

// ===== BORDERS =====
border-blue-200 → border-primary/20 or border-accent
border-blue-600 → border-primary
border-gray-200 → border-border
border-gray-300 → border-border

// ===== KEEP SEMANTIC =====
bg-green-*      → KEEP (success)
text-green-*    → KEEP (success)
bg-red-*        → KEEP (error) or use bg-destructive
text-red-*      → KEEP (error) or use text-destructive
bg-amber-*      → KEEP (warning)
text-amber-*    → KEEP (warning)
```

---

## Opacity Usage

When you need lighter versions of design system colors, use Tailwind opacity:

```tsx
// ✅ CORRECT - Using opacity
<div className="bg-primary/10">        {/* 10% opacity */}
<div className="bg-primary/20">        {/* 20% opacity */}
<div className="border-primary/30">    {/* 30% opacity */}
<div className="text-primary/50">      {/* 50% opacity */}

// ❌ WRONG - Hardcoded light variant
<div className="bg-blue-50">
<div className="bg-blue-100">
```

---

## Benefits After Migration

✅ **Global Theme Control:** Change entire app color by editing globals.css  
✅ **Dark Mode Harmony:** Dark mode colors automatically matched  
✅ **Consistency:** All components use same color palette  
✅ **Maintainability:** Single source of truth for colors  
✅ **Flexibility:** Easy to test different color schemes  
✅ **Professional:** Cohesive brand appearance  

---

## Current Status

- **Total Components with Hardcoded Colors:** ~20-25
- **Total Color References:** 200-300+
- **Estimated Fix Time:** 5-7 hours
- **Priority:** HIGH (affects theme switcher functionality)

---

**Next Step:** Begin Phase 1 - Fix Core UI Components

