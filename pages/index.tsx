import { HomePage as CoinbaseHome } from 'components/layout/HomePage';
import type { NextPage } from 'next';
import Head from 'next/head';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | Blockatnet</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CoinbaseHome />
    </>
  );
};

export default HomePage;
