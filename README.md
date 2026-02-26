# Playground

A production-ready React scaffold with Vite, Tailwind CSS v4, shadcn/ui, and Motion.

## Stack

- **React 18** with TypeScript (strict mode)
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** with CSS variables and dark mode
- **shadcn/ui** (new-york style) for accessible components
- **Motion** for performant animations
- **ESLint + Prettier** for code quality

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Directory Structure

```
src/
├── assets/           # Static assets (images, fonts)
├── components/
│   ├── motion/       # Motion re-exports and utilities
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom React hooks
├── lib/
│   ├── utils.ts      # Utility functions (cn)
│   └── animations.ts # Reusable animation presets
└── pages/
    └── Home.tsx      # Demo landing page
```

## Animation Presets

Import from `@/components/motion` or `@/lib/animations`:

```tsx
import { motion, fadeIn, slideUp, staggerContainer, staggerItem } from '@/components/motion'

// Simple fade in
<motion.div variants={fadeIn} initial="hidden" animate="visible">
  Content
</motion.div>

// Staggered list
<motion.ul variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={staggerItem}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

Available presets:
- `fadeIn` - Simple opacity transition
- `slideUp` / `slideDown` - Vertical slide with fade
- `slideInLeft` / `slideInRight` - Horizontal slide with fade
- `scaleIn` - Scale up from 95%
- `springPop` - Spring-based scale animation
- `staggerContainer` / `staggerItem` - For staggered lists
- `hoverScale` / `tapScale` - Interactive states

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component]
```

Example:
```bash
npx shadcn@latest add accordion tabs tooltip
```

## Dark Mode

Toggle dark mode by adding/removing the `dark` class on `<html>`:

```tsx
document.documentElement.classList.toggle('dark')
```

The demo page includes a theme toggle button in the header.

## Path Aliases

Use `@/` to reference the `src/` directory:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```
