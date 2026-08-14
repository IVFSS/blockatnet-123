'use client'

import React, { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Text,
  Link,
  Icon,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaTwitter, FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const footerLinks = {
  Product: [
    { label: 'Buy/Sell', href: '#' },
    { label: 'Wallet', href: '#' },
    { label: 'Earn', href: '#' },
    { label: 'Cards', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Developers', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Support', href: '#' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Law Enforcement', href: '#' },
  ],
}

const socialLinks = [
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaGithub, href: '#', label: 'GitHub' },
  { icon: FaDiscord, href: '#', label: 'Discord' },
]

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('border', 'whiteAlpha.200')
  const mutedColor = useColorModeValue('textMuted', 'gray.400')

  useEffect(() => {
    const columns = gridRef.current?.querySelectorAll('.footer-column')

    if (columns) {
      gsap.fromTo(columns,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 1,
          },
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => { t.kill() })
    }
  }, [])

  return (
    <Box ref={containerRef} bg={bgColor} borderTop="1px solid" borderColor={borderColor} pt={16} pb={8}>
      <Container maxW="container.xl">
        <SimpleGrid ref={gridRef} columns={{ base: 2, md: 4 }} spacing={8} mb={12}>
          {Object.entries(footerLinks).map(([category, links]) => (
            <VStack key={category} className="footer-column" align="start" spacing={4}>
              <Heading as="h4" size="sm" fontWeight="semibold">{category}</Heading>
              <VStack align="start" spacing={2}>
                {links.map((link) => (
                  <Link key={link.label} href={link.href} color={mutedColor} fontSize="sm" _hover={{ color: 'primary.500' }} transition="color 0.2s ease">
                    {link.label}
                  </Link>
                ))}
              </VStack>
            </VStack>
          ))}
        </SimpleGrid>

        <Divider borderColor={borderColor} mb={8} />

        <VStack spacing={6}>
          <HStack spacing={4}>
            {socialLinks.map((social) => (
              <Link key={social.label} href={social.href} aria-label={social.label} color={mutedColor} _hover={{ color: 'primary.500' }} transition="color 0.2s ease">
                <Icon as={social.icon} w={5} h={5} />
              </Link>
            ))}
          </HStack>
          <Text color={mutedColor} fontSize="sm" textAlign="center">
            © 2024 blockatnet. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default Footer
