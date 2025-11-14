# shadcn/ui Components Library

This is a complete collection of shadcn/ui components ready to use in your projects.

## 📦 Installed Components

All 45+ shadcn/ui components have been installed:

### Layout & Structure
- **accordion** - Collapsible content sections
- **aspect-ratio** - Maintain consistent aspect ratios
- **breadcrumb** - Navigation breadcrumbs
- **card** - Container for content
- **carousel** - Image/content carousel
- **collapsible** - Collapsible content
- **resizable** - Resizable panels
- **scroll-area** - Custom scrollable areas
- **separator** - Visual divider
- **sidebar** - Application sidebar
- **tabs** - Tabbed interface

### Navigation
- **command** - Command menu (⌘K)
- **context-menu** - Right-click context menu
- **dropdown-menu** - Dropdown menus
- **menubar** - Application menu bar
- **navigation-menu** - Site navigation
- **pagination** - Page navigation

### Forms & Inputs
- **button** - Button component
- **calendar** - Date picker calendar
- **checkbox** - Checkbox input
- **form** - Form wrapper with validation
- **input** - Text input
- **input-otp** - OTP/PIN input
- **label** - Form labels
- **radio-group** - Radio button group
- **select** - Dropdown select
- **slider** - Range slider
- **switch** - Toggle switch
- **textarea** - Multi-line text input

### Feedback
- **alert** - Alert messages
- **alert-dialog** - Modal alerts
- **progress** - Progress bar
- **skeleton** - Loading skeleton
- **sonner** - Toast notifications

### Overlays
- **dialog** - Modal dialogs
- **drawer** - Slide-out drawer
- **hover-card** - Hover popover
- **popover** - Popover overlay
- **sheet** - Side sheet
- **tooltip** - Tooltips

### Data Display
- **avatar** - User avatars
- **badge** - Status badges
- **chart** - Chart components
- **table** - Data tables

### Other
- **toggle** - Toggle button
- **toggle-group** - Toggle button group

## 🚀 How to Use in New Projects

### Option 1: Copy Components Directly

Copy the components you need from `/Users/seathemc/shadcn-components/components/ui/` to your project:

```bash
# Copy specific component
cp /Users/seathemc/shadcn-components/components/ui/button.tsx ./components/ui/

# Copy all components
cp -r /Users/seathemc/shadcn-components/components/ui ./components/

# Copy utils (required)
cp /Users/seathemc/shadcn-components/lib/utils.ts ./lib/
```

### Option 2: Set Up shadcn/ui in New Project

1. Initialize shadcn/ui in your project:
```bash
npx shadcn@latest init -d
```

2. Add specific components:
```bash
npx shadcn@latest add button card dialog
```

## 📋 Requirements

Your project needs:
- React 18+
- TypeScript
- Tailwind CSS v4+
- Dependencies (auto-installed with components):
  - `@radix-ui/*` packages
  - `class-variance-authority`
  - `clsx`
  - `tailwind-merge`
  - `lucide-react` (icons)

## 🎨 Tailwind Configuration

The components use Tailwind CSS v4. Make sure your `globals.css` includes the theme variables (already configured in this repo).

## 📖 Documentation

For component API and usage examples, visit:
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Component Examples](https://ui.shadcn.com/docs/components)

## 🔧 Customization

All components are customizable:
- Edit component files directly in `components/ui/`
- Modify theme variables in `app/globals.css`
- Components use Tailwind classes and CVA for variants

## 📁 Project Structure

```
shadcn-components/
├── components/
│   └── ui/           # All 45+ shadcn components
├── hooks/
│   └── use-mobile.ts # Mobile detection hook
├── lib/
│   └── utils.ts      # Utility functions (cn helper)
├── app/
│   └── globals.css   # Theme variables
└── components.json   # shadcn configuration
```

## 🎯 Quick Start Example

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <Button className="w-full">Sign In</Button>
      </CardContent>
    </Card>
  )
}
```

## 📝 Notes

- This is using the "New York" style variant
- Tailwind CSS v4 is configured
- All components are TypeScript-ready
- Icons use `lucide-react`
- The `toast` component is deprecated (use `sonner` instead)
