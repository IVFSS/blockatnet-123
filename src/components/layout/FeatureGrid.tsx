'use client'

import React, { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiShield, FiZap, FiDollarSign, FiGlobe, FiTrendingUp, FiClock } from 'react-icons/fi'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Feature {
  icon: React.ElementType
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  { icon: FiShield, title: 'Bank-Grade Security', description: 'Your assets are protected by industry-leading security measures and cold storage.', color: 'blue.500' },
  { icon: FiZap, title: 'Instant Transactions', description: 'Buy, sell, and transfer crypto instantly with our optimized matching engine.', color: 'purple.500' },
  { icon: FiDollarSign, title: 'Low Fees', description: 'Competitive trading fees starting at 0.5% with no hidden charges.', color: 'green.500' },
  { icon: FiGlobe, title: 'Global Access', description: 'Available in 100+ countries with local payment methods.', color: 'orange.500' },
  { icon: FiTrendingUp, title: 'Advanced Charts', description: 'Professional trading tools and real-time market data.', color: 'teal.500' },
  { icon: FiClock, title: '24/7 Support', description: 'Our team is here to help you around the clock.', color: 'pink.500' },
]

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          end: 'top 65%',
          scrub: 1,
        },
      }
    )
  }, [])

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('border', 'whiteAlpha.200')

  return (
    <VStack
      ref={cardRef}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={8}
      spacing={4}
      align="start"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        borderColor: 'primary.500',
      }}
    >
      <Box
        w={12}
        h={12}
        borderRadius="md"
        bg={`${feature.color}10`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={feature.icon} w={6} h={6} color={feature.color} />
      </Box>
      <Heading as="h3" size="md">{feature.title}</Heading>
      <Text color="textSecondary" fontSize="md">{feature.description}</Text>
    </VStack>
  )
}

const FeatureGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
      },
    })

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => { t.kill() })
    }
  }, [])

  return (
    <Box ref={containerRef} py={24}>
      <Container maxW="container.xl">
        <VStack ref={titleRef} spacing={4} mb={16} textAlign="center">
          <Heading as="h2" size="xl">Why Choose Us</Heading>
          <Text color="textSecondary" maxW="600px">
            We're building the most trusted and accessible platform for crypto
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default FeatureGrid
