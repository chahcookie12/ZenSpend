# ZenSpend - Design Guide

## 🎨 Visual Language

This guide documents the visual design system for ZenSpend - a financial wellness app that feels like Headspace, not a finance tool.

---

## Color Palette

### Primary Colors

```css
/* Cream (Background) */
--cream-default: #FAF7F0
--cream-50:      #FFFFFF
--cream-100:     #F8F6F2
--cream-200:     #F5F1E8
--cream-300:     #F2ECDF
--cream-400:     #EFE7D6

/* Sage Green (Primary) */
--sage-default: #8FB3A2
--sage-50:      #E8F0EC
--sage-100:     #D1E1D9
--sage-200:     #BAD2C6
--sage-300:     #A3C3B3
--sage-400:     #8FB3A2
--sage-500:     #7FAF9A
--sage-600:     #6A9B87
--sage-700:     #558774
```

### Accent Colors

```css
/* Soft Olive */
--olive-default: #B8A990
--olive-light:   #D4C9B5
--olive-dark:    #9C8F73

/* Muted Terracotta */
--terracotta-default: #D8B5A8
--terracotta-light:   #E8D1C8
--terracotta-dark:    #C89B88
```

### Usage Guidelines

✅ **DO:**
- Use cream for all backgrounds
- Use sage for interactive elements
- Use olive/terracotta for accent cards
- Keep colors soft and muted

❌ **DON'T:**
- Use red (creates alarm)
- Use harsh/bright green (feels financial)
- Use pure white (too stark)
- Use blue (feels corporate)

---

## Typography

### Font Family
```css
font-family: 'Plus Jakarta Sans', 'DM Sans', 'Manrope', system-ui, sans-serif;
```

### Font Sizes & Line Heights

```css
text-xs:   0.875rem / 1.5     /* Small labels */
text-sm:   1rem / 1.6         /* Secondary text */
text-base: 1.125rem / 1.7     /* Body text */
text-lg:   1.25rem / 1.7      /* Emphasized text */
text-xl:   1.5rem / 1.6       /* Section titles */
text-2xl:  1.875rem / 1.5     /* Page headings */
text-3xl:  2.25rem / 1.4      /* Hero text */
text-4xl:  3rem / 1.3         /* Large display */
```

### Font Weights
- **300** (Light) - Hero text, large headings
- **400** (Regular) - Body text, most content
- **500** (Medium) - Emphasized labels
- **600** (Semibold) - Active states only

### Typography Rules

✅ **DO:**
- Use larger sizes than traditional apps
- Maintain comfortable line heights (1.5+)
- Keep font weights soft (mostly 300-400)
- Choose readability over style

❌ **DON'T:**
- Use small text (< 14px)
- Use bold weights everywhere
- Compress line height
- Use all caps for long text

---

## Spacing System

### Padding & Margins

```css
/* Tailwind classes used */
p-3:  12px   /* Tight spacing */
p-4:  16px   /* Compact */
p-6:  24px   /* Comfortable */
p-8:  32px   /* Generous */
p-12: 48px   /* Spacious */

gap-2:  8px   /* Tight groups */
gap-3:  12px  /* Related items */
gap-4:  16px  /* Separated items */
gap-6:  24px  /* Distinct sections */
gap-8:  32px  /* Major sections */
```

### Layout Principles

- **Max width**: 448px (max-w-md) for content
- **Screen padding**: 24px (px-6) horizontal
- **Section spacing**: 32px (space-y-8) vertical
- **Card spacing**: 12-16px (gap-3, gap-4) between items

✅ **DO:**
- Give elements room to breathe
- Use consistent spacing scales
- Add extra space around CTAs
- Create visual hierarchy with space

❌ **DON'T:**
- Pack information densely
- Use inconsistent spacing
- Reduce space to fit more
- Ignore mobile screen constraints

---

## Components

### Buttons

#### Primary Button
```jsx
className="bg-sage-500 hover:bg-sage-600 text-white 
           rounded-3xl py-6 px-8 text-lg 
           transition-colors"
```

#### Secondary Button
```jsx
className="bg-cream-100 hover:bg-cream-200 text-sage-700 
           rounded-3xl py-6 px-8 text-lg 
           transition-colors"
```

#### Icon Button (FAB)
```jsx
className="w-14 h-14 bg-sage-500 hover:bg-sage-600 
           text-white rounded-full text-2xl 
           flex items-center justify-center 
           transition-colors"
```

**Button Guidelines:**
- Always use rounded-3xl (24px border radius)
- Large touch targets (min 44px height)
- Soft color transitions
- Clear hover states

### Cards

#### Default Card
```jsx
className="bg-cream-100 rounded-3xl p-8"
```

#### Insight Card
```jsx
className="bg-sage-100 rounded-3xl p-8 space-y-3"
/* or bg-olive-light/30, bg-terracotta-light/40 */
```

#### List Item Card
```jsx
className="bg-cream-100 rounded-2xl p-5"
```

**Card Guidelines:**
- Use rounded-3xl for standalone cards
- Use rounded-2xl for list items
- Generous padding (p-6 to p-8)
- Soft background colors

### Inputs

#### Text Input
```jsx
className="w-full bg-cream-100 text-sage-700 text-lg 
           rounded-3xl py-6 px-8 
           focus:outline-none focus:ring-2 focus:ring-sage-300 
           transition-all"
```

