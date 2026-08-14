// @ts-nocheck
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// WorldLabs.ai design tokens — extracted from live site
const worldlabsTokens = {
  colors: {
    // Core palette (WorldLabs.ai actual)
    worldlabsBg: '#f9f9fb',           // Light gray background
    worldlabsCard: '#ffffff',          // White cards
    worldlabsPrimary: '#2a679c',       // Blue accent
    worldlabsPrimaryForeground: '#2e2e38', // Dark text
    worldlabsMuted: '#9494a8',         // Muted gray
    worldlabsBorder: '#e5e7eb',        // Light border
    worldlabsDark: '#111111',          // Almost black (dark sections)
    worldlabsSuccess: '#05c92f',       // Green
    worldlabsWarning: '#f59e0b',       // Amber
    worldlabsInfo: '#3b82f6',          // Blue

    // Semantic mappings for Chakra
    bg: {
      DEFAULT: '#f9f9fb',             // Light gray background
      card: '#ffffff',                // White cards
      dark: '#111111',                // Dark sections
    },
    text: {
      DEFAULT: '#2e2e38',             // Dark gray text
      muted: '#9494a8',               // Muted gray
      primary: '#2a679c',             // Blue accent
    },
    border: {
      DEFAULT: '#e5e7eb',             // Light border
    },
  },

  // Typography (WorldLabs.ai uses "roobert" for body, "Gilda Display" for headings)
  fonts: {
    heading: '"Gilda Display", Georgia, serif',
    body: 'roobert, "Helvetica Neue", Arial, sans-serif',
    mono: 'SF Mono, Consolas, monospace',
  },

  // Border radius
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },

  // Box shadows (light, matching WorldLabs.ai)
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    outline: '0 0 0 3px rgba(42, 103, 156, 0.3)',
  },

  // Spacing scale (base 4px)
  space: {
    px: '1px',
    0.5: '2px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
  },

  // Breakpoints
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    '2xl': '1440px',
  },

  // Transitions
  transitions: {
    fast: 'all 0.15s ease-in-out',
    normal: 'all 0.2s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },

  // Container
  sizes: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
    },
  },
}

