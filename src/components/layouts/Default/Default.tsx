import { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import BouncyNav from 'components/layout/BouncyNav';
import Footer from 'components/layout/Footer';
import Head from 'next/head';

const Default: FC<{ children: ReactNode; pageName: string }> = ({ children, pageName }) => (
  <>
    <Head>
      <title>{`${pageName} | Blockatnet`}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <BouncyNav />
    <Box as="main" minH="100vh">
      {children}
    </Box>
    <Footer />
  </>
);

export default Default;
