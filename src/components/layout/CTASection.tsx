'use client'

import React, { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticlesBackground from 'components/particles/ParticlesBackground'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const CTASection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'top 30%',
        scrub: 1,
      },
    })

    tl.fromTo(contentRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1 }
    )

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const canvas = containerRef.current?.querySelector('canvas')
        if (canvas) {
          gsap.set(canvas, { y: self.progress * 100 })
        }
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => { t.kill() })
    }
  }, [])

  return (
    <Box ref={containerRef} position="relative" py={32} overflow="hidden">
      <Box position="absolute" inset={0} zIndex={0}>
        <ParticlesBackground
          particleCount={60}
          particleSize={1.5}
          speed={0.3}
          opacity={0.5}
          backgroundColor="#0052FF"
          connectionLines={true}
          connectionDistance={120}
          connectionOpacity={0.3}
        />
      </Box>

      <Box position="absolute" inset={0} bgGradient="linear(to-b, blue.600, blue.700)" opacity={0.9} zIndex={1} />

      <Container maxW="container.xl" position="relative" zIndex={2}>
        <VStack ref={contentRef} spacing={8} textAlign="center" maxW="700px" mx="auto">
          <Heading as="h2" fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} fontWeight="bold" color="white" lineHeight="1.2">
            Start building your crypto portfolio today
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="whiteAlpha.800" maxW="500px">
            Join millions of users who trust us with their digital assets.
          </Text>
          <Button size="lg" bg="white" color="blue.600" px={10} py={7} fontSize="lg" fontWeight="semibold" borderRadius="md" _hover={{ bg: 'gray.100', transform: 'translateY(-2px)', boxShadow: 'xl' }} transition="all 0.3s ease">
            Create Free Account
          </Button>
          <Text color="whiteAlpha.600" fontSize="sm">
            No credit card required • Free forever
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default CTASection