// Component style overrides (WorldLabs.ai)
const componentStyles = {
  Button: {
    baseStyle: {
      fontWeight: '500',
      borderRadius: '8px', // WorldLabs.ai uses 8px radius
      _hover: {
        transform: 'translateY(-1px)',
      },
      _active: {
        transform: 'translateY(0)',
      },
    },
    sizes: {
      sm: {
        px: '12px',
        py: '6px',
        fontSize: '14px',
      },
      md: {
        px: '16px',
        py: '8px',
        fontSize: '16px',
      },
      lg: {
        px: '24px',
        py: '12px',
        fontSize: '18px',
      },
    },
    variants: {
      primary: {
        bg: 'worldlabsPrimary',
        color: '#ffffff', // White text on blue
        _hover: {
          bg: '#1e4f7a', // Darker blue
          color: '#ffffff',
        },
      },
      secondary: {
        bg: 'worldlabsCard',
        color: 'worldlabsPrimaryForeground',
        border: '1px solid',
        borderColor: 'worldlabsBorder',
        _hover: {
          borderColor: 'worldlabsPrimary',
          color: 'worldlabsPrimary',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'worldlabsMuted',
        _hover: {
          bg: 'worldlabsCard',
          color: 'worldlabsPrimaryForeground',
        },
      },
      outline: {
        bg: 'transparent',
        color: 'worldlabsPrimary',
        border: '1px solid',
        borderColor: 'worldlabsPrimary',
        _hover: {
          bg: 'worldlabsPrimary',
          color: '#ffffff',
        },
      },
    },
    defaultProps: {
      variant: 'primary',
      size: 'md',
    },
  },

  Card: {
    baseStyle: {
      bg: 'worldlabsCard',
      border: '1px solid',
      borderColor: 'worldlabsBorder',
      borderRadius: '16px', // WorldLabs.ai uses 16px radius for cards
      overflow: 'hidden',
      boxShadow: 'sm',
    },
  },

  Input: {
    baseStyle: {
      field: {
        bg: '#ffffff',
        color: 'worldlabsPrimaryForeground',
        border: '1px solid',
        borderColor: 'worldlabsBorder',
        borderRadius: 'md',
        _placeholder: {
          color: 'worldlabsMuted',
        },
        _focus: {
          borderColor: 'worldlabsPrimary',
          boxShadow: 'outline',
        },
      },
    },
  },

  Textarea: {
    baseStyle: {
      bg: '#ffffff',
      color: 'worldlabsPrimaryForeground',
      border: '1px solid',
      borderColor: 'worldlabsBorder',
      borderRadius: 'md',
      _placeholder: {
        color: 'worldlabsMuted',
      },
      _focus: {
        borderColor: 'worldlabsPrimary',
        boxShadow: 'outline',
      },
    },
  },

  Select: {
    baseStyle: {
      field: {
        bg: 'worldlabsCard',
        color: 'worldlabsPrimaryForeground',
        border: '1px solid',
        borderColor: 'worldlabsBorder',
        borderRadius: 'md',
        _focus: {
          borderColor: 'worldlabsPrimary',
          boxShadow: 'outline',
        },
      },
    },
  },

  Modal: {
    baseStyle: {
      dialog: {
        bg: 'worldlabsCard',
        border: '1px solid',
        borderColor: 'worldlabsBorder',
        borderRadius: '16px',
      },
    },
  },

  Drawer: {
    baseStyle: {
      dialog: {
        bg: 'worldlabsCard',
        borderLeft: '1px solid',
        borderLeftColor: 'worldlabsBorder',
      },
    },
  },

  Popover: {
    baseStyle: {
      content: {
        bg: 'worldlabsCard',
        border: '1px solid',
        borderColor: 'worldlabsBorder',
        borderRadius: '16px',
      },
    },
  },

  Tooltip: {
    baseStyle: {
      bg: 'worldlabsCard',
      color: 'worldlabsPrimaryForeground',
      border: '1px solid',
      borderColor: 'worldlabsBorder',
      borderRadius: 'md',
      fontSize: '14px',
      px: '12px',
      py: '6px',
    },
  },

  Tabs: {
    baseStyle: {
      tab: {
        color: 'worldlabsMuted',
        _selected: {
          color: 'worldlabsPrimary',
          borderBottomColor: 'worldlabsPrimary',
        },
        _hover: {
          color: 'worldlabsPrimaryForeground',
        },
      },
      tablist: {
        borderBottom: '1px solid',
        borderColor: 'worldlabsBorder',
      },
      tabpanel: {
        px: 0,
      },
    },
  },

  Accordion: {
    baseStyle: {
      container: {
        border: '1px solid',
        borderColor: 'worldlabsBorder',
        borderRadius: 'md',
        overflow: 'hidden',
      },
      button: {
        _hover: {
          bg: 'rgba(42, 103, 156, 0.05)',
        },
      },
    },
  },

  Badge: {
    baseStyle: {
      borderRadius: 'full',
      px: '8px',
      py: '2px',
      fontSize: '12px',
      fontWeight: '500',
    },
    variants: {
      success: {
        bg: 'rgba(5, 201, 47, 0.15)',
        color: 'worldlabsSuccess',
      },
      warning: {
        bg: 'rgba(245, 158, 11, 0.15)',
        color: 'worldlabsWarning',
      },
      info: {
        bg: 'rgba(59, 130, 246, 0.15)',
        color: 'worldlabsInfo',
      },
    },
  },

  Avatar: {
    baseStyle: {
      container: {
        bg: 'worldlabsCard',
        border: '2px solid',
        borderColor: 'worldlabsBorder',
      },
    },
  },

  Divider: {
    baseStyle: {
      borderColor: 'worldlabsBorder',
    },
  },

  Link: {
    baseStyle: {
      color: 'worldlabsPrimary',
      _hover: {
        textDecoration: 'underline',
      },
    },
  },

  Text: {
    baseStyle: {
      color: 'worldlabsPrimaryForeground',
    },
    variants: {
      muted: {
        color: 'worldlabsMuted',
      },
      primary: {
        color: 'worldlabsPrimary',
      },
    },
  },

  Heading: {
    baseStyle: {
      color: 'worldlabsPrimaryForeground',
      fontWeight: '700',
      fontFamily: '"Gilda Display", Georgia, serif',
    },
  },

  Box: {
    baseStyle: {
      bg: 'worldlabsBg',
    },
  },

  Flex: {
    baseStyle: {},
  },

  Stack: {
    baseStyle: {},
  },

  Grid: {
    baseStyle: {},
  },

  Table: {
    baseStyle: {
      th: {
        color: 'worldlabsMuted',
        fontSize: '12px',
        fontWeight: '500',
        textTransform: 'none',
        borderBottom: '1px solid',
        borderColor: 'worldlabsBorder',
        px: '16px',
        py: '12px',
      },
      td: {
        color: 'worldlabsPrimaryForeground',
        borderBottom: '1px solid',
        borderColor: 'worldlabsBorder',
        px: '16px',
        py: '12px',
      },
      tr: {
        _hover: {
          bg: 'rgba(42, 103, 156, 0.03)',
        },
      },
    },
  },

  Stat: {
    baseStyle: {
      container: {
        bg: 'worldlabsCard',
        border: '1px solid',
        borderColor: 'worldlabsBorder',
        borderRadius: '16px',
        p: '24px',
      },
      label: {
        color: 'worldlabsMuted',
        fontSize: '14px',
      },
      number: {
        color: 'worldlabsPrimaryForeground',
        fontSize: '24px',
        fontWeight: '600',
      },
      helpText: {
        color: 'worldlabsMuted',
        fontSize: '14px',
      },
    },
  },
}

// Global styles (WorldLabs.ai)
const globalStyles = {
  global: {
    body: {
      bg: 'worldlabsBg',
      color: 'worldlabsText',
      fontFamily: 'roobert, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.6',
    },
    '*, *::before, *::after': {
      borderColor: 'worldlabsBorder',
    },
    'a, button, [role="button"]': {
      transition: 'all 0.2s ease',
    },
    h1, h2, h3, h4, h5, h6: {
      fontFamily: '"Gilda Display", Georgia, serif',
    },
  },
}

// Export the theme
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  ...worldlabsTokens,
  config,
  styles: globalStyles,
  components: componentStyles,
})

export default theme
