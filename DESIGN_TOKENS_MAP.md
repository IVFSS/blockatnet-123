# WorldLabs.ai Design Token Mapping for blockatnet

## Overview

This document maps **WorldLabs.ai**'s visual design system (fetched from `https://www.worldlabs.ai/`) to blockatnet's existing Chakra UI setup.

### WorldLabs.ai Color Palette (verified from live page)

| Token | HEX | RGB | Usage |
|-------|-----|-----|-------|
| `worldlabsBg` | `#f9f9fb` | `rgb(249, 249, 251)` | Page background (light gray) |
| `worldlabsCard` | `#ffffff` | `rgb(255, 255, 255)` | Cards, modals, panels (white) |
| `worldlabsPrimary` | `#2a679c` | `rgb(42, 103, 156)` | Primary actions, links, accent (blue) |
| `worldlabsPrimaryFg` | `#2e2e38` | `rgb(46, 46, 56)` | Text on primary (dark gray) |
| `worldlabsMuted` | `#9494a8` | `rgb(148, 148, 168)` | Secondary text, disabled states |
| `worldlabsBorder` | `#e5e7eb` | `rgb(229, 231, 235)` | Borders, dividers (light gray) |
| `worldlabsDark` | `#111111` | `rgb(17, 17, 17)` | Dark sections (almost black) |
| `worldlabsSuccess` | `#05c92f` | `rgb(5, 201, 47)` | Success states (green) |
| `worldlabsWarning` | `#f59e0b` | `rgb(245, 158, 11)` | Warnings, alerts |
| `worldlabsInfo` | `#3b82f6` | `rgb(59, 130, 246)` | Info links |

### Typography (from WorldLabs.ai)

- **Body Font**: `roobert`, "Helvetica Neue", Arial, sans-serif
- **Heading Font**: `"Gilda Display"`, Georgia, serif
- **Scale**: 
  - `text-xs`: 0.75rem (12px)
  - `text-sm`: 0.875rem (14px)
  - `text-base`: 1rem (16px)
  - `text-lg`: 1.125rem (18px)
  - `text-xl`: 1.25rem (20px)
  - `text-2xl`: 1.5rem (24px)
  - `text-3xl`: 1.875rem (30px)
  - `text-4xl`: 2.25rem (36px)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line-height**: 1.5 (base), 1.625 (larger)

### Spacing & Layout

- **Section padding**: `py-16` (64px) / `py-12` (48px)
- **Container max-width**: `max-w-7xl` (1440px) with `mx-auto`
- **Grid gap**: `gap-4` (1rem) / `gap-6` (1.5rem)
- **Card padding**: `p-6` (24px) / `p-4` (16px)

### Component Visual Patterns

| ctrl.xyz Element | CSS/Style Properties |
|---|---|
| **NavBar** | Dark bg `#0a0a0f`, border `#3f3f46`, links `#a3a3a3` hover → lighter |
| **Hero Buttons** | Purple gradient bg `linear-gradient(135deg, #a78bfa, #e0e7ff)`, white text, rounded `lg` |
| **Chain Cards** | Dark card `#18181b`, border `#3f3f46`, hover shadow `0 4px 20px rgba(0,0,0,0.4)` |
| **Feature Items** | Icon + text layout, hover bg lighten, transition `0.2s` |
| **FAQ Accordion** | Border `#3f3f46`, text color `#f9fafb`, arrow rotate on open |
| **Footer** | Darker bg, small text `#6b7280`, link hover `#a78bfa` |

---

## Integration Approach

### Option A: Enhance Chakra UI with ctrl.xyz Tokens (Recommended for minimal changes)

Add the tokens to your Tailwind config (already created at `tailwind.config.js`) and extend Chakra's theme.

**Step 1: Extend Chakra theme** (`src/theme/chakra.tsx`):

