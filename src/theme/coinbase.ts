import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    primary: {
      DEFAULT: '#0052FF',
      50: '#E6F0FF',
      100: '#CCE0FF',
      200: '#99C2FF',
      300: '#66A3FF',
      400: '#3385FF',
      500: '#0052FF',
      600: '#0043CC',
      700: '#003399',
      800: '#002266',
      900: '#001133',
    },
    background: {
      DEFAULT: '#FFFFFF',
      dark: '#0A0B0D',
    },
    surface: {
      DEFAULT: '#F7F8FA',
      dark: '#1A1B1E',
      hover: '#ECEEF1',
      'hover-dark': '#2A2B2E',
    },
    text: {
      DEFAULT: '#0A0B0D',
      secondary: '#565B66',
      muted: '#8C8F96',
      'on-dark': '#FFFFFF',
      'secondary-dark': '#A0A3A8',
      'muted-dark': '#6B6F76',
    },
    border: {
      DEFAULT: '#E3E5E8',
      hover: '#C3C6CA',
      'dark': '#2A2B2E',
      'hover-dark': '#3A3B3E',
    },
    success: '#00B26B',
    danger: '#FF3B30',
    warning: '#FF9500',
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'SF Mono, Monaco, Consolas, monospace',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '48px',
    '5xl': '64px',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  radii: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: '0 0 0 3px rgba(0, 82, 255, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    darkSm: '0 1px 3px rgba(0, 0, 0, 0.3)',
    darkMd: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    darkLg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0A0B0D' : '#FFFFFF',
        color: props.colorMode === 'dark' ? '#FFFFFF' : '#0A0B0D',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        lineHeight: '1.6',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '*, *::before, *::after': {
        borderColor: props.colorMode === 'dark' ? '#2A2B2E' : '#E3E5E8',
      },
      'a, button, [role="button"]': {
        transition: 'all 0.2s ease',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: 'md',
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
          py: '10px',
          fontSize: '16px',
        },
        lg: {
          px: '24px',
          py: '14px',
          fontSize: '18px',
        },
      },
      variants: {
        primary: {
          bg: 'primary.500',
          color: '#FFFFFF',
          _hover: {
            bg: 'primary.600',
            color: '#FFFFFF',
          },
        },
        secondary: (_props: { colorMode: string }) => ({
          bg: _props.colorMode === 'dark' ? '#1A1B1E' : '#FFFFFF',
          color: _props.colorMode === 'dark' ? '#FFFFFF' : '#0A0B0D',
          border: '1px solid',
          borderColor: _props.colorMode === 'dark' ? '#2A2B2E' : '#E3E5E8',
          _hover: {
            borderColor: _props.colorMode === 'dark' ? '#3A3B3E' : '#C3C6CA',
            bg: _props.colorMode === 'dark' ? '#2A2B2E' : '#F7F8FA',
          },
        }),
        ghost: (_props: { colorMode: string }) => ({
          bg: 'transparent',
          color: _props.colorMode === 'dark' ? '#A0A3A8' : '#565B66',
          _hover: {
            bg: _props.colorMode === 'dark' ? '#1A1B1E' : '#F7F8FA',
            color: _props.colorMode === 'dark' ? '#FFFFFF' : '#0A0B0D',
          },
        }),
        outline: (_props: { colorMode: string }) => ({
          bg: 'transparent',
          color: 'primary.500',
          border: '1px solid',
          borderColor: 'primary.500',
          _hover: {
            bg: 'primary.500',
            color: '#FFFFFF',
          },
        }),
        danger: {
          bg: 'danger',
          color: '#FFFFFF',
          _hover: {
            bg: '#E6352B',
            color: '#FFFFFF',
          },
        },
      },
      defaultProps: {
        variant: 'primary',
        size: 'md',
      },
    },
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === 'dark' ? '#1A1B1E' : '#FFFFFF',
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? '#2A2B2E' : '#E3E5E8',
        borderRadius: 'lg',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        _hover: {
          borderColor: props.colorMode === 'dark' ? '#3A3B3E' : '#C3C6CA',
          boxShadow: props.colorMode === 'dark' ? 'darkMd' : 'md',
        },
      }),
    },
    Input: {
      baseStyle: (props: { colorMode: string }) => ({
        field: {
          bg: props.colorMode === 'dark' ? '#1A1B1E' : '#FFFFFF',
          color: props.colorMode === 'dark' ? '#FFFFFF' : '#0A0B0D',
          border: '1px solid',
          borderColor: props.colorMode === 'dark' ? '#2A2B2E' : '#E3E5E8',
          borderRadius: 'md',
          _placeholder: {
            color: props.colorMode === 'dark' ? '#6B6F76' : '#8C8F96',
          },
          _focus: {
            borderColor: 'primary.500',
            boxShadow: 'outline',
          },
        },
      }),
    },
    Table: {
      baseStyle: (props: { colorMode: string }) => ({
        th: {
          color: props.colorMode === 'dark' ? '#6B6F76' : '#8C8F96',
          fontSize: '12px',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '1px solid',
          borderColor: props.colorMode === 'dark' ? '#2A2B2E' : '#E3E5E8',
          px: '16px',
          py: '12px',
          textAlign: 'left',
        },
        td: {
          color: props.colorMode === 'dark' ? '#FFFFFF' : '#0A0B0D',
          borderBottom: '1px solid',
          borderColor: props.colorMode === 'dark' ? '#2A2B2E' : '#E3E5E8',
          px: '16px',
          py: '16px',
        },
        tr: {
          _hover: {
            bg: props.colorMode === 'dark' ? '#1A1B1E' : '#F7F8FA',
          },
        },
      }),
    },
    Heading: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? '#FFFFFF' : '#0A0B0D',
      }),
    },
    Text: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? '#FFFFFF' : '#0A0B0D',
      }),
    },
  },
})

export default theme
