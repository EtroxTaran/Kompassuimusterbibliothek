# KOMPASS Design System for Figma MCP

## Overview

This guide explains how to use the KOMPASS design system as a template and layout foundation when importing designs from Figma via MCP (Model Context Protocol).

## Design System Architecture

### Core Principles

1. **CSS Variables First**: All styling uses CSS variables defined in `/styles/globals.css`
2. **Theme-Aware**: Full dark/light mode support with automatic switching
3. **Typography System**: Predefined font families and sizes for consistent text rendering
4. **Component Library**: Reusable shadcn/ui components with design system integration

---

## Design System Tokens

### Colors

#### Light Mode
- `--primary`: oklch(0.6487 0.1538 150.3071) - Professional blue
- `--secondary`: oklch(0.6746 0.1414 261.3380) - Accent purple
- `--accent`: oklch(0.8269 0.1080 211.9627) - Light blue accent
- `--background`: oklch(0.9824 0.0013 286.3757) - Near white
- `--foreground`: oklch(0.3211 0 0) - Dark text
- `--muted`: oklch(0.8828 0.0285 98.1033) - Muted background
- `--border`: oklch(0.8699 0 0) - Border color
- `--destructive`: oklch(0.6368 0.2078 25.3313) - Error red

#### Dark Mode
All color variables automatically switch when `.dark` class is applied to the root element.

### Typography

#### Font Families
```css
--font-sans: Plus Jakarta Sans, sans-serif;
--font-serif: Source Serif 4, serif;
--font-mono: JetBrains Mono, monospace;
```

#### Font Hierarchy
- **h1**: `var(--text-4xl)` | `var(--font-weight-extra-bold)` | line-height: 1.2
- **h2**: `var(--text-2xl)` | `var(--font-weight-semi-bold)` | line-height: 1.3
- **h3**: `var(--text-xl)` | `var(--font-weight-semi-bold)` | line-height: 1.4
- **h4**: `var(--text-lg)` | `var(--font-weight-semi-bold)` | line-height: 1.4
- **p**: `var(--text-base)` | `var(--font-weight-normal)` | line-height: 1.5
- **label**: `var(--text-sm)` | `var(--font-weight-medium)` | line-height: 1.4

### Spacing & Layout

#### Border Radius
```css
--radius-sm: calc(var(--radius) - 4px);  /* 0.25rem / 4px */
--radius-md: calc(var(--radius) - 2px);  /* 0.375rem / 6px */
--radius-lg: var(--radius);              /* 0.5rem / 8px */
--radius-xl: calc(var(--radius) + 4px);  /* 0.625rem / 10px */
```

#### Shadows
```css
--shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
--shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
```

---

## How to Use with Figma MCP

### Step 1: Design in Figma

When creating designs in Figma that will be imported into KOMPASS:

1. **Use the color palette**:
   - Primary Blue: `#0066CC` (maps to `--primary`)
   - Secondary Purple: `#6B4FBB` (maps to `--secondary`)
   - Accent Light Blue: `#4D9FFF` (maps to `--accent`)
   - Text Dark: `#333333` (maps to `--foreground`)
   - Background: `#F9FAFB` (maps to `--background`)

2. **Use the typography system**:
   - Headings: Plus Jakarta Sans (600-800 weight)
   - Body: Plus Jakarta Sans (400-500 weight)
   - Code/Mono: JetBrains Mono

3. **Use consistent spacing**:
   - Base unit: 4px (0.25rem)
   - Common spacing: 8px, 12px, 16px, 24px, 32px

### Step 2: Import from Figma

When you import a Figma design:

```tsx
// The imported code will be in a file like:
// /imports/FigmaImport.tsx
import FigmaImport from './imports/FigmaImport';
```

### Step 3: Replace Hardcoded Values

**❌ AVOID** hardcoded colors:
```tsx
<div className="bg-blue-600 text-white">
```

**✅ USE** design system variables:
```tsx
<div className="bg-primary text-primary-foreground">
```

**❌ AVOID** arbitrary values:
```tsx
<div className="text-[#0066CC] rounded-[12px]">
```

**✅ USE** semantic tokens:
```tsx
<div className="text-primary rounded-lg">
```

### Step 4: Refactor to Components

After importing, refactor the Figma code to use KOMPASS components:

**Example: Before**
```tsx
<div className="bg-white p-6 rounded-lg shadow border">
  <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
  <p className="text-gray-600">Customer information goes here</p>
</div>
```

**Example: After**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Customer Details</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Customer information goes here</p>
  </CardContent>
