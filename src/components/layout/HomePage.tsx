'use client'

import React from 'react'
import { Box } from '@chakra-ui/react'
import BouncyNav from 'components/layout/BouncyNav'
import Hero from 'components/layout/Hero'
import AssetCarousel from 'components/layout/AssetCarousel'
import FeatureGrid from 'components/layout/FeatureGrid'
import MarketTable from 'components/layout/MarketTable'
import CTASection from 'components/layout/CTASection'
import Footer from 'components/layout/Footer'

export const HomePage = () => {
  return (
    <Box minH="100vh">
      <BouncyNav />
      <Hero />
      <AssetCarousel />
      <FeatureGrid />
      <MarketTable />
      <CTASection />
      <Footer />
    </Box>
  )
}

export default HomePage
