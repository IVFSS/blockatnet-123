import { Box, HStack, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { EvmNft } from '@moralisweb3/common-evm-utils';
import { Eth } from '@web3uikit/icons';
import { FC } from 'react';
import { resolveIPFS } from 'utils/resolveIPFS';

export interface NFTCardParams {
  key: number;
  nft: EvmNft;
}

const NFTCard: FC<NFTCardParams> = ({ nft: { amount, contractType, name, symbol, metadata } }) => {
  const bgColor = useColorModeValue('none', 'ctrlCard');
  const borderColor = useColorModeValue('ctrlBorder', 'ctrlBorder');
  const descBgColor = useColorModeValue('ctrlCard', 'ctrlCard');

  return (
    <Box maxWidth="315px" bgColor={bgColor} padding={3} borderRadius="lg" borderWidth="1px" borderColor={borderColor} transition="all 0.2s ease-in-out" _hover={{ borderColor: 'ctrlPrimary', boxShadow: 'md' }}>
      <Box maxHeight="260px" overflow={'hidden'} borderRadius="lg">
        <Image
          src={resolveIPFS((metadata as { image?: string })?.image)}
          alt={'nft'}
          minH="260px"
          minW="260px"
          boxSize="100%"
          objectFit="fill"
        />
      </Box>
      <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1} marginTop={2} color="ctrlPrimaryForeground">
        {name}
      </Box>
      <HStack alignItems={'center'}>
        <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="smaller" color="ctrlMuted">
          {contractType}
        </Box>

        <Eth fontSize="20px" />
      </HStack>
      <SimpleGrid columns={2} spacing={4} bgColor={descBgColor} padding={2.5} borderRadius="lg" marginTop={2}>
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm" color="ctrlMuted">
            Symbol
          </Box>
          <Box as="h4" noOfLines={1} fontSize="sm" color="ctrlPrimaryForeground">
            {symbol}
          </Box>
        </Box>
        <Box>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="sm" color="ctrlMuted">
            Amount
          </Box>
          <Box as="h4" noOfLines={1} fontSize="sm" color="ctrlPrimaryForeground">
            {amount}
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default NFTCard;
