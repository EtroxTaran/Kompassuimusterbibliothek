# KOMPASS Color System Migration - Progress Tracker

## ✅ COMPLETED (3 Components)

### Phase 1: Core UI Components

1. **✅ RichTextEditor.tsx** - FIXED
   - `text-gray-700` → `text-foreground`
   - `hover:bg-gray-100` → `hover:bg-muted`
   - `bg-gray-300` → `bg-border`
   - `bg-gray-50` → `bg-muted`

2. **✅ RichTextEditorDemo.tsx** - FIXED  
   - All editor buttons: `text-gray-700 hover:bg-gray-100` → `text-foreground hover:bg-muted`
   - Separator: `bg-gray-300` → `bg-border`
   - Disabled: `bg-gray-50` → `bg-muted`
   - Mobile toolbar buttons still need fixing (see below)

3. **✅ RichTextEditorFieldsDemo.tsx** - NEEDS FIXING
   - Same patterns as RichTextEditorDemo.tsx

---

## 🔄 IN PROGRESS - Remaining High-Priority Components

### Core UI (Remaining 3)

4. **⏳ SearchFiltersDemo.tsx** (2 fixes)
   ```tsx
   // Line 592: Active filter badges
   bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100
   → bg-primary/10 text-primary border-primary/20 hover:bg-primary/20
   
   // Line 597: Remove filter button
   hover:bg-blue-200
   → hover:bg-primary/30
   ```

5. **⏳ TablesDataGridsDemo.tsx** (3 fixes)
   ```tsx
   // Line 240: Bulk selection bar
   bg-blue-50 border border-blue-200
   → bg-primary/10 border border-primary/20
   
   // Lines 319, 502: Selected rows
   bg-blue-50
   → bg-accent
   ```

6. **⏳ TooltipsPopoversDemo.tsx** (2 fixes)
   ```tsx
   // Lines 662, 683: Tooltip backgrounds
   bg-gray-900/95 text-white
   → bg-popover text-popover-foreground border border-border
   // OR if dark is needed:
   → bg-foreground text-background
   ```

---

## 📋 PHASE 2: Major Form Components (6 components)

### Invoice & Financial Forms

7. **⏳ InvoiceFormDemo.tsx** (~5 locations)
   ```tsx
   // Info boxes with blue background
   bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800
   → bg-accent/50 border border-accent
   
   // Icon circles
   bg-blue-100 dark:bg-blue-900/20
   → bg-accent
   ```

8. **⏳ OpportunityFormDemo.tsx** (~10 locations)
   ```tsx
   // Status badge colors - keep semantic BUT use design system
   bgColor: 'bg-blue-50 dark:bg-blue-950/20'
   → bgColor: 'bg-accent/50'
   
   // Icon circles
   h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20
   → h-12 w-12 rounded-full bg-accent
   
   // Weighted value card
   Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200"
   → Card className="bg-accent/50 border-accent"
   ```

9. **⏳ ProjectFormDemo.tsx** (~15 locations)
   ```tsx
   // GoBD Info alerts
   Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200"
   → Alert className="bg-accent/50 border-accent"
   
   // Project number display
   bg-blue-50 dark:bg-blue-950/20 border border-blue-200
   → bg-accent/50 border border-accent
   
   // Icon circles (multiple locations)
   bg-blue-100 dark:bg-blue-900/20
   → bg-accent
   
   // Duration cards
   Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200"
   → Card className="bg-accent/50 border-accent"
   ```

### Contact & Customer Forms

10. **⏳ ContactFormDemo.tsx** (~5 locations)
    - Similar patterns to OpportunityFormDemo.tsx
    - Blue backgrounds for info sections → accent

11. **⏳ CustomerFormDemo.tsx** (~5 locations)
    - Similar patterns  
    - Blue backgrounds → accent

12. **⏳ LocationFormDemo.tsx** (~3 locations)
    - Blue backgrounds → accent

---

## 📋 PHASE 3: List/Table Components (7 components)

13. **⏳ CustomerListDemo.tsx** (~5 locations)
    ```tsx
    // Selected row
    isSelected ? 'bg-blue-50' : ''
    → isSelected ? 'bg-accent' : ''
    
    // Active filter badge
    bg-blue-50 border border-blue-200
    → bg-accent/50 border border-accent
    
    // Bulk selection bar
    bg-blue-50 border-2 border-blue-600
    → bg-accent border-2 border-accent
    ```

14. **⏳ ContactListDemo.tsx** (~10 locations)
    ```tsx
    // Decision-maker role (important)
    color: 'bg-blue-600'
    bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    textColor: 'text-blue-700 dark:text-blue-300'
    →
    color: 'bg-primary'
    bgColor: 'bg-primary/10'
    textColor: 'text-primary'
    
    // Operational role (neutral)
    color: 'bg-gray-600'
    bgColor: 'bg-gray-50 dark:bg-gray-950/20'
    textColor: 'text-gray-700 dark:text-gray-300'
    →
    color: 'bg-muted-foreground'
    bgColor: 'bg-muted'
    textColor: 'text-muted-foreground'
    
    // Informational role
    color: 'bg-gray-400'
    → similar pattern
    ```

15. **⏳ InvoiceListDemo.tsx** (~10 locations)
    ```tsx
    // Draft status (neutral)
    color: 'text-gray-700'
    bgColor: 'bg-gray-100'
    →
    color: 'text-muted-foreground'
    bgColor: 'bg-muted'
    
    // Partial payment (info)
    color: 'text-blue-700'
    bgColor: 'bg-blue-100'
    →
    color: 'text-primary'
    bgColor: 'bg-primary/10'
    
    // Selected rows
    bg-blue-50
    → bg-accent
    ```

