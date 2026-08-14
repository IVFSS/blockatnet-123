// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, useColorMode } from '@chakra-ui/react';
import NextLink from 'next/link';
import { ConnectButton } from '../modules/ConnectButton';
import { Logo } from 'components/elements';

const ChevronDown = ({ size = 14, color = 'currentColor' }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M6 9L12 15L18 9" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MenuIcon = ({ size = 20, color = 'currentColor' }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 7H20" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <path d="M4 12H20" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <path d="M4 17H20" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ size = 20, color = 'currentColor' }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <path d="M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

interface NavItem {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Cryptocurrencies', href: '/Cryptocurrencies' },
  {
    label: 'Pages',
    href: '#',
    dropdown: [
      { label: 'Transactions', href: '/transactions' },
      { label: 'ERC20 Transfer', href: '/transfers/erc20' },
      { label: 'NFT Transfer', href: '/transfers/nft' },
      { label: 'ERC20 Balance', href: '/balances/erc20' },
      { label: 'NFT Balance', href: '/balances/nft' },
    ],
  },
  { label: 'Alert', href: '/alert' },
  { label: 'Track', href: '/track' },
];

const BouncyNav = ({ items = defaultNavItems }: any) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<number | null>(null);
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Colors based on color mode
  const colors = useMemo(() => isDark
    ? {
        navBg: 'rgb(23, 23, 25)', border: 'rgb(40, 40, 44)', text: 'rgba(255,255,255,0.7)',
        hoverBg: '#0052FF', hoverText: '#fff', dropdownBg: 'rgb(23, 23, 25)',
      }
    : {
        navBg: 'rgb(248, 248, 248)', border: 'rgb(230, 230, 230)', text: 'rgba(0,0,0,0.6)',
        hoverBg: '#0052FF', hoverText: '#fff', dropdownBg: '#fff',
      }, [isDark]);

  const spring = { type: 'spring' as const, stiffness: 500, damping: 24 };
  const sharedRadius = 999;

  // Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      setHidden(y > lastScrollY.current && y > 160);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pill position
  const updatePill = useCallback((index: number | null) => {
    if (index === null) { setPillStyle(s => ({ ...s, opacity: 0 })); return; }
    const el = linkRefs.current[index];
    if (!el) return;
    setPillStyle({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  }, []);

  useEffect(() => { updatePill(hoveredIndex); }, [hoveredIndex, updatePill]);

  useEffect(() => { if (!mobileOpen) setOpenMobileDropdown(null); }, [mobileOpen]);

  return (
    <Box
      position="sticky" top={0} zIndex={1000} w="100%"
      display="flex" flexDirection="column" alignItems="center"
      transform={hidden ? 'translateY(-130%)' : 'translateY(0%)'}
      transition="transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
      px={4} pt={4}
    >
      {/* Navbar */}
      <Box
        position="relative" w="100%" maxW="1200px"
        display="flex" alignItems="center" justifyContent="space-between"
        px={{ base: 3, md: 4 }} py={3}
        borderRadius={36} bg={colors.navBg}
        border="1px solid" borderColor={colors.border}
        boxShadow={scrolled ? '0 8px 30px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.12)'}
        backdropFilter="blur(14px)"
        transition="box-shadow 0.35s ease"
      >
        {/* Logo */}
          <NextLink href="/" passHref legacyBehavior>
            <Box
              as="a" display="flex" alignItems="center" gap={2}
              textDecoration="none" flexShrink={0} zIndex={2}
              w="auto" h="auto"
            >
              <Logo />
            </Box>
          </NextLink>

        {/* Desktop menu */}
        {!isMobile && (
          <Box
            position="relative" display="flex" alignItems="center" gap={2}
            onMouseLeave={() => { setHoveredIndex(null); setOpenDropdown(null); }}
          >
            {/* Bouncy pill */}
            <motion.div
              animate={{ left: pillStyle.left, width: pillStyle.width, opacity: pillStyle.opacity }}
              transition={spring}
              style={{
                position: 'absolute', top: 0, height: '100%',
                background: colors.hoverBg, borderRadius: sharedRadius, zIndex: 1, pointerEvents: 'none',
              }}
            />

            {items.map((item: NavItem, i: number) => (
              <Box
                key={i}
                ref={(el) => { linkRefs.current[i] = el; }}
                position="relative"
                onMouseEnter={() => {
                  setHoveredIndex(i);
                  if (item.dropdown?.length) setOpenDropdown(i);
                  else setOpenDropdown(null);
                }}
              >
                <NextLink href={item.href} passHref legacyBehavior>
                  <Box
                    as="a"
                    display="flex" alignItems="center" gap={1}
                    px={4} py={3} fontSize="15px" fontWeight="500"
                    letterSpacing="-0.02em" borderRadius={sharedRadius}
                    cursor="pointer" whiteSpace="nowrap" zIndex={2}
                    color={hoveredIndex === i ? colors.hoverText : colors.text}
                    transition="color 0.2s ease"
                    textDecoration="none"
                  >
                    {item.label}
                    {item.dropdown?.length ? (
                      <motion.span
                        animate={{ rotate: openDropdown === i ? 180 : 0 }}
                        transition={spring}
                        style={{ display: 'flex' }}
                      >
                        <ChevronDown size={13} color={hoveredIndex === i ? colors.hoverText : colors.text} />
                      </motion.span>
                    ) : null}
                  </Box>
                </NextLink>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.dropdown?.length && openDropdown === i && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={spring}
                      style={{
                        position: 'absolute', top: 'calc(100% + 12px)', left: 0,
                        minWidth: 200, background: colors.dropdownBg,
                        border: `1px solid ${colors.border}`, borderRadius: 18,
                        padding: 8, boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(14px)', zIndex: 50,
                      }}
                    >
                      {item.dropdown.map((sub: any, si: number) => (
                        <NextLink key={si} href={sub.href} passHref legacyBehavior>
                          <Box
                            as="a"
                            display="block" px={3} py={2.5} borderRadius={12}
                            textDecoration="none" color={colors.text}
                            fontSize="15px" fontWeight="500"
                            _hover={{ bg: colors.hoverBg, color: colors.hoverText }}
                            transition="all 0.15s"
                          >
                            {sub.label}
                          </Box>
                        </NextLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            ))}
          </Box>
        )}

        {/* Connect Button */}
        {!isMobile && (
          <Box flexShrink={0}>
            <ConnectButton />
          </Box>
        )}

        {/* Mobile toggle */}
        {isMobile && (
          <motion.button
            onClick={() => setMobileOpen(v => !v)}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: '50%',
              background: colors.hoverBg, border: 'none', cursor: 'pointer', zIndex: 2,
            }}
          >
            {mobileOpen
              ? <CloseIcon color={colors.hoverText} />
              : <MenuIcon color={colors.hoverText} />
            }
          </motion.button>
        )}
      </Box>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            layout={false}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={spring}
            style={{
              position: 'relative', width: '100%', maxWidth: 1200,
              marginTop: 12, background: colors.navBg,
              border: `1px solid ${colors.border}`, borderRadius: 20,
              padding: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
              backdropFilter: 'blur(14px)', zIndex: 999,
            }}
          >
            {items.map((item: NavItem, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.04 }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" px={4} py={3}>
                  <NextLink href={item.href} passHref legacyBehavior>
                    <Box
                      as="a" flex={1} color={colors.hoverText}
                      textDecoration="none" fontSize="16px" fontWeight="500"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Box>
                  </NextLink>
                  {item.dropdown?.length ? (
                    <motion.button
                      type="button"
                      onClick={() => setOpenMobileDropdown(prev => prev === i ? null : i)}
                      animate={{ rotate: openMobileDropdown === i ? 180 : 0 }}
                      transition={spring}
                      style={{
                        border: 'none', background: 'transparent', color: colors.text,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, cursor: 'pointer', padding: 0,
                      }}
                    >
                      <ChevronDown color={colors.text} />
                    </motion.button>
                  ) : null}
                </Box>

                <AnimatePresence initial={false}>
                  {item.dropdown?.length && openMobileDropdown === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={spring}
                      style={{ overflow: 'hidden' }}
                    >
                      <Box display="flex" flexDirection="column" gap={1} px={4} pb={2}>
                        {item.dropdown.map((sub: any, si: number) => (
                          <NextLink key={si} href={sub.href} passHref legacyBehavior>
                            <Box
                              as="a" display="block" px={4} py={2.5} pl={7}
                              fontSize="15px" color={colors.text}
                              textDecoration="none" borderRadius={12}
                              _hover={{ bg: colors.hoverBg, color: colors.hoverText }}
                              onClick={() => setMobileOpen(false)}
                            >
                              {sub.label}
                            </Box>
                          </NextLink>
                        ))}
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            <Box h="1px" bg={colors.border} mx={2} my={2} />

            <Box my={2}>
              <ConnectButton />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default BouncyNav;
