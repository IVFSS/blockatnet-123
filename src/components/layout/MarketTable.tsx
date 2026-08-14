'use client'

import React, { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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

interface MarketData {
  symbol: string
  name: string
  price: string
  change24h: number
  marketCap: string
  volume: string
  icon: string
}

const marketData: MarketData[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$65,432.00', change24h: 2.5, marketCap: '$1.2T', volume: '$28B', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,521.00', change24h: 1.8, marketCap: '$420B', volume: '$15B', icon: 'Ξ' },
  { symbol: 'SOL', name: 'Solana', price: '$152.00', change24h: -0.5, marketCap: '$65B', volume: '$3.2B', icon: '◎' },
  { symbol: 'BNB', name: 'BNB', price: '$580.00', change24h: 0.8, marketCap: '$88B', volume: '$1.8B', icon: '◆' },
  { symbol: 'XRP', name: 'XRP', price: '$0.52', change24h: -1.2, marketCap: '$28B', volume: '$1.2B', icon: '✕' },
  { symbol: 'ADA', name: 'Cardano', price: '$0.45', change24h: 3.2, marketCap: '$16B', volume: '$580M', icon: '₳' },
]

const MarketTable = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('border', 'whiteAlpha.200')
  const containerBg = useColorModeValue('gray.50', 'gray.900')
  const iconBg = useColorModeValue('primary.50', 'primary.900')

  useEffect(() => {
    const rows = tableRef.current?.querySelectorAll('tbody tr')

    if (rows) {
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'top 40%',
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
    <Box ref={containerRef} py={24} bg={containerBg}>
      <Container maxW="container.xl">
        <VStack spacing={4} mb={12} textAlign="center">
          <Heading as="h2" size="xl">Market Overview</Heading>
          <Text color="textSecondary" maxW="600px">
            Real-time prices and market data for top cryptocurrencies
          </Text>
        </VStack>

        <Box bg={bgColor} border="1px solid" borderColor={borderColor} borderRadius="lg" overflow="hidden">
          <Table ref={tableRef} variant="simple">
            <Thead>
              <Tr>
                <Th>Asset</Th>
                <Th isNumeric>Price</Th>
                <Th isNumeric>24h Change</Th>
                <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>Market Cap</Th>
                <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>Volume</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {marketData.map((asset) => (
                <Tr key={asset.symbol} transition="all 0.2s ease" _hover={{ bg: 'surface' }}>
                  <Td>
                    <HStack spacing={3}>
                      <Box w={10} h={10} borderRadius="full" bg={iconBg} display="flex" alignItems="center" justifyContent="center" fontSize="lg">
                        {asset.icon}
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{asset.name}</Text>
                        <Text fontSize="sm" color="textSecondary">{asset.symbol}</Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td isNumeric fontWeight="semibold">{asset.price}</Td>
                  <Td isNumeric>
                    <Text color={asset.change24h >= 0 ? 'success' : 'danger'} fontWeight="medium">
                      {asset.change24h >= 0 ? '↑' : '↓'} {Math.abs(asset.change24h)}%
                    </Text>
                  </Td>
                  <Td isNumeric display={{ base: 'none', md: 'table-cell' }}>{asset.marketCap}</Td>
                  <Td isNumeric display={{ base: 'none', lg: 'table-cell' }}>{asset.volume}</Td>
                  <Td>
                    <Button variant="primary" size="sm">Buy</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Container>
    </Box>
  )
}

export default MarketTable
