'use client'

import React, { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  HStack,
  VStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface Asset {
  symbol: string
  name: string
  price: string
  change: number
  icon: string
}

const assets: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$65,432', change: 2.5, icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,521', change: 1.8, icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', price: '$152', change: -0.5, icon: '◎' },
  { symbol: 'ADA', name: 'Cardano', price: '$0.45', change: 3.2, icon: '₳' },
  { symbol: 'DOT', name: 'Polkadot', price: '$7.21', change: 1.1, icon: '●' },
  { symbol: 'AVAX', name: 'Avalanche', price: '$38.50', change: -1.3, icon: '▲' },
]

const AssetCard = ({ asset, index }: { asset: Asset; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out',
      }
    )
  }, [index])

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('border', 'whiteAlpha.200')
  const iconBg = useColorModeValue('primary.50', 'primary.900')

  return (
    <Box
      ref={cardRef}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      minW="200px"
      cursor="pointer"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        borderColor: 'primary.500',
      }}
    >
      <HStack spacing={3} mb={4}>
        <Box
          w={10}
          h={10}
          borderRadius="full"
          bg={iconBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xl"
        >
          {asset.icon}
        </Box>
        <VStack align="start" spacing={0}>
          <Text fontWeight="semibold" fontSize="md">
            {asset.name}
          </Text>
          <Text fontSize="sm" color="textSecondary">
            {asset.symbol}
          </Text>
        </VStack>
      </HStack>

      <VStack align="start" spacing={1}>
        <Text fontSize="xl" fontWeight="bold">
          {asset.price}
        </Text>
        <Text
          fontSize="sm"
          color={asset.change >= 0 ? 'success' : 'danger'}
          fontWeight="medium"
        >
          {asset.change >= 0 ? '↑' : '↓'} {Math.abs(asset.change)}%
        </Text>
      </VStack>

      <Button variant="primary" size="sm" width="full" mt={4}>
        Buy {asset.symbol}
      </Button>
    </Box>
  )
}

const AssetCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('gray.50', 'gray.900')

  useEffect(() => {
    const container = containerRef.current
    const scroll = scrollRef.current

    if (!container || !scroll) { return }

    gsap.fromTo(container,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    )

    const totalWidth = scroll.scrollWidth - scroll.clientWidth
    gsap.to(scroll, {
      scrollLeft: totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => { t.kill() })
      // eslint-disable-next-line consistent-return
    }
  }, [])

  return (
    <Box ref={containerRef} py={20} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={8} mb={12}>
          <Heading as="h2" size="xl" textAlign="center">
            Featured Assets
          </Heading>
          <Text color="textSecondary" textAlign="center" maxW="600px">
            Start trading with the most popular cryptocurrencies
          </Text>
        </VStack>

        <Box
          ref={scrollRef}
          overflowX="auto"
          pb={4}
          sx={{
            '&::-webkit-scrollbar': { height: '8px' },
            '&::-webkit-scrollbar-track': { bg: 'surface', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb': { bg: 'border', borderRadius: '4px' },
          }}
        >
          <HStack spacing={6} minW="max-content">
            {assets.map((asset, index) => (
              <AssetCard key={asset.symbol} asset={asset} index={index} />
            ))}
          </HStack>
        </Box>
      </Container>
    </Box>
  )
}

export default AssetCarousel
