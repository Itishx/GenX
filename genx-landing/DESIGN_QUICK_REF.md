# AVIATE Design System - Quick Reference

## 🎨 Colors
```
Primary: #111111 (buttons, text)
Accent: #FF3B00 (hover, active, highlights)
Border: #EAEAEA
Text Gray: #555555, #6B7280
Background: #FFFFFF (white)
```

## 🔤 Typography
```
Headings: Neue Haas Display, serif (75px→36px)
Body: Inter, sans-serif (16-19px)
Weight: 700 (bold), 600 (semibold), 400 (regular)
Line Height: 1.2-1.7 (tighter for big text)
```

## 📏 Spacing
```
Desktop: px-8 (32px), py-24 (96px)
Mobile: px-6 (24px), py-12 (48px)
Gap: gap-8 (32px) between sections
Card Padding: p-8
```

## 🔘 Button Styles
```tsx
// Primary (Dark → Orange on hover)
<button className="bg-[#111111] text-white py-3 px-6 rounded-lg hover:bg-[#FF3B00] transition-colors">
  CTA
</button>

// Secondary (Outline)
<a href="#" className="border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-900 hover:text-white">
  Link
</a>
```

## 📦 Section Pattern
```tsx
<section className="bg-white py-24 px-6">
  <div className="max-w-7xl mx-auto">
    {/* Heading */}
    <div className="text-center mb-16">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Label</p>
      <h2 className="text-5xl font-bold text-gray-900">Heading</h2>
      <p className="text-gray-600 mt-4">Description</p>
    </div>
    
    {/* Content Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Cards here */}
    </div>
  </div>
</section>
```

## 🎬 Animation Pattern
```tsx
// Load animation
<motion.h1
  initial={{ opacity: 0, y: 32 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  Text
</motion.h1>

// Scroll trigger
const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
<motion.div
  ref={ref}
  initial={{ opacity: 0 }}
  animate={inView ? { opacity: 1 } : { opacity: 0 }}
  transition={{ duration: 0.6 }}
>
```

## 📱 Responsive
```tsx
// Heading scales
<h1 className="text-3xl md:text-5xl lg:text-6xl">

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Hide/show
<div className="hidden md:flex">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

## ✅ Checklist for New Sections
- [ ] Max-width container (max-w-7xl)
- [ ] Section padding (py-24 md:py-32)
- [ ] Heading: label + title + description
- [ ] Grid layout (1 col mobile, 2+ desktop)
- [ ] Add animations (Framer Motion)
- [ ] Test mobile responsiveness
- [ ] Use only defined colors
- [ ] Type scale: 75px hero, 36-54px h1, 16-19px body

## 🚀 Dependencies
```json
{
  "react": "^18.0",
  "tailwindcss": "^3.0",
  "framer-motion": "^10.0",
  "react-intersection-observer": "^9.0"
}
```

## 📂 File Setup
1. Copy `tailwind.config.ts` & `index.css` from Aviate
2. Import font: `@font-face { font-family: 'Neue Haas Display'; src: url('/fonts/...ttf'); }`
3. Use section pattern template above
4. Add animations with Framer Motion
5. Test at md (768px) breakpoint

---

**That's it!** Reference this for any new project. Full docs in `DESIGN_SYSTEM.md` if needed.
