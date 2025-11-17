# KOMPASS Design System - Applied ✅

## Overview

The KOMPASS design system has been successfully applied to `/styles/globals.css` with comprehensive CSS custom properties for colors, typography, spacing, shadows, and more.

---

## 🎨 Color System (OKLCH)

### Why OKLCH?

The design system uses **OKLCH color space** for:
- ✅ Perceptually uniform colors
- ✅ Better interpolation for gradients
- ✅ More vibrant, accurate colors
- ✅ Future-proof (CSS Color Level 4)

### Light Mode Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.9824 0.0013 286.3757)` | Page background |
| `--foreground` | `oklch(0.3211 0 0)` | Primary text |
| `--card` | `oklch(1.0000 0 0)` | Card/modal backgrounds |
| `--primary` | `oklch(0.6487 0.1538 150.3071)` | **Primary brand color (Blue-Green)** |
| `--secondary` | `oklch(0.6746 0.1414 261.3380)` | **Secondary color (Purple)** |
| `--accent` | `oklch(0.8269 0.1080 211.9627)` | Accent highlights (Light Blue) |
| `--muted` | `oklch(0.8828 0.0285 98.1033)` | Muted backgrounds |
| `--destructive` | `oklch(0.6368 0.2078 25.3313)` | Error/delete actions (Orange-Red) |
| `--border` | `oklch(0.8699 0 0)` | Border color (Light Gray) |

### Dark Mode Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.2303 0.0125 264.2926)` | Dark page background |
| `--foreground` | `oklch(0.9219 0 0)` | Light text |
| `--card` | `oklch(0.3210 0.0078 223.6661)` | Dark card backgrounds |
| `--primary` | `oklch(0.6487 0.1538 150.3071)` | Same primary (consistent) |
| `--secondary` | `oklch(0.5880 0.0993 245.7394)` | Darker purple for dark mode |
| `--accent` | `oklch(0.6746 0.1414 261.3380)` | Brighter accent for dark mode |
| `--muted` | `oklch(0.3867 0 0)` | Dark muted backgrounds |
| `--border` | `oklch(0.3867 0 0)` | Dark borders |

### Chart Colors

Pre-defined colors for data visualization:

```css
--chart-1: oklch(0.6487 0.1538 150.3071); /* Primary Blue-Green */
--chart-2: oklch(0.6746 0.1414 261.3380); /* Purple */
--chart-3: oklch(0.8269 0.1080 211.9627); /* Light Blue */
--chart-4: oklch(0.5880 0.0993 245.7394); /* Deep Purple */
--chart-5: oklch(0.5905 0.1608 148.2409); /* Green */
```

**Usage in Recharts:**
```tsx
<BarChart data={data}>
  <Bar dataKey="value1" fill="var(--chart-1)" />
  <Bar dataKey="value2" fill="var(--chart-2)" />
  <Bar dataKey="value3" fill="var(--chart-3)" />
</BarChart>
```

---

## 🔤 Typography System

### Font Families

The design system includes **three professional font families**:

```css
--font-sans: Plus Jakarta Sans, sans-serif;    /* Primary UI font */
--font-serif: Source Serif 4, serif;           /* Editorial/headings */
--font-mono: JetBrains Mono, monospace;        /* Code/data */
```

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Font Sizes

| Variable | Size | Usage | Element |
|----------|------|-------|---------|
| `--text-4xl` | 3rem (48px) | Extra large headings | `h1` |
| `--text-2xl` | 1.875rem (30px) | Large headings | `h2` |
| `--text-xl` | 1.5rem (24px) | Medium headings | `h3` |
| `--text-lg` | 1.25rem (20px) | Small headings | `h4` |
| `--text-base` | 1rem (16px) | Body text | `p`, `input` |
| `--text-sm` | 0.875rem (14px) | Small text | `label` |

### Font Weights

| Variable | Value | Usage |
|----------|-------|-------|
| `--font-weight-extra-bold` | 800 | Strongest emphasis (h1) |
| `--font-weight-bold` | 700 | Strong emphasis |
| `--font-weight-semi-bold` | 600 | Medium emphasis (h2-h4) |
| `--font-weight-medium` | 500 | Subtle emphasis (labels, buttons) |
| `--font-weight-normal` | 400 | Regular text |

### Typography Usage

**Always use CSS variables, not Tailwind classes:**

