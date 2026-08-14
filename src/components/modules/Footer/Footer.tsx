import { Box, Link, Text, HStack } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const Footer = () => {
  return (
    <Box bg="ctrlCard" borderTop="1px solid" borderColor="ctrlBorder" py={12}>
      <Box maxW="container.xl" mx="auto" px={6}>
        <HStack justify="space-between" align="center">
          <Text color="ctrlMuted" fontSize="sm">
            Made by Fintech student
          </Text>
          <HStack gap={4}>
            <Link href="https://twitter.com" isExternal color="ctrlMuted" _hover={{ color: 'ctrlPrimary' }}>
              Twitter
            </Link>
            <Link href="https://discord.com" isExternal color="ctrlMuted" _hover={{ color: 'ctrlPrimary' }}>
              Discord
            </Link>
            <Link href="https://github.com" isExternal color="ctrlMuted" _hover={{ color: 'ctrlPrimary' }}>
              GitHub
            </Link>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

export default Footer;
