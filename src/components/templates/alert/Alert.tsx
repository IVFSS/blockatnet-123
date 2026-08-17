// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Input,
  Select,
  Button,
  Text,
  CloseButton,
  Grid,
  GridItem,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Radio,
  RadioGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAccount } from 'wagmi';
import { v4 as uuidv4 } from 'uuid';

const CRYPTOCURRENCIES = [
  'bitcoin', 'ethereum', 'litecoin', 'bitcoin-cash', 'cardano',
  'tether', 'binance-coin', 'ripple', 'dogecoin', 'solana',
  'tron', 'ethereum-classic', 'dash', 'iota', 'monero',
];

const Alert = () => {
  const { address: userAccount, isConnected } = useAccount();
  const [prices, setPrices] = useState({});
  const [thresholds, setThresholds] = useState({});
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [threshold, setThreshold] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [alertCount, setAlertCount] = useState(0);
  const isDark = useColorModeValue(false, true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/moralis/market-data/erc20s/top-movers?limit=50');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const formattedPrices = {};
        if (data.gainers) {
          data.gainers.forEach((token) => {
            formattedPrices[token.contract_address || token.symbol] = { usd: token.usd_price || 0 };
          });
        }
        if (data.losers) {
          data.losers.forEach((token) => {
            formattedPrices[token.contract_address || token.symbol] = { usd: token.usd_price || 0 };
          });
        }
        setPrices(formattedPrices);
        checkThresholds(formattedPrices, thresholds);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
        // Fallback to CCXT API
        try {
          const ccxtResponse = await fetch('/api/market?type=tickers&limit=50');
          if (ccxtResponse.ok) {
            const ccxtData = await ccxtResponse.json();
            const formattedPrices = {};
            const tickers = ccxtData.data || ccxtData.tickers || [];
            tickers.forEach((t) => {
              const cryptoKey = t.base ? t.base.toLowerCase() : '';
              if (cryptoKey) {
                formattedPrices[cryptoKey] = { usd: t.price || t.last || 0 };
              }
            });
            setPrices(formattedPrices);
            checkThresholds(formattedPrices, thresholds);
          }
        } catch (fallbackError) {
          console.error('Fallback price fetch also failed:', fallbackError);
        }
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [thresholds]);

  const checkThresholds = (currentPrices, currentThresholds) => {
    CRYPTOCURRENCIES.forEach((crypto) => {
      // Try multiple formats: 'bitcoin', 'BTC', etc
      const currentPrice = currentPrices[crypto]?.usd || currentPrices[crypto.toLowerCase()]?.usd;
      if (currentPrice === undefined || currentPrice === 0 || isNaN(currentPrice)) return;
      const target = currentThresholds[crypto];
      if (target === undefined) return;

      const activeAlert = activeAlerts.find(
        (a) => a.crypto === crypto && a.threshold === target && a.direction === direction
      );

      if (currentPrice >= target && target !== undefined && direction === 'above' && activeAlert) {
        removeAlert(activeAlerts.find((a) => a.crypto === crypto && a.threshold === target));
        showThresholdReachedToast(crypto, currentPrice, target, 'above');
      } else if (currentPrice <= target && target !== undefined && direction === 'below' && activeAlert) {
        removeAlert(activeAlerts.find((a) => a.crypto === crypto && a.threshold === target));
        showThresholdReachedToast(crypto, currentPrice, target, 'below');
      }
    });
  };

  const showThresholdReachedToast = (crypto, currentPrice, threshold, dir) => {
    toast.success(`${crypto.toUpperCase()} price ${currentPrice} ${dir === 'above' ? 'reached above' : 'dropped below'} $${threshold}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: isDark ? 'dark' : 'light',
    });
  };

  const createAlert = () => {
    if (!selectedCrypto || !threshold || !isConnected || !userAccount) return;

    if (activeAlerts.length >= 3) {
      toast.error('You have already created 3 alerts. Please remove some alerts to create new ones.', {
        position: 'top-right', autoClose: 5000, hideProgressBar: true,
        closeOnClick: true, pauseOnHover: true, draggable: true,
        theme: isDark ? 'dark' : 'light',
      });
      return;
    }

    const newAlert = {
      crypto: selectedCrypto,
      threshold: parseFloat(threshold),
      direction,
      address: userAccount,
      id: uuidv4(),
      createdAt: Date.now(),
    };

    const updatedAlerts = [...activeAlerts, newAlert];
    setActiveAlerts(updatedAlerts);
    setAlertCount(updatedAlerts.length);
    localStorage.setItem(`alerts_${userAccount}`, JSON.stringify(updatedAlerts));

    toast.success(`Alert created for ${selectedCrypto} at $${threshold} ${direction}`, {
      position: 'top-right', autoClose: 5000, hideProgressBar: true,
      closeOnClick: true, pauseOnHover: true, draggable: true,
      theme: isDark ? 'dark' : 'light',
    });
  };

  const handleThresholdChange = () => {
    createAlert();
  };

  const removeAlert = (alert) => {
    const updatedAlerts = activeAlerts.filter((a) => a.id !== alert.id);
    setActiveAlerts(updatedAlerts);
    localStorage.setItem(`alerts_${userAccount}`, JSON.stringify(updatedAlerts));
  };

  // Load alerts from localStorage on userAccount change
  useEffect(() => {
    if (userAccount) {
      const stored = localStorage.getItem(`alerts_${userAccount}`);
      if (stored) {
        setActiveAlerts(JSON.parse(stored));
      } else {
        setActiveAlerts([]);
      }
    }
  }, [userAccount]);

  const currentPrices = Object.fromEntries(
    Object.entries(prices).map(([key, val]) => [key, val.usd])
  );

  return (
    <Box p={4} bg={useColorModeValue('ctrlBg', 'ctrlBgDark')}>
      <Heading as="h1" size="xl" mb={4} color="ctrlPrimaryForeground">
        Crypto Alert System
      </Heading>

      {!isConnected && (
        <Text mb={4} color="orange.400">
          Connect your wallet to create price alerts
        </Text>
      )}

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <GridItem>
          <Box mb={2}>
            <Text fontWeight="bold" mb={1}>Select Cryptocurrency</Text>
            <Select
              placeholder="Select a cryptocurrency"
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
            >
              {Object.entries(currentPrices).map(([crypto, price]) => (
                <option key={crypto} value={crypto}>
                  {crypto} - ${price}
                </option>
              ))}
            </Select>
          </Box>
        </GridItem>

        <GridItem>
          <Box mb={2}>
            <Text fontWeight="bold" mb={1}>Set Threshold</Text>
            <Input
              type="number"
              placeholder="Enter threshold price"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </Box>
        </GridItem>

        <GridItem>
          <Box mb={2}>
            <Text fontWeight="bold" mb={1}>Price Direction</Text>
            <RadioGroup value={direction} onChange={setDirection}>
              <Radio value="above">Above</Radio>
              <Radio value="below">Below</Radio>
            </RadioGroup>
          </Box>
        </GridItem>

        <GridItem>
          <Box mb={2}>
            <Button
              colorScheme="blue"
              onClick={handleThresholdChange}
              isDisabled={!selectedCrypto || !threshold || !isConnected}
              width="100%"
            >
              Create Alert
            </Button>
          </Box>
        </GridItem>
      </Grid>

      <Heading as="h2" size="lg" mt={6} mb={4}>
        Active Alerts
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Crypto</Th>
            <Th>Threshold</Th>
            <Th>Direction</Th>
            <Th>Status</Th>
            <Th>Remove</Th>
          </Tr>
        </Thead>
        <Tbody>
          {activeAlerts.map((alert) => (
            <Tr key={alert.id}>
              <Td>{alert.crypto}</Td>
              <Td>${alert.threshold}</Td>
              <Td>{alert.direction === 'above' ? 'Above' : 'Below'}</Td>
              <Td>Active</Td>
              <Td>
                <CloseButton onClick={() => removeAlert(alert)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ToastContainer />
    </Box>
  );
};

export default Alert;