```tsx
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const themes = {
  light: {
    colors: {
      ...defaultTokens,
      bg: '#0a0a0f',
      card: '#18181b',
      primary: '#a78bfa',
      primaryForeground: '#f9fafb',
      muted: '#6b7280',
      border: '#3f3f46',
    },
  },
  dark: {
    colors: {
      bg: '#0a0a0f',
      card: '#18181b',
      primary: '#a78bfa',
      primaryForeground: '#f9fafb',
      muted: '#6b7280',
      border: '#3f3f46',
    },
  },
}

export default extendTheme({
  initialColorMode: 'dark',
  themes,
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  shadows: {
    sm: '0 2px 6px rgba(0, 0, 0, 0.3)',
    md: '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  },
  colors: {
    ctrlBg: '#0a0a0f',
    ctrlCard: '#18181b',
    ctrlPrimary: '#a78bfa',
    ctrlPrimaryForeground: '#f9fafb',
    ctrlMuted: '#6b7280',
    ctrlBorder: '#3f3f46',
    ctrlSuccess: '#22c55e',
    ctrlWarning: '#f59e0b',
    ctrlInfo: '#3b82f6',
  },
})
```

Then wrap your app:

```tsx
// src/app/providers.tsx
import './theme/chakra.tsx'

export default function RootProvider() {
  return (
    <ChakraProvider
      theme={theme}
      colorModeToggle
      defaultColorMode="dark"
    >
      {/* your app */}
    </ChakraProvider>
  )
}
```

**Step 2: Use ctrl.xyz tokens in components**

Replace Chakra default colors with `ctrl.*` tokens:

```tsx
// Before (Chakra defaults)
<Button bg="blue.500" color="white">Connect</Button>

// After (ctrl.xyz)
<Button bg="ctrlPrimary" color="ctrlPrimaryForeground">Connect</Button>

// Card with ctrl.xyz styling
<Card bg="ctrlCard" borderColor="ctrlBorder">
  {/* content */}
</Card>

// Text colors
<Text color="ctrlMuted">Secondary text</Text>
<Text color="ctrlPrimary">Primary link</Text>
```

---

### Option B: Migrate to shadcn/ui (Full rewrite of UI layer)

If you want pure shadcn/ui with ctrl.xyz tokens:

**Step 1: Install shadcn/ui**

```bash
npx shadcn-ui@latest init
# Select TailwindCSS when prompted
# Choose components you want: button, card, drawer, etc.
```

**Step 2: Create `src/components/ui/` with shadcn/ui variants**

```bash
npx shadcn-ui@latest add button card drawer dropdown-menu input label separator badge table
```

**Step 3: Override default colors in `tailwind.config.js`**

Already done above - the `ctrl.*` colors will be available as `bg-ctrl-primary`, `text-ctrl-muted`, etc.

**Step 4: Use shadcn/ui components with ctrl.xyz props**

```tsx
// shadcn Button with ctrl.xyz styling
<Button className="bg-ctrl-primary text-ctrlPrimaryForeground hover:bg-ctrlPrimary/90">
  Connect Wallet
</Button>

// shadcn Card
<Card className="bg-ctrlCard border border-ctrlBorder">
  <CardHeader>
    <CardTitle>Wallet Overview</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Step 5: Migrate existing Chakra components to shadcn/ui**

Replace imports:
- `@chakra-ui/react` → `components/ui/` (shadcn/ui)
- Chakra props → shadcn equivalents (mostly compatible with className overrides)

---

## Component Layout Redefinitions

### 1. Header/NavBar (ctrl.xyz style)

**Current**: Chakra `HStack` with Logo, NavBar, ConnectButton, ColorMode

**ctrl.xyz adaptation**: Fixed dark nav, logo left, nav links right, CTA buttons rightmost

```tsx
// src/components/modules/Header/Header.tsx (restyled)
import { HStack, Box, Container } from '@chakra-ui/react'
import { NavBar } from 'components/elements'
import { ConnectButton } from '../ConnectButton'

