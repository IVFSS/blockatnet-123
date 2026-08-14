// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text, Image, Flex,
  Button, Heading, Badge, useColorModeValue, Skeleton,
  HStack, VStack, Stat, StatLabel, StatNumber, StatArrow,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  SimpleGrid, Input, InputGroup, InputLeftElement,
} from '@chakra-ui/react';
import { FiSearch, FiTrendingUp, FiTrendingDown, FiX } from 'react-icons/fi';
import CoinPriceChart from './CoinPriceChart';

const STABLECOINS = ['USDC', 'USDT', 'BUSD', 'DAI', 'TUSD', 'USDP', 'FDUSD', 'USD1', 'RLUSD', 'PYUSD', 'EURC', 'EUR'];

const TOKENINSIGHT_SLUG_MAP = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', ADA: 'cardano',
  DOT: 'polkadot', AVAX: 'avalanche', LINK: 'chainlink', UNI: 'uniswap',
  MATIC: 'matic-network', LTC: 'litecoin', XRP: 'ripple', DOGE: 'dogecoin',
  SHIB: 'shiba-inu', FIL: 'filecoin', AAVE: 'aave', NEAR: 'near',
  APT: 'aptos', ARB: 'arbitrum', OP: 'optimism', SUI: 'sui',
  SEI: 'sei-network', TIA: 'celestia', ATOM: 'cosmos',
};