</Card>
```

---

## Design System Component Mapping

### Layout Components

| Figma Element | KOMPASS Component | Import |
|--------------|-------------------|--------|
| Frame/Container | `<div className="container">` | Built-in |
| Card | `<Card>` | `./components/ui/card` |
| Sidebar | `<Sidebar>` | `./components/ui/sidebar` |
| Sheet/Modal | `<Sheet>` or `<Dialog>` | `./components/ui/sheet` |

### Form Components

| Figma Element | KOMPASS Component | Import |
|--------------|-------------------|--------|
| Text Input | `<Input>` | `./components/ui/input` |
| Textarea | `<Textarea>` | `./components/ui/textarea` |
| Select | `<Select>` | `./components/ui/select` |
| Checkbox | `<Checkbox>` | `./components/ui/checkbox` |
| Radio | `<RadioGroup>` | `./components/ui/radio-group` |
| Button | `<Button>` | `./components/ui/button` |

### Data Display

| Figma Element | KOMPASS Component | Import |
|--------------|-------------------|--------|
| Table | `<Table>` | `./components/ui/table` |
| Badge/Tag | `<Badge>` | `./components/ui/badge` |
| Avatar | `<Avatar>` | `./components/ui/avatar` |
| Progress | `<Progress>` | `./components/ui/progress` |

---

## Tailwind Class Mapping

### Colors

| Hardcoded | Design System Class |
|-----------|---------------------|
| `bg-blue-600` | `bg-primary` |
| `text-blue-600` | `text-primary` |
| `bg-purple-600` | `bg-secondary` |
| `bg-white` | `bg-card` |
| `text-gray-900` | `text-foreground` |
| `text-gray-600` | `text-muted-foreground` |
| `bg-gray-100` | `bg-muted` |
| `border-gray-200` | `border-border` |

### Border Radius

| Hardcoded | Design System Class |
|-----------|---------------------|
| `rounded-sm` | `rounded-sm` (uses `--radius-sm`) |
| `rounded-md` | `rounded-md` (uses `--radius-md`) |
| `rounded-lg` | `rounded-lg` (uses `--radius-lg`) |

### Shadows

| Hardcoded | Design System Class |
|-----------|---------------------|
| `shadow-sm` | `shadow-sm` (uses `--shadow-sm`) |
| `shadow` | `shadow` (uses `--shadow`) |
| `shadow-md` | `shadow-md` (uses `--shadow-md`) |
| `shadow-lg` | `shadow-lg` (uses `--shadow-lg`) |

---

## Best Practices

### ✅ DO

1. **Always use design system classes**:
   ```tsx
   <Button variant="default" className="bg-primary">
   ```

2. **Use semantic color names**:
   ```tsx
   <div className="text-foreground bg-background">
   ```

3. **Preserve Figma layout structure** but replace colors:
   ```tsx
   // Keep the layout classes, replace colors
   <div className="flex gap-4 p-6 bg-card border-border rounded-lg">
   ```

4. **Use existing components** when possible:
   ```tsx
   import { Card } from './components/ui/card';
   ```

### ❌ DON'T

1. **Don't use arbitrary color values**:
   ```tsx
   ❌ <div className="bg-[#0066CC]">
   ✅ <div className="bg-primary">
   ```

2. **Don't override font families** unless using mono/serif:
   ```tsx
   ❌ <p className="font-['Arial']">
   ✅ <p className="font-mono"> {/* for code */}
   ```

3. **Don't use hardcoded sizes for typography**:
   ```tsx
   ❌ <h2 className="text-2xl font-bold">
   ✅ <h2> {/* Uses design system h2 styles */}
   ```

4. **Don't create custom components** when shadcn/ui has one:
   ```tsx
   ❌ Create your own Button
   ✅ import { Button } from './components/ui/button'
   ```

---

## Workflow Example

### 1. Import Figma Design

```tsx
// Figma generates this (simplified example)
<div className="bg-white rounded-[12px] p-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
  <h2 className="text-[#333333] text-[20px] font-[600] mb-[16px]">
    Project Overview
  </h2>
  <div className="bg-[#F3F4F6] p-[16px] rounded-[8px]">
    <p className="text-[#6B7280] text-[14px]">
      Total: 15 projects
    </p>
  </div>
</div>
```

### 2. Refactor to Design System

```tsx
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

// Refactored to use design system
<Card>
  <CardHeader>
    <CardTitle>Project Overview</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="bg-muted p-4 rounded-md">
      <p className="text-muted-foreground text-sm">
        Total: 15 projects
      </p>
    </div>
  </CardContent>
