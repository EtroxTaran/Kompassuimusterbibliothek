# Figma MCP → KOMPASS Quick Reference

## 🎨 Color Conversion Table

| Figma Color | CSS Variable | Tailwind Class |
|-------------|--------------|----------------|
| `#FFFFFF` | `var(--card)` | `bg-card` |
| `#F9FAFB` | `var(--background)` | `bg-background` |
| `#0066CC` | `var(--primary)` | `bg-primary` or `text-primary` |
| `#6B4FBB` | `var(--secondary)` | `bg-secondary` or `text-secondary` |
| `#4D9FFF` | `var(--accent)` | `bg-accent` or `text-accent` |
| `#333333` | `var(--foreground)` | `text-foreground` |
| `#6B7280` | `var(--muted-foreground)` | `text-muted-foreground` |
| `#E5E7EB` | `var(--border)` | `border-border` |
| `#F3F4F6` | `var(--muted)` | `bg-muted` |
| `#DC2626` | `var(--destructive)` | `bg-destructive` or `text-destructive` |

## 📏 Spacing Conversion

| Figma px | Tailwind Class | Rem Value |
|----------|----------------|-----------|
| `4px` | `p-1`, `gap-1`, `m-1` | `0.25rem` |
| `8px` | `p-2`, `gap-2`, `m-2` | `0.5rem` |
| `12px` | `p-3`, `gap-3`, `m-3` | `0.75rem` |
| `16px` | `p-4`, `gap-4`, `m-4` | `1rem` |
| `20px` | `p-5`, `gap-5`, `m-5` | `1.25rem` |
| `24px` | `p-6`, `gap-6`, `m-6` | `1.5rem` |
| `32px` | `p-8`, `gap-8`, `m-8` | `2rem` |

## 🔘 Border Radius Conversion

| Figma px | Design Token | Tailwind Class | Value |
|----------|--------------|----------------|-------|
| `4px` | `--radius-sm` | `rounded-sm` | `0.25rem` |
| `6px` | `--radius-md` | `rounded-md` | `0.375rem` |
| `8px` | `--radius-lg` | `rounded-lg` | `0.5rem` |
| `12px` | `--radius-xl` | `rounded-xl` | `0.625rem` |

## 🔤 Typography Conversion

### ❌ DON'T Use Tailwind Typography Classes

**Instead, use HTML elements directly:**

| Figma Style | HTML Element | Auto-Styling |
|-------------|--------------|--------------|
| Title 36px | `<h1>` | 36px, Extra Bold, 1.2 line-height |
| Title 24px | `<h2>` | 24px, Semi Bold, 1.3 line-height |
| Title 20px | `<h3>` | 20px, Semi Bold, 1.4 line-height |
| Title 18px | `<h4>` | 18px, Semi Bold, 1.4 line-height |
| Body 16px | `<p>` | 16px, Normal, 1.5 line-height |
| Label 14px | `<label>` | 14px, Medium, 1.4 line-height |

**Only use these when you MUST override:**
- `text-sm` (14px)
- `text-base` (16px)
- `text-lg` (18px)
- `text-xl` (20px)
- `text-2xl` (24px)

## 🧩 Component Replacement

| Figma Element | Replace With | Import From |
|---------------|--------------|-------------|
| Container/Frame | `<div className="container">` | Built-in |
| White Card | `<Card>` | `./components/ui/card` |
| Text Input | `<Input>` | `./components/ui/input` |
| Text Area | `<Textarea>` | `./components/ui/textarea` |
| Dropdown | `<Select>` | `./components/ui/select` |
| Checkbox | `<Checkbox>` | `./components/ui/checkbox` |
| Radio Button | `<RadioGroup>` | `./components/ui/radio-group` |
| Button | `<Button>` | `./components/ui/button` |
| Badge/Tag | `<Badge>` | `./components/ui/badge` |
| Avatar | `<Avatar>` | `./components/ui/avatar` |
| Progress Bar | `<Progress>` | `./components/ui/progress` |
| Table | `<Table>` | `./components/ui/table` |
| Modal | `<Dialog>` | `./components/ui/dialog` |
| Slide-out Panel | `<Sheet>` | `./components/ui/sheet` |
| Tooltip | `<Tooltip>` | `./components/ui/tooltip` |

## ⚡ Common Patterns

### Pattern 1: Card with Header

```tsx
// ❌ FIGMA OUTPUT
<div className="bg-white rounded-[12px] p-[24px] border border-[#E5E7EB]">
  <h3 className="text-[18px] font-[600] mb-[16px]">Title</h3>
  <p className="text-[#6B7280]">Content</p>
</div>

// ✅ KOMPASS DESIGN SYSTEM
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Content</p>
  </CardContent>
</Card>
```

### Pattern 2: Button with Icon

```tsx
// ❌ FIGMA OUTPUT
<button className="flex items-center gap-[8px] px-[16px] py-[8px] bg-[#0066CC] text-white rounded-[6px]">
  <svg>...</svg>
  <span className="font-[500]">Click Me</span>
</button>

// ✅ KOMPASS DESIGN SYSTEM
import { Plus } from 'lucide-react';

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Click Me
</Button>
```

