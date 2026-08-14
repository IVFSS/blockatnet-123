// @ts-nocheck
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { Box, Heading, Button, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';

const TIME_RANGES = {
  '7D': 7,
  '30D': 30,
  '90D': 90,
};

const CoinPriceChart = ({ coinDetails }) => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('30D');

  const lineColor = useColorModeValue('#3182CE', '#63B3ED');
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');

  useEffect(() => {
    if (!coinDetails || coinDetails.length === 0) return;

    const days = TIME_RANGES[timeRange];
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = coinDetails.filter((item) => item.timestamp >= cutoff);

    const formatted = filtered.map((item) => ({
      date: moment(item.timestamp).format('MMM DD'),
      price: parseFloat(item.price.toFixed(2)),
      volume: parseFloat((item.vol_spot_24h / 1e6).toFixed(2)),
    }));

    setChartData(formatted);
  }, [coinDetails, timeRange]);

  if (!coinDetails || coinDetails.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">Select a coin to view chart</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="sm">Price Chart</Heading>
        <HStack spacing={1}>
          {Object.keys(TIME_RANGES).map((range) => (
            <Button
              key={range}
              size="xs"
              variant={timeRange === range ? 'solid' : 'ghost'}
              colorScheme="blue"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </HStack>
      </Flex>

      <Box h="250px">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 1%', 'dataMax + 1%']}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(value) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 5, fill: lineColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Box h="100%" display="flex" alignItems="center" justifyContent="center">
            <Text color="gray.500">No data for this time range</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CoinPriceChart;