</Card>
```

### 3. Result

- ✅ Theme switching works automatically (light/dark)
- ✅ Colors can be updated globally via `/styles/globals.css`
- ✅ Typography is consistent across the app
- ✅ Components are reusable and maintainable

---

## Application Layout Structure

### Main App Layout

```tsx
// /App.tsx structure
import { ThemeProvider } from './components/theme/ThemeProvider';
import { SidebarProvider, Sidebar } from './components/ui/sidebar';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar navigation */}
          <Sidebar>
            {/* Navigation items */}
          </Sidebar>
          
          {/* Main content area */}
          <main className="flex-1 p-6">
            {/* Your Figma imported content goes here */}
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
```

### Page Layout Pattern

```tsx
// Standard page layout for KOMPASS
<div className="space-y-6">
  {/* Page Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1>Page Title</h1>
      <p className="text-muted-foreground">Page description</p>
    </div>
    <Button>Primary Action</Button>
  </div>

  {/* KPI Cards */}
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader>
        <CardTitle>KPI Title</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-primary">€ 125,000</h2>
      </CardContent>
    </Card>
  </div>

  {/* Main Content */}
  <Card>
    <CardHeader>
      <CardTitle>Content Section</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Your content */}
    </CardContent>
  </Card>
</div>
```

---

## Theme Integration

### Using Theme Context

```tsx
import { useTheme } from './components/theme/ThemeProvider';

function YourComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      {/* Component automatically uses theme colors */}
    </div>
  );
}
```

### Theme-Aware Styling

All components automatically respond to theme changes when using design system classes:

```tsx
// This works in both light and dark mode
<div className="bg-card text-card-foreground border-border">
  <h3>This text adapts to the theme</h3>
  <Button variant="default" className="bg-primary text-primary-foreground">
    This button also adapts
  </Button>
</div>
```

---

## Common Figma Import Issues & Solutions

### Issue 1: Absolute Positioned Elements

**Problem**: Figma often uses absolute positioning
```tsx
<div className="absolute left-[24px] top-[48px]">
```

**Solution**: Convert to flex/grid layouts
```tsx
<div className="flex items-center gap-6 p-6">
```

### Issue 2: Fixed Width/Heights

**Problem**: Figma sets fixed dimensions
```tsx
<div className="w-[320px] h-[480px]">
```

**Solution**: Use responsive classes
```tsx
<div className="w-full max-w-sm min-h-[480px]">
```

### Issue 3: Inline Styles

**Problem**: Figma generates inline styles
```tsx
<div style={{ backgroundColor: '#0066CC', padding: '24px' }}>
```

**Solution**: Convert to Tailwind classes
```tsx
<div className="bg-primary p-6">
```

### Issue 4: Non-Semantic Color Usage

**Problem**: Using specific color shades
```tsx
<div className="bg-blue-600 text-blue-100">
```

**Solution**: Use semantic tokens
```tsx
<div className="bg-primary text-primary-foreground">
```

---

## Quick Reference Card

### Essential Classes

```tsx
// Backgrounds
bg-background       // Main app background
bg-card            // Card backgrounds
bg-muted           // Subtle backgrounds
bg-primary         // Primary actions
bg-accent          // Accent elements

// Text
text-foreground    // Primary text
text-muted-foreground  // Secondary text
text-primary       // Primary colored text
text-destructive   // Error text

// Borders
border-border      // Standard borders
border-primary     // Highlighted borders
border-destructive // Error borders

// Interactive States
hover:bg-accent/50     // Hover states
focus:ring-ring       // Focus rings
disabled:opacity-50   // Disabled state
```

### Typography Classes (USE SPARINGLY)

Only use these when you need to override the default HTML element styling:

```tsx
text-sm            // Small text (labels, captions)
text-base          // Base text (paragraphs) 
text-lg            // Large text (subheadings)
text-xl            // Extra large (section titles)
text-2xl           // 2XL (page titles)

font-medium        // Medium weight
font-semibold      // Semibold weight
font-bold          // Bold weight
```

---

## Updating the Design System

To change colors, spacing, or other tokens globally:

1. **Edit `/styles/globals.css`**
2. **Modify the CSS variables** in `:root` (light mode) or `.dark` (dark mode)
3. **All components update automatically**

Example: Change primary color

```css
/* In /styles/globals.css */
:root {
  --primary: oklch(0.65 0.20 260);  /* Change to purple */
}

.dark {
  --primary: oklch(0.65 0.20 260);  /* Same for dark mode */
}
```

All buttons, links, and primary-colored elements across the entire app will update instantly.

---

## Support & Resources

- **Design System File**: `/styles/globals.css`
- **Component Library**: `/components/ui/`
- **Theme Provider**: `/components/theme/ThemeProvider.tsx`
- **Example Layouts**: See any component in `/components/` for patterns

For questions or issues with Figma imports, reference this guide and ensure all hardcoded values are converted to design system tokens.