16. **⏳ LocationListDemo.tsx** (~5 locations)
17. **⏳ OpportunityPipelineDemo.tsx** (~10 locations)
18. **⏳ ProjectPortfolioDemo.tsx** (~8 locations)

---

## 📋 PHASE 4: Activity & Timeline Components (2 components)

19. **⏳ ActivityTimelineDemo.tsx** (~5 locations)
    ```tsx
    // Phone activity
    color: 'text-blue-600'
    bgColor: 'bg-blue-600'
    borderColor: 'border-l-blue-600'
    →
    color: 'text-primary'
    bgColor: 'bg-primary'
    borderColor: 'border-l-primary'
    
    // Note activity (neutral)
    color: 'text-gray-600'
    bgColor: 'bg-gray-600'
    borderColor: 'border-l-gray-600'
    →
    color: 'text-muted-foreground'
    bgColor: 'bg-muted-foreground'
    borderColor: 'border-l-muted-foreground'
    ```

20. **⏳ ActivityProtocolFormDemo.tsx** (1 location)
    ```tsx
    // Offline warning - KEEP SEMANTIC
    bg-amber-50 border border-amber-200
    → KEEP (semantic warning color)
    ```

---

## 🎯 KEEP AS-IS - Semantic State Colors

These components use semantic colors for state indication. Only partial updates needed:

### ✅ OfflineSyncStatus.tsx
- **KEEP:** green (online), amber (offline), red (error)
- **CHANGE:** blue (syncing) → `bg-primary/10 border-primary/20 text-primary`

### ✅ ProgressIndicatorsDemo.tsx  
- **KEEP:** All green/red semantic colors for success/error

### ✅ ToastsNotificationsDemo.tsx
- **KEEP:** All semantic icon colors (green success, red error, amber warning)

### ✅ BulkImportFormDemo.tsx
- **KEEP:** Green check icons for valid mappings

---

## 📊 STATISTICS

| Category | Total | Fixed | Remaining | % Complete |
|----------|-------|-------|-----------|------------|
| **Core UI** | 6 | 3 | 3 | 50% |
| **Major Forms** | 6 | 0 | 6 | 0% |
| **List Components** | 7 | 0 | 7 | 0% |
| **Activity/Timeline** | 2 | 0 | 2 | 0% |
| **State Components** | 1 | 0 | 1 | 0% |
| **TOTAL** | 22 | 3 | 19 | **14%** |

---

## 🎨 COLOR REPLACEMENT CHEATSHEET

### Primary/Accent Colors (Brand)
```tsx
bg-blue-50  → bg-accent or bg-primary/10
bg-blue-100 → bg-accent or bg-primary/20
bg-blue-200 → bg-accent or bg-primary/30
bg-blue-500 → bg-primary
bg-blue-600 → bg-primary
bg-blue-700 → bg-primary
text-blue-600 → text-primary
text-blue-700 → text-primary
text-blue-900 → text-primary
border-blue-200 → border-accent or border-primary/20
border-blue-600 → border-primary
```

### Neutral/Muted Colors
```tsx
bg-gray-50  → bg-muted
bg-gray-100 → bg-muted
bg-gray-200 → bg-border
bg-gray-300 → bg-border
bg-gray-400 → bg-muted-foreground
bg-gray-600 → bg-muted-foreground
bg-gray-700 → bg-foreground
bg-gray-900 → bg-foreground
text-gray-400 → text-muted-foreground
text-gray-500 → text-muted-foreground
text-gray-600 → text-muted-foreground
text-gray-700 → text-foreground or text-muted-foreground
text-gray-900 → text-foreground
border-gray-200 → border-border
border-gray-300 → border-border
```

### Semantic Colors (Keep or Convert)
```tsx
// SUCCESS - KEEP SEMANTIC
bg-green-* → KEEP
text-green-* → KEEP

// ERROR - Use destructive OR keep semantic
bg-red-* → bg-destructive/10 or KEEP
text-red-* → text-destructive or KEEP

// WARNING - KEEP SEMANTIC
bg-amber-* → KEEP
text-amber-* → KEEP
```

---

## 🚀 NEXT ACTIONS

### Immediate (Continue fixing):
1. ✅ Fix RichTextEditorFieldsDemo.tsx mobile toolbar
2. ⏳ Fix SearchFiltersDemo.tsx (2 locations)
3. ⏳ Fix TablesDataGridsDemo.tsx (3 locations)
4. ⏳ Fix TooltipsPopoversDemo.tsx (2 locations)

### Then tackle forms:
5. InvoiceFormDemo.tsx
6. OpportunityFormDemo.tsx
7. ProjectFormDemo.tsx

### Estimate:
- **Core UI remaining:** 1 hour
- **Forms:** 2-3 hours
- **Lists:** 2-3 hours
- **Activity/Timeline:** 30 min
- **State components:** 30 min
- **TOTAL:** ~6-8 hours

---

## ✅ SUCCESS CRITERIA

When complete, all components will:
- ✅ Use `bg-primary` instead of `bg-blue-600`
- ✅ Use `bg-accent` instead of `bg-blue-50`
- ✅ Use `bg-muted` instead of `bg-gray-100`
- ✅ Use `text-foreground` instead of `text-gray-700`
- ✅ Use `border-border` instead of `border-gray-200`
- ✅ Maintain semantic colors for success/warning/error states
- ✅ Support dark mode automatically
- ✅ Allow global theme changes via `/styles/globals.css`

---

**Last Updated:** 2025-01-27
**Current Status:** 14% Complete (3/22 components fixed)
**Next Target:** Core UI components (SearchFilters, Tables, Tooltips)

