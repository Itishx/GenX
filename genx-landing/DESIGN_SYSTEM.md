# AVIATE Design System & Brand Guidelines

**Version:** 1.0  
**Last Updated:** November 2, 2025  
**Purpose:** Complete reference for designing websites and products with consistent, professional aesthetics

---

## Table of Contents
1. [Core Design Philosophy](#core-design-philosophy)
2. [Typography System](#typography-system)
3. [Color Palette](#color-palette)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Section Patterns](#section-patterns)
7. [Motion & Animation](#motion--animation)
8. [Responsive Design](#responsive-design)
9. [Best Practices](#best-practices)

---

## Core Design Philosophy

### Brand Identity
- **Name:** Aviate
- **Tagline:** "Your AI copilot to build and grow"
- **Essence:** Modern, clean, professional with playful accents
- **Target:** Tech-savvy founders and business professionals
- **Tone:** Approachable, structured, innovative

### Design Principles

#### 1. **Clarity & Structure**
- Information hierarchy is paramount
- Use whitespace generously
- No visual clutter
- Clear call-to-action placement

#### 2. **Minimalism with Personality**
- Clean backgrounds (primarily white, black, or subtle gradients)
- Strategic use of accent colors (orange #FF3B00)
- Minimal decorative elements—only purposeful
- Typography drives visual interest

#### 3. **Gradient Accents**
- Primary gradient: Orange (`#FF5A00` → `#FFAB47` → `#FF5A00`)
- Subtle background gradients: `linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`
- Gradients used for emphasis, not background fill

#### 4. **Motion with Purpose**
- Smooth transitions on all interactive elements
- Stagger animations for visual flow
- Use Framer Motion for complex animations
- Never animate for decoration

#### 5. **User-Centric Spacing**
- Breathing room around content
- Consistent padding/margins
- Generous gutters on mobile (24px) and desktop (48px)

---

## Typography System

### Font Stack
```css
Primary Font: 'Neue Haas Display', serif
Fallback: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial
```

**Font File Location:** `/public/fonts/fonnts.com-NeueHaasDisplayRoman.ttf`

### Type Scale

| Usage | Font Size | Font Weight | Line Height | Letter Spacing |
|-------|-----------|------------|-------------|---|
| **Page Title (Hero)** | 54-75px | 700 | 1.0-1.2 | -1px |
| **Section Heading (H1)** | 35-54px | 600-700 | 1.2 | -0.5px |
| **Subheading (H2)** | 27-32px | 600 | 1.3 | -0.3px |
| **Heading (H3)** | 23-24px | 600 | 1.3 | 0 |
| **Body Text (P)** | 16-19px | 400 | 1.6-1.7 | 0 |
| **Metadata/Caption** | 13px | 400 | 1.5 | 0 |
| **Label/Tab** | 14-16px | 500-600 | 1.4 | 0 |

### Typography Rules
- All headings use `font-family: 'Neue Haas Display', serif`
- Body text uses default system font stack
- Line height increases with font size (larger text = tighter lines)
- Letter spacing used sparingly for large headlines
- Avoid mixing font weights excessively

### Example: Hero Title
```tsx
<h1 
  style={{ 
    fontFamily: "'Neue Haas Display', serif", 
    fontSize: '75px', 
    lineHeight: '0.92',
    fontWeight: 700,
    letterSpacing: '-1px'
  }}
>
  Your AI Operating System to make business easy
</h1>
```

---

## Color Palette

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | #FFFFFF | Main background |
| **Black** | #1F2937 / #111111 | Text, dark backgrounds |
| **Orange (Primary Accent)** | #FF3B00 / #FF5A00 | CTAs, highlights, tabs |
| **Orange (Secondary)** | #FFAB47 | Gradients, subtle accents |

### Neutral Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Heading Gray** | #1F2937 | Primary text |
| **Body Gray** | #374151 | Secondary text |
| **Tertiary Gray** | #555555 / #6B7280 | Tertiary text, metadata |
| **Border Gray** | #E5E7EB / #EAEAEA | Borders, dividers |
| **Subtle Gray** | #F3F4F6 / #FAFAFA | Backgrounds, code blocks |
| **Hover Gray** | #D1D5DB / #9CA3AF | Scrollbar, disabled states |

### Color Usage Guide

```css
/* Text Hierarchy */
.text-primary {
  color: #1F2937; /* Main headings */
}

.text-secondary {
  color: #374151; /* Body text */
}

.text-tertiary {
  color: #6B7280; /* Metadata, captions */
}

/* Interactive Elements */
.link-primary {
  color: #3B82F6; /* Links (blue) */
}

.link-primary:hover {
  color: #2563EB;
}

.accent {
  color: #FF3B00; /* Buttons, active states */
}

.accent-hover {
  color: #FF5A00;
}

/* Backgrounds */
.bg-primary {
  background: #FFFFFF;
}

.bg-secondary {
  background: #F3F4F6;
}

.bg-code {
  background: #1F2937; /* Dark code blocks */
  color: #F3F4F6;
}
```

### Gradient System

**Orange Gradient (Primary Accent)**
```css
background: linear-gradient(135deg, #ff5a00 0%, #ffb347 50%, #ff5a00 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

**Subtle Background**
```css
background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
```

**Dark Code Background**
```css
background: #1f2937;
```

---

## Spacing & Layout

### Container & Max-Width
```css
/* Standard Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Large Section Container */
.max-w-7xl {
  max-width: 1280px;
}

/* Breakpoint */
2xl: 1280px
```

### Padding System (Tailwind)

| Spacing | Desktop | Mobile |
|---------|---------|--------|
| **Section Horizontal** | `px-8` (32px) | `px-6` (24px) |
| **Section Vertical** | `py-24` (96px) / `py-32` (128px) | `py-12-16` (48-64px) |
| **Content Inner** | `p-8` (32px) | `p-6` (24px) |
| **Card Padding** | `p-8` (32px) | `p-6` (24px) |
| **Tight Spacing** | `p-4` (16px) | `p-3` (12px) |

### Gap/Margin System

| Gap | Size | Usage |
|-----|------|-------|
| `gap-3` | 12px | Tight grouping (buttons) |
| `gap-4` | 16px | Component spacing |
| `gap-6` / `gap-8` | 24-32px | Medium sections |
| `gap-10` / `gap-20` | 40-80px | Large section spacing |

### Section Structure Pattern

```tsx
// Desktop: Hero section with 60px top, 48px sides, 40px bottom
.hero {
  padding: 60px 48px 40px 48px;  // top right bottom left
  max-width: 900px;
  margin: 0 auto;
}

// Mobile: Reduced proportionally
@media (max-width: 768px) {
  .hero {
    padding: 40px 24px 24px 24px;
  }
}
```

---

## Component Library

### Buttons

#### Primary CTA Button
```tsx
<button className="bg-[#111111] text-white py-3 px-6 rounded-lg font-medium text-sm transition-colors hover:bg-[#FF3B00]">
  Get Started
</button>
```

**Style Rules:**
- Background: `#111111` (dark gray/black)
- Hover: Changes to `#FF3B00` (orange)
- Padding: `py-3 px-6` (12px vertical, 24px horizontal)
- Border Radius: `rounded-lg` (8px)
- Font: `font-medium text-sm`
- Transition: Smooth 300ms color change

#### Secondary Button (Outline)
```tsx
<a 
  href="/login"
  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-transparent px-6 py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-900 hover:text-white"
>
  Get Started Free
</a>
```

**Style Rules:**
- Border: `1px solid #D1D5DB`
- Rounded: `rounded-full` (full border radius)
- Background: Transparent, hover → dark
- Smooth color transition on hover

#### Tab Button (Active State)
```tsx
<button
  className={`relative px-8 py-3 font-medium rounded-full transition-all ${
    activeTab === tab ? 'text-white' : 'text-gray-700'
  }`}
>
  {activeTab === tab && (
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{ backgroundColor: '#FF3B00' }}
      layoutId="activeTab"
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  )}
  <span className="relative z-10">{label}</span>
</button>
```

### Card Components

#### Standard Card
```tsx
<div className="rounded-2xl border border-[#eaeaea] p-8 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300">
  {/* Content */}
</div>
```

**Properties:**
- Border: `1px solid #EAEAEA`
- Padding: `p-8` (32px)
- Border Radius: `rounded-2xl` (16px)
- Shadow: Minimal `0_1px_4px_rgba(0,0,0,0.04)`
- Hover: Slightly increased shadow

### Badges & Pills

#### Success/Info Badge
```tsx
<div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs text-green-700 font-medium">
  Save 20%
</div>
```

**Pattern:**
- Rounded: Full (`rounded-full`)
- Padding: Tight (`px-3 py-1`)
- Colors: Light background + darker text
- Font: Extra small + bold

### Input & Form Elements

#### Text Input
```css
input {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #FF3B00;
  box-shadow: 0 0 0 3px rgba(255, 59, 0, 0.1);
}
```

---

## Section Patterns

### 1. Hero Section
**Location:** First section of landing page
**Height:** Full viewport (`min-h-[100vh]`)
**Background:** White or gradient
**Padding:** `pt-32 pb-20` (desktop) / `pt-20 pb-16` (mobile)

```tsx
<section className="relative flex min-h-[100vh] items-center justify-center bg-white text-gray-900 pt-32 pb-20">
  <div className="container px-6 text-center">
    {/* Content */}
  </div>
</section>
```

**Hero Pattern Components:**
- **Main Headline:** 54-75px, Neue Haas Display, centered
- **Subheading:** 16-19px, body gray (#374151), max-width constraint
- **CTA Buttons:** 2-3 buttons, staggered animation
- **Visual Asset:** Large image/video with hover effect

### 2. Metrics Section
**Layout:** 2-column (desktop) / Single column (mobile)
**Spacing:** `py-24` (desktop) / `py-12` (mobile)
**Background:** White or light gray
**Grid:** `grid-cols-1 md:grid-cols-2 gap-20`

```tsx
<section className="bg-white py-24">
  <div className="max-w-7xl mx-auto px-8">
    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
      {/* Left: Text */}
      {/* Right: Metrics */}
    </motion.div>
  </div>
</section>
```

**Metrics Pattern:**
- Left column: Section heading + description
- Right column: Metrics in list format with dividers
- Metric item: `border-b` with `py-8` padding
- Last item: `last:border-b-0`

### 3. Content Section (With Heading & Details)
**Layout:** Centered with max-width
**Pattern:** Heading + Description + Feature Cards/Grid
**Spacing:** Generous vertical rhythm

```tsx
<section className="bg-white py-24 md:py-32 px-6">
  <div className="mx-auto max-w-6xl">
    {/* Centered Heading */}
    <motion.div className="text-center mb-16">
      <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
        SECTION LABEL
      </p>
      <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
        Main Heading
      </h2>
      <p className="text-gray-600 text-base">Subheading or description</p>
    </motion.div>

    {/* Tab Controls (if needed) */}
    {/* Content Grid/Cards */}
  </div>
</section>
```

### 4. Tabbed Section
**Pattern:** Tab selection → Dynamic content display
**Tab Styling:** Rounded pill buttons with animated background
**Animation:** Spring motion on active state

```tsx
// Tab Button Group
<div className="flex gap-4 rounded-full bg-gray-100 p-1">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`relative px-8 py-3 font-medium transition-all rounded-full ${
        activeTab === tab ? 'text-white' : 'text-gray-700'
      }`}
    >
      {activeTab === tab && (
        <motion.div
          className="absolute inset-0 rounded-full bg-[#FF3B00]"
          layoutId="activeTab"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  ))}
</div>

// Content
<motion.div
  key={activeTab}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="grid grid-cols-1 md:grid-cols-2 gap-10"
>
  {/* Content cards */}
</motion.div>
```

### 5. Accordion/FAQ Section
**Pattern:** Expandable question items
**Animation:** Height collapse/expand with smooth motion
**Icon:** Plus sign rotating 45° on expand

```tsx
// Accordion Item
<button
  onClick={() => toggleFAQ(faqId)}
  className="flex w-full items-center justify-between"
>
  <h3 className="text-base font-medium">{question}</h3>
  <motion.div
    animate={{ rotate: expanded ? 45 : 0 }}
    transition={{ duration: 0.3 }}
  >
    <Plus size={20} className="text-orange-500" />
  </motion.div>
</button>

// Answer
<AnimatePresence>
  {expanded && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-gray-600">{answer}</p>
    </motion.div>
  )}
</AnimatePresence>
```

### 6. Pricing Cards Section
**Layout:** 2-column grid (or responsive 1-2 columns)
**Card Style:** Bordered, light shadow, hover elevation
**Spacing:** `gap-6 lg:gap-10`

```tsx
<section className="bg-white py-12 md:py-16 px-6">
  <div className="mx-auto max-w-6xl">
    {/* Header */}
    <motion.div className="text-center mb-10">
      <h2 className="text-4xl font-semibold text-gray-900">Our Pricing</h2>
    </motion.div>

    {/* Pricing Grid */}
    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Price Card */}
      <motion.div className="rounded-2xl border border-[#eaeaea] p-8 bg-white shadow-sm hover:shadow-md">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <div className="mt-6 flex items-baseline">
          <span className="text-5xl font-bold">${price}</span>
          <span className="text-gray-600 ml-2">/ month</span>
        </div>
        <button className="w-full mt-8 bg-[#111111] text-white py-3 rounded-lg hover:bg-[#FF3B00]">
          Get Started
        </button>
      </motion.div>
    </motion.div>
  </div>
</section>
```

### 7. Footer Section
**Layout:** 4-column grid (desktop) / 2-column (tablet) / 1-column (mobile)
**Spacing:** `py-16` top section, `py-8` bottom bar
**Border:** `border-t` divider before bottom bar

```tsx
<footer className="bg-white">
  {/* Main Footer */}
  <div className="mx-auto max-w-7xl px-6 py-16">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {/* Logo & Social */}
      {/* Column 1: Links */}
      {/* Column 2: Links */}
      {/* Column 3: Links */}
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-[#eaeaea]">
    <div className="mx-auto max-w-7xl px-6 py-8 flex justify-between">
      <p className="text-sm text-gray-500">© 2025 Aviate. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
          Privacy Policy
        </a>
      </div>
    </div>
  </div>
</footer>
```

### 8. Navbar/Header
**Fixed Position:** `fixed inset-x-0 top-0 z-40`
**Layout:** Logo (left) | Nav links (center, absolute positioned) | Auth (right)
**Background:** White with subtle shadow/border
**Mobile:** Hamburger menu toggle

```tsx
<header className="fixed inset-x-0 top-0 z-40">
  <nav className="w-full border-b border-gray-100 bg-white shadow-sm">
    <div className="relative mx-auto flex max-w-7xl items-center px-6 py-4">
      {/* Logo */}
      <a href="/" className="flex items-center">
        <img src="logo.png" alt="Logo" />
      </a>

      {/* Center Nav (absolute positioned) */}
      <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-x-8 md:flex">
        {/* Nav Items */}
      </ul>

      {/* Right: Auth + Mobile Menu */}
      <div className="ml-auto flex items-center gap-3">
        {/* Buttons & Mobile Toggle */}
      </div>
    </div>
  </nav>
</header>
```

---

## Motion & Animation

### Animation Library
**Primary:** Framer Motion (`framer-motion`)
**Approach:** Purpose-driven, smooth, not overdone

### Common Patterns

#### Page Load Animation
```tsx
<motion.h1
  initial={{ opacity: 0, y: 32 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  Content
</motion.h1>
```

**Timing:** 0.8s for main elements, 0.1-0.2s delays between elements

#### Scroll Trigger Animation
```tsx
import { useInView } from 'react-intersection-observer'

const { ref, inView } = useInView({
  threshold: 0.1,
  triggerOnce: true,
})

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 20 }}
  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

#### Stagger Animation (Multiple Items)
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate={inView ? 'visible' : 'hidden'}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Hover Scale/Transform
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
>
  Hover me
</motion.div>
```

#### Tab Switch Animation (LayoutId)
```tsx
<motion.div
  className="absolute inset-0 rounded-full bg-orange-500"
  layoutId="activeTab"
  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
/>
```

### Animation Timing Standards

| Type | Duration | Delay | Ease |
|------|----------|-------|------|
| Page load (hero) | 0.8s | 0.1-0.2s | easeOut |
| Scroll trigger | 0.6s | 0 | easeOut |
| Stagger items | 0.3-0.5s | 0.05-0.1s between | easeOut |
| Hover effects | 0.2-0.3s | 0 | spring |
| Expand/collapse | 0.3s | 0 | easeInOut |

### CSS Animations
```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## Responsive Design

### Breakpoints (Tailwind)
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Mobile-First Approach
- Design mobile first
- Use `md:` and `lg:` prefixes for larger screens
- Always test on actual devices

### Common Responsive Patterns

#### Typography Scaling
```tsx
// Hero Title
<h1 className="text-3xl md:text-5xl lg:text-6xl">
  Responsive Heading
</h1>

// Body Text
<p className="text-base md:text-lg">
  Responsive paragraph
</p>
```

#### Grid Layouts
```tsx
// 1 column mobile, 2 desktop
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// 1 column mobile, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

// Auto-responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

#### Padding/Margin Responsive
```tsx
<section className="py-12 md:py-20 lg:py-32 px-4 md:px-8 lg:px-12">
```

#### Hidden/Visible on Breakpoints
```tsx
{/* Hidden on mobile, visible md+ */}
<div className="hidden md:flex">Desktop only</div>

{/* Visible on mobile, hidden md+ */}
<div className="md:hidden">Mobile only</div>
```

### Mobile Optimizations
1. **Touch targets:** Minimum 44x44px
2. **Font sizes:** Slightly smaller on mobile (16px min)
3. **Spacing:** Tighter on mobile (24px vs 48px)
4. **Images:** Optimize for mobile (lazy load, responsive images)
5. **Modals:** Full screen on mobile, centered on desktop

---

## Best Practices

### Code Organization
```
src/
├── components/
│   ├── sections/          # Full page sections (Hero, Pricing, etc.)
│   ├── ui/                # Reusable UI components (Button, Card, etc.)
│   ├── layout/            # Header, Footer, Navbar
│   └── [Component].tsx
├── lib/
│   ├── utils.ts           # Utility functions
│   └── cn.ts              # Class name merge function
├── styles/
│   ├── globals.css        # Tailwind + global styles
│   └── animations.css     # Custom animations
├── hooks/                 # Custom React hooks
└── App.tsx               # Main app component
```

### Styling Best Practices

#### 1. Use Tailwind First
```tsx
// ✅ Good - Use Tailwind classes
<div className="flex items-center gap-4 py-8 px-6">

// ❌ Avoid - Inline styles unless necessary
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
```

#### 2. Extract Complex Styles to CSS
```css
/* For complex, reusable styles */
.note-editor__prose p {
  font-size: 19px;
  line-height: 1.7;
  color: #374151;
  margin: 1rem 0;
}
```

#### 3. Use CSS Modules for Component-Specific Styles
```
NoteEditor.tsx
NoteEditor.css
```

#### 4. Consistent Color References
```tsx
// Use CSS custom properties or defined constants
const COLORS = {
  primary: '#111111',
  accent: '#FF3B00',
  border: '#EAEAEA',
  textSecondary: '#555555',
}

// Or in CSS
:root {
  --color-primary: #111111;
  --color-accent: #FF3B00;
}
```

### Performance Checklist
- [ ] Images optimized and lazy-loaded
- [ ] Animations use `transform` and `opacity` only
- [ ] CSS animations perform smoothly (60fps target)
- [ ] Components properly memoized
- [ ] Intersection Observer for scroll triggers
- [ ] Proper z-index stacking (consistent hierarchy)

### Accessibility Guidelines
- [ ] Minimum 44x44px touch targets
- [ ] Color contrast WCAG AA compliant
- [ ] Semantic HTML (`<button>`, `<a>`, `<nav>`)
- [ ] Keyboard navigation support
- [ ] ARIA labels where needed
- [ ] Alt text on all images

### Common Pitfalls to Avoid
1. **Too many animations** - Use sparingly for effect
2. **Inconsistent spacing** - Stick to the spacing system
3. **Color abuse** - Use orange accent strategically
4. **Typography chaos** - Stick to the type scale
5. **Over-designed components** - Keep it minimal
6. **Ignoring mobile** - Always test responsively
7. **Slow animations** - Keep durations under 1s

---

## Quick Reference Snippets

### Hero Section Template
```tsx
<section className="relative flex min-h-[100vh] items-center justify-center bg-white text-gray-900 pt-32 pb-20">
  <div className="container px-6 text-center">
    <motion.h1
      className="text-5xl md:text-6xl font-bold"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Your Headline
    </motion.h1>
    <motion.p
      className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      Subheading text
    </motion.p>
  </div>
</section>
```

### Metrics Section Template
```tsx
<section className="bg-white py-24">
  <div className="max-w-7xl mx-auto px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
      <div>
        <h2 className="text-5xl font-bold mb-6">Section Heading</h2>
        <p className="text-gray-600">Description</p>
      </div>
      <div>
        {metrics.map((metric) => (
          <div key={metric.id} className="border-b py-8 last:border-b-0">
            <div className="text-3xl font-bold text-orange-600">{metric.number}</div>
            <h3 className="text-lg font-semibold mt-2">{metric.heading}</h3>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

### CTA Button Template
```tsx
<button className="bg-[#111111] text-white py-3 px-8 rounded-lg font-medium text-sm transition-all hover:bg-[#FF3B00] active:scale-95">
  Call to Action
</button>
```

---

## Tools & Stack

### Required Dependencies
```json
{
  "react": "^18.0",
  "react-dom": "^18.0",
  "tailwindcss": "^3.0",
  "postcss": "^8.0",
  "autoprefixer": "^10.0",
  "framer-motion": "^10.0",
  "react-intersection-observer": "^9.0",
  "lucide-react": "latest"
}
```

### Tailwind Config
```ts
module.exports = {
  darkMode: ['class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Neue Haas Display', 'Inter', ...],
        display: ['Neue Haas Display', 'serif'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#FBBF24',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## Usage Example: Creating a New Project

### Step 1: Set up base styles
Copy `index.css` and import global fonts

### Step 2: Build using section patterns
Use the Hero, Metrics, Content section patterns as building blocks

### Step 3: Apply typography scale
Reference type scale table for sizing

### Step 4: Add animations
Use Framer Motion with provided animation patterns

### Step 5: Ensure responsiveness
Test at md (768px) and verify mobile experience

### Step 6: Color consistency
Use only defined color palette—no new colors

---

## Questions?

This design system is your reference for:
- Creating new websites/products
- Maintaining consistency across projects
- Onboarding new team members
- Making design decisions quickly

**Last Updated:** November 2, 2025