**Input Guidelines:**
- Large, comfortable size
- Rounded corners (rounded-3xl)
- Soft focus ring (sage-300)
- Clear placeholder text

### Navigation

#### Bottom Nav Item
```jsx
<button className="flex flex-col items-center gap-1 px-4 py-2">
  <span className="text-2xl text-sage-600">◯</span>
  <span className="text-xs text-sage-700">Home</span>
</button>
```

**Nav Guidelines:**
- Circular icons (◯ ◐ ◉ ◑ ◔)
- Large icons (text-2xl)
- Small labels (text-xs)
- Active indicator dot

---

## Animations

### Page Transitions

```jsx
// Horizontal slide
variants={{
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 }
}}
transition={{ 
  type: 'spring', 
  stiffness: 300, 
  damping: 30 
}}
```

### Micro-interactions

```jsx
// Gentle tap feedback
whileTap={{ scale: 0.95 }}

// Fade in on mount
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 }}
```

### Breathing Animation

```jsx
animate={{
  scale: [1, 1.5, 1],
  opacity: [0.8, 1, 0.8]
}}
transition={{ 
  duration: 6, 
  ease: 'easeInOut', 
  repeat: Infinity 
}}
```

**Animation Guidelines:**
- Slow and intentional
- Spring-based transitions
- Subtle scale changes
- Opacity for smoothness

---

## Iconography

### Icon System

Using simple geometric shapes:
- **◯** Circle - Home, beginning
- **◐** Half circle - Expenses, tracking
- **◉** Filled circle - Pause, focus
- **◑** Reverse half - Insights, reflection
- **◔** Quarter circle - Chat, connection

**Icon Guidelines:**
- Geometric and minimal
- Large size (text-2xl to text-5xl)
- Sage color palette
- No complex illustrations

---

## Microcopy

### Tone of Voice

**Characteristics:**
- Calm
- Non-judgmental  
- Brief (1-2 sentences max)
- Human
- Supportive

### Examples

✅ **Good:**
- "Take your time."
- "How are you feeling today?"
- "There's no rush."
- "You're allowed to pause."
- "No judgment. Just awareness."
- "Notice how that feels."

❌ **Avoid:**
- "You should save more money"
- "Warning: Over budget!"
- "Optimize your spending"
- "Bad financial decision"
- Long explanatory paragraphs

### Reframing Finance Terms

| Traditional | ZenSpend |
|------------|----------|
| Remaining budget | Room to breathe |
| Financial stress | Financial weather |
| Overspending alert | Spending is higher (no judgment) |
| Budget categories | (Not used - too rigid) |
| Financial health score | (Not used - too judgmental) |

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Body text on cream: 7:1
- Sage-700 on cream: 4.5:1
- White on sage-500: 4.5:1

### Touch Targets

- Minimum: 44x44px
- Preferred: 56x56px (text-2xl icons + padding)
- Spacing: 8px between targets

### Focus States

All interactive elements have visible focus rings:
```css
focus:outline-none focus:ring-2 focus:ring-sage-300
```

### Motion

All animations are intentional and slow. Users can reduce motion in system settings (respects prefers-reduced-motion).

---

## Mobile-First Principles

### Breakpoints

```css
/* Mobile: < 640px (default) */
/* Tablet: 640px+ (sm:) */
/* Desktop: 1024px+ (lg:) */
```

Design for mobile first, enhance for larger screens.

### Gestures

- **Horizontal swipe**: Navigate between pages
- **Tap**: Interact with elements
- **Long press**: (Not used - keep simple)
- **Pinch/zoom**: (Not needed - text already large)

### Safe Areas

Account for notches and home indicators:
```css
safe-area-bottom /* on bottom navigation */
```

---

## Layout Patterns

### Full-Screen Ritual (Pause)

```jsx
<div className="h-full flex flex-col">
  <div className="flex-1 flex items-center justify-center">
    {/* Centered content */}
  </div>
  <div className="pb-8 text-center">
    {/* Footer action */}
  </div>
</div>
```

### Scrollable Content (Home, Insights)

```jsx
<div className="h-full overflow-y-auto pb-6">
  <div className="max-w-md mx-auto px-6 py-8 space-y-8">
    {/* Sections */}
  </div>
</div>
```

### Chat Interface

```jsx
<div className="h-full flex flex-col">
  <div className="border-b">{/* Header */}</div>
  <div className="flex-1 overflow-y-auto">{/* Messages */}</div>
  <div className="border-t">{/* Input */}</div>
</div>
```

---

## Quality Checklist

Before shipping any new feature, verify:

- [ ] Colors are warm and calm (no red/harsh tones)
- [ ] Text is large and comfortable to read
- [ ] Spacing is generous, not cramped
- [ ] Animations are slow and intentional
- [ ] Copy is brief and non-judgmental
- [ ] Touch targets are 44px minimum
- [ ] Focus states are visible
- [ ] Works on 320px mobile width
- [ ] Feels calm, not rushed
- [ ] Creates space, not pressure

---

## Design Philosophy

> "Every pixel should reduce stress, not create it."

**Core Principle:**
The app should feel like sitting with a kind friend who helps you reflect on money, not like checking a budget dashboard.

**Success Metric:**
Users should feel calmer after using the app, even if they're over budget.

---

*This design system is a living document. As ZenSpend evolves, these principles should guide every decision.*