const Cryptocurrencies = () => {
  const [coinsData, setCoinsData] = useState([]);
  const [coinDetails, setCoinDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const widgetRef = useRef(null);
  const PAGE_SIZE = 15;

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const muted = useColorModeValue('gray.500', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');

  useEffect(() => {
    fetch('/api/market?type=tickers&limit=100')
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setCoinsData(
          json.data
            .filter(t => !STABLECOINS.includes(t.base))
            .map(t => ({
              id: t.symbol, name: t.name || t.base, symbol: t.base,
              logo: t.logo, price: t.price, change24h: t.change24h,
              volume24h: t.volume24h, high24h: t.high24h, low24h: t.low24h,
            }))
        );
      })
      .catch(e => setError(e.toString()))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCoin) return;
    setCoinDetails([]);
    setHistoryPage(0);
    fetch(`/api/market?type=ohlcv&symbol=${selectedCoin.id}&limit=30`)
      .then(r => r.json())
      .then(d => {
        if (d?.data) setCoinDetails(d.data.map(i => ({
          timestamp: i.timestamp, price: i.close, market_cap: 0, vol_spot_24h: i.volume,
        })));
      })
      .catch(() => {});
    loadWidget();
  }, [selectedCoin]);

  const loadWidget = () => {
    if (!widgetRef.current || !selectedCoin) return;
    widgetRef.current.innerHTML = '';
    const slug = TOKENINSIGHT_SLUG_MAP[selectedCoin.symbol] || selectedCoin.symbol.toLowerCase();

    // Build an iframe with the widget embedded
    const html = `<!DOCTYPE html><html><head>
      <style>body{margin:0;padding:8px;font-family:system-ui;background:transparent;}</style>
    </head><body>
      <tokeninsight-rating-widget subject="black" language="en" token="${slug}"></tokeninsight-rating-widget>
      <script src="https://s2.tokeninsight.com/widgets/tokeninsight-rating-widget/index.js"><\/script>
    </body></html>`;

    const iframe = document.createElement('iframe');
    iframe.srcdoc = html;
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';

    // Auto-height: listen for resize from iframe content
    iframe.onload = () => {
      try {
        const h = iframe.contentDocument?.body?.scrollHeight;
        if (h) iframe.style.height = h + 'px';
      } catch {}
      // Poll for size changes
      const poll = setInterval(() => {
        try {
          const h = iframe.contentDocument?.body?.scrollHeight;
          if (h && h > 0) iframe.style.height = h + 'px';
        } catch {}
      }, 500);
      setTimeout(() => clearInterval(poll), 15000);
    };

    widgetRef.current.appendChild(iframe);
  };

  const coins = coinsData.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(coins.length / PAGE_SIZE);
  const pageCoins = coins.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const fp = (p) => p >= 1 ? `$${p.toFixed(2)}` : `$${p.toFixed(4)}`;
  const fv = (v) => v >= 1e9 ? `$${(v/1e9).toFixed(2)}B` : v >= 1e6 ? `$${(v/1e6).toFixed(2)}M` : `$${(v/1e3).toFixed(1)}K`;

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Flex p={{ base: 4, md: 6 }} pb={0} justify="space-between" align="center">
        <Heading size="lg">Cryptocurrencies</Heading>
        <InputGroup maxW="280px" size="sm">
          <InputLeftElement pointerEvents="none"><FiSearch /></InputLeftElement>
          <Input placeholder="Search..." value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(0); }}
            borderRadius="full" bg={bg} border="1px solid" borderColor={borderColor}
          />
        </InputGroup>
      </Flex>

      <Flex p={{ base: 4, md: 6 }} gap={5} direction={{ base: 'column', lg: 'row' }} align="flex-start">
        {/* ===== LEFT COLUMN ===== */}
        <VStack flex="1" minW={0} spacing={4} align="stretch">
          {/* Table */}
          <Box bg={bg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
          {isLoading ? (
            <Box p={6}>
              {Array.from({ length: 10 }).map((_, i) => (
                <HStack key={i} mb={3} spacing={4}>
                  <Skeleton h="16px" w="30px" />
                  <Skeleton h="16px" w="120px" />
                  <Skeleton h="16px" w="80px" />
                  <Skeleton h="16px" w="60px" />
                </HStack>
              ))}
            </Box>
          ) : error ? (
            <Box p={10} textAlign="center">
              <Text color="red.500">{error}</Text>
              <Button mt={4} size="sm" onClick={() => window.location.reload()}>Retry</Button>
            </Box>
          ) : (
            <>
              <TableContainer maxH={{ base: '50vh', lg: '75vh' }} overflowY="auto">
                <Table size="sm" variant="simple">
                  <Thead position="sticky" top={0} bg={bg} zIndex={1}>
                    <Tr>
                      <Th w="40px">#</Th>
                      <Th>Coin</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>24h</Th>
                      <Th isNumeric display={{ base: 'none', md: 'table-cell' }}>Vol</Th>
                      <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>High</Th>
                      <Th isNumeric display={{ base: 'none', lg: 'table-cell' }}>Low</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pageCoins.map((coin, i) => {
                      const active = selectedCoin?.id === coin.id;
                      return (
                        <Tr key={coin.id} onClick={() => setSelectedCoin(coin)} cursor="pointer"
                          bg={active ? selectedBg : 'transparent'} _hover={{ bg: hoverBg }}>
                          <Td color={muted} fontSize="xs">{currentPage * PAGE_SIZE + i + 1}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <Image src={coin.logo} boxSize="24px" borderRadius="full"
                                fallbackSrc={`https://ui-avatars.com/api/?name=${coin.symbol}&size=24&background=4A90D9&color=fff`} />
                              <Box lineHeight={1.2}>
                                <Text fontWeight="600" fontSize="sm">{coin.symbol}</Text>
                                <Text fontSize="xs" color={muted}>{coin.name}</Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td isNumeric fontWeight="600" fontSize="sm">{fp(coin.price)}</Td>
                          <Td isNumeric>
                            <Badge colorScheme={coin.change24h >= 0 ? 'green' : 'red'}
                              variant="subtle" borderRadius="full" fontSize="xs">
                              {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                            </Badge>
                          </Td>
                          <Td isNumeric color={muted} fontSize="xs" display={{ base: 'none', md: 'table-cell' }}>
                            {fv(coin.volume24h)}
                          </Td>
                          <Td isNumeric color={muted} fontSize="xs" display={{ base: 'none', lg: 'table-cell' }}>
                            {fp(coin.high24h)}
                          </Td>
                          <Td isNumeric color={muted} fontSize="xs" display={{ base: 'none', lg: 'table-cell' }}>
                            {fp(coin.low24h)}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Flex p={3} borderTop="1px solid" borderColor={borderColor}
                justify="space-between" align="center">
                <Text fontSize="xs" color={muted}>
                  {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, coins.length)} of {coins.length}
                </Text>
                <HStack spacing={1}>
                  <Button size="xs" isDisabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
                  {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => (
                    <Button key={i} size="xs" variant={currentPage === i ? 'solid' : 'ghost'}
                      colorScheme="blue" onClick={() => setCurrentPage(i)}>{i + 1}</Button>
                  ))}
                  <Button size="xs" isDisabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                </HStack>
              </Flex>
            </>
          )}
        </Box>

        {/* Rating (inside left column) */}
        {selectedCoin && (
          <Box bg={bg} borderRadius="xl" border="1px solid" borderColor={borderColor} p={5}>
            <Text fontSize="xs" fontWeight="600" color={muted} mb={3} textTransform="uppercase" letterSpacing="wide">
              Rating — {selectedCoin.symbol}
            </Text>
            <Box ref={widgetRef} w="100%" />
          </Box>
        )}
        </VStack>

        {/* ===== RIGHT: DETAILS ===== */}
        <Box w={{ base: '100%', lg: '380px' }} flexShrink={0}>
          {selectedCoin ? (
            <VStack spacing={4} align="stretch">
              {/* Coin Info */}
              <Box bg={bg} borderRadius="xl" border="1px solid" borderColor={borderColor} p={4}>
                <Flex justify="space-between" align="center" mb={3}>
                  <HStack spacing={3}>
                    <Image src={selectedCoin.logo} boxSize="36px" borderRadius="full"
                      fallbackSrc={`https://ui-avatars.com/api/?name=${selectedCoin.symbol}&size=36&background=4A90D9&color=fff`} />
                    <Box>
                      <Text fontWeight="700">{selectedCoin.name}</Text>
                      <Text fontSize="xs" color={muted}>{selectedCoin.symbol}/USDT</Text>
                    </Box>
                  </HStack>
                  <Button size="xs" variant="ghost" onClick={() => setSelectedCoin(null)}>
                    <FiX />
                  </Button>
                </Flex>
                <SimpleGrid columns={2} spacing={3}>
                  <Stat size="sm">
                    <StatLabel>Price</StatLabel>
                    <StatNumber>{fp(selectedCoin.price)}</StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>24h</StatLabel>
                    <StatNumber color={selectedCoin.change24h >= 0 ? 'green.500' : 'red.500'}>
                      <StatArrow type={selectedCoin.change24h >= 0 ? 'increase' : 'decrease'} />
                      {Math.abs(selectedCoin.change24h).toFixed(2)}%
                    </StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Volume</StatLabel>
                    <StatNumber fontSize="sm">{fv(selectedCoin.volume24h)}</StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel>Range</StatLabel>
                    <StatNumber fontSize="xs">{fp(selectedCoin.low24h)} — {fp(selectedCoin.high24h)}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </Box>

              {/* Chart */}
              {coinDetails.length > 0 && (
                <Box bg={bg} borderRadius="xl" border="1px solid" borderColor={borderColor} p={4}>
                  <CoinPriceChart coinDetails={coinDetails} />
                </Box>
              )}

              {/* History */}
              {coinDetails.length > 0 && (
                <Box bg={bg} borderRadius="xl" border="1px solid" borderColor={borderColor} p={4}>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontSize="xs" fontWeight="600" color={muted} textTransform="uppercase" letterSpacing="wide">
                      Price History
                    </Text>
                    <HStack spacing={1}>
                      <Button size="xs" variant="ghost" isDisabled={historyPage === 0}
                        onClick={() => setHistoryPage(p => p - 1)}>Prev</Button>
                      <Button size="xs" variant="ghost"
                        isDisabled={(historyPage + 1) * 5 >= coinDetails.length}
                        onClick={() => setHistoryPage(p => p + 1)}>Next</Button>
                    </HStack>
                  </Flex>
                  <Accordion allowMultiple>
                    {coinDetails.slice(historyPage * 5, (historyPage + 1) * 5).map((item, idx) => (
                      <AccordionItem key={idx} border="none">
                        <AccordionButton px={0} py={1.5} _hover={{ bg: 'transparent' }}>
                          <Box flex="1">
                            <Flex justify="space-between">
                              <Text fontSize="xs">{new Date(item.timestamp).toLocaleDateString()}</Text>
                              <Text fontSize="xs" fontWeight="600">{fp(item.price)}</Text>
                            </Flex>
                          </Box>
                          <AccordionIcon boxSize={3} />
                        </AccordionButton>
                        <AccordionPanel px={0} py={1}>
                          <Flex gap={4}>
                            <Box>
                              <Text fontSize="10px" color={muted}>Vol</Text>
                              <Text fontSize="xs">{fv(item.vol_spot_24h)}</Text>
                            </Box>
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Box>
              )}
            </VStack>
          ) : (
            <Box bg={bg} borderRadius="xl" border="1px dashed" borderColor={borderColor}
              p={10} textAlign="center">
              <FiTrendingUp size={32} style={{ margin: '0 auto 8px', opacity: 0.2 }} />
              <Text fontWeight="600" color={muted}>Select a coin</Text>
              <Text fontSize="xs" color={muted} mt={1}>Click any row to view details</Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Cryptocurrencies;