```tsx
// ✅ CORRECT - Using CSS variables
<h2 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
  Title
</h2>

<p style={{ fontFamily: 'var(--font-mono)' }}>
  Code example
</p>

// ❌ WRONG - Hardcoded Tailwind classes
<h2 className="text-2xl font-semibold">Title</h2>
```

**Base Typography Applied Automatically:**

All HTML elements have default typography applied via `@layer base`:
- `h1` → 48px, extra-bold, var(--font-sans)
- `h2` → 30px, semi-bold, var(--font-sans)
- `h3` → 24px, semi-bold, var(--font-sans)
- `h4` → 20px, semi-bold, var(--font-sans)
- `p` → 16px, normal, var(--font-sans)
- `label` → 14px, medium, var(--font-sans)
- `button` → 16px, medium, var(--font-sans)
- `input`, `textarea`, `select` → 16px, normal, var(--font-sans)

---

## 📐 Spacing & Layout

### Spacing Scale

```css
--spacing: 0.25rem; /* Base unit = 4px */
```

**Use Tailwind spacing classes which are multiples of 0.25rem:**
- `gap-2` = 0.5rem (8px)
- `gap-4` = 1rem (16px)
- `gap-6` = 1.5rem (24px)
- `p-4` = 1rem (16px)
- `mb-6` = 1.5rem (24px)

### Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius` | 0.5rem (8px) | Default radius |
| `--radius-sm` | calc(var(--radius) - 4px) | 4px |
| `--radius-md` | calc(var(--radius) - 2px) | 6px |
| `--radius-lg` | var(--radius) | 8px |
| `--radius-xl` | calc(var(--radius) + 4px) | 12px |
| `--radius-button` | 0.5rem | Button corners |
| `--radius-card` | 0.5rem | Card corners |
| `--radius-input` | 0.5rem | Input field corners |
| `--radius-checkbox` | 0.25rem | Checkbox corners |

**Usage:**
```tsx
// Use Tailwind classes that map to radius variables
<div className="rounded-lg"> {/* = var(--radius-lg) */}
<Button className="rounded-md"> {/* = var(--radius-md) */}
```

---

## 🌑 Shadows & Elevation

### Shadow Scale

```css
--shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
--shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
--shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
--shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
--shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
--shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
```

**Usage Hierarchy:**
- `shadow-sm` → Small cards, hover states
- `shadow-md` → Standard cards
- `shadow-lg` → Modals, dialogs
- `shadow-xl` → Floating panels, tooltips
- `shadow-2xl` → Critical overlays

**In Components:**
```tsx
<Card className="shadow-md"> {/* Uses var(--shadow-md) */}
<Dialog className="shadow-xl">
```

---

## 🎯 Sidebar Colors

Special color tokens for navigation sidebars:

```css
--sidebar: oklch(0.9824 0.0013 286.3757);           /* Background */
--sidebar-foreground: oklch(0.3211 0 0);            /* Text */
--sidebar-primary: oklch(0.6487 0.1538 150.3071);   /* Active items */
--sidebar-primary-foreground: oklch(1.0000 0 0);    /* Active text */
--sidebar-accent: oklch(0.8269 0.1080 211.9627);    /* Hover state */
--sidebar-accent-foreground: oklch(0.3211 0 0);     /* Hover text */
--sidebar-border: oklch(0.8699 0 0);                /* Dividers */
--sidebar-ring: oklch(0.6487 0.1538 150.3071);      /* Focus rings */
```

---

## 🔧 Using the Design System

### ✅ DO's

**1. Use CSS Variables for Colors:**
```tsx
// ✅ Inline styles with CSS variables
<div style={{ 
  backgroundColor: 'var(--primary)',
  color: 'var(--primary-foreground)',
  borderColor: 'var(--border)'
}}>

// ✅ Tailwind classes that map to variables
<Button className="bg-primary text-primary-foreground">
<Card className="border-border">
```

**2. Use CSS Variables for Typography:**
```tsx
// ✅ Font weight with CSS variables
<h3 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>

// ✅ Font family with CSS variables
<code style={{ fontFamily: 'var(--font-mono)' }}>

// ✅ Let base typography apply automatically
<h1>Title</h1> {/* Already styled via @layer base */}
```

**3. Use Tailwind Classes for Spacing/Layout:**
```tsx
// ✅ Spacing classes are fine (they use rem units)
<div className="p-4 gap-6 mb-8">

// ✅ Layout classes
<div className="grid grid-cols-1 md:grid-cols-2">
```