const Header = () => (
  <Box
    position="sticky"
    top="0"
    zIndex="50"
    bg="ctrlBg"
    borderBottom="1px solid"
    borderBottomColor="ctrlBorder"
    py="4"
    px={6}
  >
    <Container maxW="container.xl" mx="auto">
      <HStack align="center" justify="space-between">
        <Logo width="40" height="40" />
        <NavBar />
        <HStack gap="6" align="center">
          <ConnectButton />
          <ColorModeButton />
        </HStack>
      </HStack>
    </Container>
  </Box>
)

export default Header
```

### 2. Hero Section (ctrl.xyz "One wallet for all your crypto")

**Current**: Likely Home.tsx with portfolio data

**ctrl.xyz adaptation**: Full-width hero with gradient bg, centered headline, primary CTA button

```tsx
// src/components/templates/home/Home.tsx (adapted)
import { Hero, Title, Description, Button } from 'components/elements'
import { useColorModeValue } from '@chakra-ui/react'

const Home = () => {
  const bg = useColorModeValue('ctrlBg', 'f9fafb') // inverted for light mode

  return (
    <Hero
      bg={bg}
      className="p-8 md:p-16 relative overflow-hidden"
    >
      <Title size="2xl" md="3xl" lg="4xl" fontWeight="bold" color="ctrlPrimaryForeground">
        One wallet for all your crypto
      </Title>
      <Description mt="4" color="ctrlMuted">
        Take. One wallet for all your crypto. Multichain. 2,500+ chains.
      </Description>
      <Button
        mt="8"
        size="lg"
        bg="ctrlPrimary"
        color="ctrlPrimaryForeground"
        _hover: {
          bg: 'ctrlPrimaryForeground',
          color: 'ctrlBg',
        }
      >
        Take Ctrl
      </Button>
    </Hero>
  )
}
```

### 3. Chain Grid (ctrl.xyz "2,500+ chains")

**Current**: Likely Cryptocurrencies or similar template

**ctrl.xyz adaptation**: Responsive grid of chain cards with logos

```tsx
// src/components/templates/Cryptocurrencies/Cryptocurrencies.tsx
import { Grid, Card, CardHeader, CardTitle, CardContent } from '@chakra-ui/react'

