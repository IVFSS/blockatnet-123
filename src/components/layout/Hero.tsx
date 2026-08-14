'use client'

import React, { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticlesBackground from 'components/particles/ParticlesBackground'
import NextLink from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('white', '#0A0B0D')
  const textColor = useColorModeValue('text', 'white')
  const mutedColor = useColorModeValue('textSecondary', 'gray.400')

  useEffect(() => {
    if (!headlineRef.current) { return }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(headlineRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
    .fromTo(subtextRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(statsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.3'
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <Box
      ref={containerRef}
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      bg={bgColor}
      overflow="hidden"
    >
      <Box position="absolute" inset={0} zIndex={0}>
        <ParticlesBackground
          particleCount={80}
          particleSize={1.5}
          speed={0.3}
          opacity={useColorModeValue(0.3, 0.5)}
          backgroundColor={useColorModeValue('#F7F8FA', '#0A0B0D')}
          connectionLines={true}
          connectionDistance={150}
          connectionOpacity={0.2}
        />
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={8} align="start" maxW="800px">
          <Heading
            ref={headlineRef}
            as="h1"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl', xl: '6xl' }}
            fontWeight="bold"
            color={textColor}
            lineHeight="1.1"
            letterSpacing="-0.02em"
          >
            The future of money{' '}
            <Text
              as="span"
              bgGradient="linear(to-r, primary.400, primary.600)"
              bgClip="text"
            >
              is here
            </Text>
          </Heading>

          <Text
            ref={subtextRef}
            fontSize={{ base: 'lg', md: 'xl' }}
            color={mutedColor}
            maxW="600px"
            lineHeight="1.6"
          >
            Buy, sell, and manage your crypto portfolio with confidence.
            Join millions of users worldwide.
          </Text>

          <HStack ref={ctaRef} spacing={4} flexWrap="wrap">
            <NextLink href="/Cryptocurrencies" passHref legacyBehavior>
              <Button as="a" variant="primary" size="lg">
                Get Started
              </Button>
            </NextLink>
            <NextLink href="/track" passHref legacyBehavior>
              <Button as="a" variant="secondary" size="lg">
                Learn More
              </Button>
            </NextLink>
          </HStack>

          <HStack
            ref={statsRef}
            spacing={8}
            mt={4}
            flexWrap="wrap"
          >
            {[
              { value: '$80B+', label: 'Trading Volume' },
              { value: '100M+', label: 'Users' },
              { value: '190+', label: 'Countries' },
            ].map((stat) => (
              <VStack key={stat.label} align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {stat.value}
                </Text>
                <Text fontSize="sm" color={mutedColor}>
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default Hero