### Pattern 3: Badge/Status

```tsx
// ❌ FIGMA OUTPUT
<div className="inline-flex px-[12px] py-[4px] bg-[#3B82F6] text-white rounded-[4px] text-[12px]">
  Active
</div>

// ✅ KOMPASS DESIGN SYSTEM
<Badge className="bg-primary text-primary-foreground">Active</Badge>
```

### Pattern 4: Input with Label

```tsx
// ❌ FIGMA OUTPUT
<div className="flex flex-col gap-[8px]">
  <label className="text-[14px] font-[500] text-[#111827]">Name</label>
  <input className="px-[12px] py-[8px] border border-[#D1D5DB] rounded-[6px]" />
</div>

// ✅ KOMPASS DESIGN SYSTEM
<div className="space-y-2">
  <Label>Name</Label>
  <Input />
</div>
```

### Pattern 5: KPI Card

```tsx
// ❌ FIGMA OUTPUT
<div className="bg-white p-[24px] rounded-[8px] border border-[#E5E7EB]">
  <div className="text-[#6B7280] text-[14px] mb-[8px]">Total Revenue</div>
  <div className="text-[#0066CC] text-[28px] font-[800]">€ 1.2M</div>
</div>

// ✅ KOMPASS DESIGN SYSTEM
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
  </CardHeader>
  <CardContent>
    <h2 className="text-primary">€ 1.2M</h2>
  </CardContent>
</Card>
```

## 🚫 Common Mistakes to Avoid

### 1. ❌ Arbitrary Values
```tsx
// DON'T
<div className="bg-[#0066CC] rounded-[12px] p-[24px]">

// DO
<div className="bg-primary rounded-lg p-6">
```

### 2. ❌ Inline Styles
```tsx
// DON'T
<div style={{ backgroundColor: '#0066CC', padding: '24px' }}>

// DO
<div className="bg-primary p-6">
```

### 3. ❌ Fixed Widths
```tsx
// DON'T
<div className="w-[800px] h-[600px]">

// DO
<div className="w-full max-w-3xl min-h-[600px]">
```

### 4. ❌ Typography Classes on Headers
```tsx
// DON'T
<h2 className="text-2xl font-bold">

// DO
<h2> {/* Uses design system h2 styles automatically */}
```

### 5. ❌ Custom Components
```tsx
// DON'T - Create custom button
function CustomButton() { ... }

// DO - Use shadcn component
import { Button } from './components/ui/button';
```

## 📋 Step-by-Step Refactor Checklist

When you import from Figma, follow this checklist:

- [ ] **Step 1**: Replace all `bg-[#HEX]` with design system classes
- [ ] **Step 2**: Replace all `text-[#HEX]` with design system classes
- [ ] **Step 3**: Convert arbitrary spacing `p-[24px]` → `p-6`
- [ ] **Step 4**: Convert arbitrary radius `rounded-[12px]` → `rounded-lg`
- [ ] **Step 5**: Remove inline `style={{}}` attributes
- [ ] **Step 6**: Replace HTML elements with shadcn components
- [ ] **Step 7**: Remove font-size/weight classes from headings
- [ ] **Step 8**: Test in light AND dark mode
- [ ] **Step 9**: Verify responsive behavior
- [ ] **Step 10**: Check accessibility (focus states, etc.)

## 🎯 Testing Theme Support

After refactoring, verify theme switching works:

```tsx
// All these should adapt to light/dark mode automatically:
✅ bg-background → changes with theme
✅ text-foreground → changes with theme
✅ border-border → changes with theme
✅ bg-primary → stays same in both themes
✅ bg-card → changes with theme

// These will NOT adapt (hardcoded):
❌ bg-white
❌ text-black
❌ border-gray-200
```

## 📱 Responsive Breakpoints

| Breakpoint | Tailwind Prefix | Min Width |
|------------|----------------|-----------|
| Mobile | (default) | 0px |
| Small | `sm:` | 640px |
| Medium | `md:` | 768px |
| Large | `lg:` | 1024px |
| XL | `xl:` | 1280px |
| 2XL | `2xl:` | 1536px |

Example:
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 col mobile, 2 cols tablet, 4 cols desktop */}
</div>
```

## 🔗 Resources

- **Full Guide**: `/FIGMA_MCP_DESIGN_SYSTEM_GUIDE.md`
- **Live Template**: Select "Figma Import Template" in the app dropdown
- **Design System**: `/styles/globals.css`
- **Components**: `/components/ui/`

## 💡 Pro Tips

1. **Always start with the template**: Copy the structure from `FigmaImportTemplate.tsx`
2. **Test dark mode immediately**: Don't wait until the end
3. **Use the comparison view**: The template shows correct vs incorrect side-by-side
4. **Keep Figma structure**: Preserve layout, replace colors/components
5. **Ask yourself**: "Will this work if I change the primary color in globals.css?"