const ChainGrid = ({ chains }) => (
  <Grid
    columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
    gap={6}
    className="space-y-0 md:space-y-0"
  >
    {chains.map(chain => (
      <Card
        key={chain.id}
        bg="ctrlCard"
        borderColor="ctrlBorder"
        _hover: {
          boxShadow: 'ctrlMd',
          borderColor: 'ctrlPrimary',
        }
      >
        <CardHeader className="p-4">
          <img
            src={chain.logo}
            alt={chain.name}
            className="h-6 w-auto"
          />
          <CardTitle className="text-sm font-medium" color="ctrlPrimary">
            {chain.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-ctrlMuted">{chain.ticker}</p>
        </CardContent>
      </Card>
    ))}
  </Grid>
)
```

### 4. Features Section (ctrl.xyz "Portfolio overview, Hardware wallet, Security")

**Current**: Alerts, balances templates

**ctrl.xyz adaptation**: Three-column grid of feature cards with icons

```tsx
// src/components/templates/alert/Alert.tsx adapted
import { HStack, Grid, Box, Text, Icon } from '@chakra-ui-react'

const FeaturesSection = () => (
  <Grid
    columns={{ base: 1, md: 3 }}
    gap={6}
    my={16}
  >
    {/* Hardware Wallet Card */}
    <Box
      bg="ctrlCard"
      borderColor="ctrlBorder"
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      transition="ctrl"
      _hover: {
        bg: 'rgba(167, 139, 250, 0.1)',
        borderColor: 'ctrlPrimary',
      }
    >
      {/* icon + text */}
    </Box>

    {/* Portfolio Card */}
    {/* ... */}

    {/* Security Card */}
    {/* ... */}
  </Grid>
)
```

### 5. Footer (ctrl.xyz)

**Current**: Simple "Made by Fintech student"

**ctrl.xyz adaptation**: Full footer with links, social, newsletter

```tsx
// src/components/modules/Footer/Footer.tsx restyled
import { HStack, Grid, Text, Link, Box } from '@chakra-ui-react'

const Footer = () => (
  <Box bg="ctrlCard" borderTop="1px" borderTopColor="ctrlBorder" py={12}>
    <Grid columns={{ base: 1, md: 2 }} gap={6} mx="auto" maxW="container.xl">
      <Grid.Item>
        <Text color="ctrlMuted" fontSize="sm">
          Made by Fintech student
        </Text>
      </Grid.Item>
      <Grid.Item>
        <HStack gap="4">
          {/* Social links with ctrlPrimary color */}
        </HStack>
      </Grid.Item>
    </Grid>
  </Box>
)
```

---

## shadcn/ui vs Chakra Mapping Table

| Chakra UI Prop | shadcn/ui Equivalent | ctrl.xyz Token |
|---|---|---|
| `bg="ctrlCard"` | `className="bg-ctrlCard"` | Card background |
| `color="ctrlPrimary"` | `className="text-ctrlPrimary"` | Text color |
| `borderColor="ctrlBorder"` | `className="border border-ctrlBorder"` | Border |
| `shadow="lg"` | `className="shadow-md"` or `shadow-lg` | Box shadow |
| `radius="lg"` | `className="rounded-lg"` | Border radius |
| `transition="ctrl"` | `transition-all duration-200` | Transition speed |
| `fontWeight="bold"` | `font-semibold` or `font-bold` | Font weight |
| `size="lg"` | `px-6 py-3` (via className) | Button padding |

**shadcn/ui component props that map directly:**

```tsx
// shadcn Button - accepts className, so:
<Button className="bg-ctrl-primary text-ctrl-primary-foreground hover:bg-ctrl-primary/90">
  Connect
</Button>

// shadcn Card - accepts className
<Card className="bg-ctrl-card border border-ctrl-border rounded-lg p-6">
  {/* content */}
</Card>

// shadcn Input - with ctrl colors
<input
  className="bg-ctrl-card text-ctrl-primary-foreground placeholder-gray-400 focus outline-none border border-ctrl-border rounded-lg px-3 py-2"
/>
```

---

## Visual QA Checklist

After applying these tokens, verify:

- [ ] Page bg is `#0a0a0f` (not pure black or different dark)
- [ ] Cards are `#18181b` (not `#1e1e1e` or `#27272a`)
- [ ] Primary buttons have the purple gradient or solid `#a78bfa`
- [ ] Text primary is `#f9fafb`, secondary is `#6b7280`
- [ ] Hover states lighten slightly (not darken completely)
- [ ] Shadows use `rgba(0, 0, 0, 0.3`-`0.5)` not `0 0 0`
- [ ] Rounded corners are `12px`-`16px` not `4px` or `20px`
- [ ] Container is centered with `max-w-7xl` mx-auto

---

## Next Steps for blockatnet

1. **Add `tailwind.config.js`** (created above) and restart dev server
2. **Extend Chakra theme** with `ctrl.theme/chakra.tsx` OR install shadcn/ui
3. **Update key components** using the mappings:
   - `Header.tsx` - nav bar restyling
   - `ConnectButton.tsx` - primary button with ctrl colors
   - `Footer.tsx` - footer layout
   - `Cryptocurrencies.tsx` / `Home.tsx` - hero and grid
4. **Run `npm run build`** to verify no breakage
5. **Visual QA** at 1440px and 390px viewports

Would you like me to:
1. Create the chakra theme file (`src/theme/chakra.tsx`)?
2. Restructure specific components with the new token mappings?
3. Guide the shadcn/ui integration path instead?