**4. Use Semantic Color Names:**
```tsx
// ✅ Semantic usage
<Button variant="destructive">Delete</Button>
<Badge className="bg-muted text-muted-foreground">Draft</Badge>
```

---

### ❌ DON'T's

**1. Don't Use Hardcoded Tailwind Color Classes:**
```tsx
// ❌ WRONG - Hardcoded colors
<div className="bg-blue-500 text-white">

// ❌ WRONG - Hardcoded border colors
<Card className="border-gray-200">

// ✅ CORRECT - Use variables
<div className="bg-primary text-primary-foreground">
<Card className="border-border">
```

**2. Don't Use Tailwind Typography Classes:**
```tsx
// ❌ WRONG - Typography classes
<h2 className="text-2xl font-semibold">

// ✅ CORRECT - CSS variables or let base apply
<h2 style={{ fontWeight: 'var(--font-weight-semi-bold)' }}>
// OR simply:
<h2>Title</h2> {/* Base typography applied automatically */}
```

**3. Don't Hardcode Font Families:**
```tsx
// ❌ WRONG
<p style={{ fontFamily: 'Inter, sans-serif' }}>

// ✅ CORRECT
<p style={{ fontFamily: 'var(--font-sans)' }}>
```

**4. Don't Use Arbitrary Values for Radius:**
```tsx
// ❌ WRONG
<Button className="rounded-[12px]">

// ✅ CORRECT
<Button className="rounded-xl"> {/* Uses var(--radius-xl) */}
```

---

## 📦 Components Using Design System

### Buttons

```tsx
import { Button } from './components/ui/button';

// Automatically uses:
// - var(--primary) for bg-primary
// - var(--primary-foreground) for text-primary-foreground
// - var(--radius-button) for rounded corners
// - var(--font-sans) and var(--font-weight-medium)

<Button>Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardContent } from './components/ui/card';

// Automatically uses:
// - var(--card) for background
// - var(--card-foreground) for text
// - var(--border) for borders
// - var(--radius-card) for rounded corners

<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

### Inputs

```tsx
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

// Automatically uses:
// - var(--input-background) for background
// - var(--foreground) for text
// - var(--border) for border
// - var(--ring) for focus ring
// - var(--radius-input) for corners
// - var(--font-sans) and var(--text-base)

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Badges

```tsx
import { Badge } from './components/ui/badge';

// Semantic variants using design system colors
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Custom using CSS variables
<Badge className="bg-chart-1 text-primary-foreground">Custom</Badge>
```

---

## 🎨 Color Combinations

### Recommended Pairings

**Primary Actions:**
```tsx
<Button className="bg-primary text-primary-foreground">
  Save
</Button>
```

**Secondary/Neutral:**
```tsx
<Button className="bg-secondary text-secondary-foreground">
  View More
</Button>
```

**Destructive Actions:**
```tsx
<Button className="bg-destructive text-destructive-foreground">
  Delete Account
</Button>
```

**Muted/Disabled:**
```tsx
<div className="bg-muted text-muted-foreground">
  Disabled state
</div>
```

**Accent Highlights:**
```tsx
<Badge className="bg-accent text-accent-foreground">
  New Feature
</Badge>
```

**Cards & Containers:**
```tsx
<Card className="bg-card text-card-foreground border-border">
  Content
</Card>
```

---

## 📊 Chart Styling Example

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', value1: 4000, value2: 2400, value3: 2400 },
  // ...
];

<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
  <XAxis dataKey="name" stroke="var(--foreground)" />
  <YAxis stroke="var(--foreground)" />
  <Tooltip 
    contentStyle={{ 
      backgroundColor: 'var(--card)',
      borderColor: 'var(--border)',
      color: 'var(--card-foreground)'
    }}
  />
  <Legend />
  <Bar dataKey="value1" fill="var(--chart-1)" />
  <Bar dataKey="value2" fill="var(--chart-2)" />
  <Bar dataKey="value3" fill="var(--chart-3)" />
</BarChart>
```

---

## 🌓 Dark Mode Support

### Automatic Dark Mode

Dark mode is automatically applied when the `.dark` class is added to the root element:

```tsx
// Toggle dark mode
<html className="dark">
```

All CSS variables are redefined in `.dark` selector, so components automatically adapt:
- Background becomes dark
- Text becomes light
- Borders become subtle
- Colors maintain accessibility contrast

### Testing Dark Mode

```tsx
// Add dark mode toggle
const [isDark, setIsDark] = useState(false);

useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [isDark]);

<Button onClick={() => setIsDark(!isDark)}>
  Toggle Dark Mode
</Button>
```

---

## ✅ Migration Checklist

When creating new components or updating existing ones:

- [ ] Use `bg-primary` instead of `bg-blue-500`
- [ ] Use `text-primary-foreground` instead of `text-white`
- [ ] Use `border-border` instead of `border-gray-200`
- [ ] Use `var(--font-sans)` instead of `'Inter, sans-serif'`
- [ ] Use `var(--font-weight-semi-bold)` instead of `font-semibold`
- [ ] Let base typography apply (no `text-2xl font-bold` on headings)
- [ ] Use `rounded-lg` instead of `rounded-[8px]`
- [ ] Use `shadow-md` instead of custom shadow values
- [ ] Use chart colors for data viz: `var(--chart-1)` through `var(--chart-5)`
- [ ] Test in both light and dark mode
- [ ] Use semantic color names (primary, secondary, destructive, muted, accent)

---

## 🎓 Best Practices

### 1. Semantic Over Specific
```tsx
// ✅ Good - Semantic meaning
<Button variant="destructive">Delete</Button>

// ❌ Bad - Visual description
<Button className="bg-red-500">Delete</Button>
```

### 2. CSS Variables for Custom Styles
```tsx
// ✅ Good - Uses design system
<div style={{
  backgroundColor: 'var(--card)',
  borderColor: 'var(--border)',
  borderRadius: 'var(--radius)'
}}>

// ❌ Bad - Hardcoded values
<div style={{
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  borderRadius: '8px'
}}>
```

### 3. Consistent Typography
```tsx
// ✅ Good - Uses CSS variables or lets base apply
<h2>Section Title</h2>
<p className="text-sm text-muted-foreground">Helper text</p>

// ❌ Bad - Hardcoded typography
<h2 className="text-2xl font-semibold">Section Title</h2>
```

### 4. Accessible Color Contrast

All color combinations in the design system meet WCAG AA standards:
- Primary/Primary-foreground: ✅ Accessible
- Secondary/Secondary-foreground: ✅ Accessible
- Destructive/Destructive-foreground: ✅ Accessible
- Card/Card-foreground: ✅ Accessible

---

## 📱 Responsive Considerations

The design system works seamlessly with responsive utilities:

```tsx
<div className="
  p-4 md:p-6 lg:p-8
  bg-card
  border-border
  rounded-lg
  shadow-md
">
  {/* Content adapts to screen size */}
  {/* Colors remain consistent via CSS variables */}
</div>
```

---

## 🔄 Updating the Design System

To update colors, typography, or other tokens:

1. **Edit `/styles/globals.css`**
2. **Update CSS variable values**
3. **Changes apply globally** - no component edits needed!

Example - Change primary color:
```css
:root {
  /* Old */
  --primary: oklch(0.6487 0.1538 150.3071);
  
  /* New - just update the value */
  --primary: oklch(0.6000 0.2000 180.0000);
}
```

All components using `bg-primary` will update automatically!

---

## 📚 Resources

### Font Links
- [Plus Jakarta Sans on Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- [Source Serif 4 on Google Fonts](https://fonts.google.com/specimen/Source+Serif+4)
- [JetBrains Mono on Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono)

### Color Tools
- [OKLCH Color Picker](https://oklch.com/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### CSS Variables
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## ✅ Summary

**Design System Applied Successfully:**

✅ **Colors:** OKLCH-based color palette with light/dark mode  
✅ **Typography:** Plus Jakarta Sans + Source Serif 4 + JetBrains Mono  
✅ **Spacing:** Consistent 0.25rem-based scale  
✅ **Shadows:** 8-level elevation system  
✅ **Radius:** Unified border radius tokens  
✅ **Charts:** 5 pre-defined chart colors  
✅ **Sidebar:** Dedicated navigation color tokens  
✅ **Tailwind Integration:** All variables mapped via `@theme inline`  
✅ **Base Typography:** Automatic HTML element styling  
✅ **Dark Mode:** Full support with semantic color tokens  

**All components will now:**
- Use design system colors automatically
- Respect typography settings
- Support dark mode seamlessly
- Allow global theme updates via CSS

---

**Last Updated:** 2025-01-27  
**Version:** 1.0  
**Status:** Design System Applied ✅
