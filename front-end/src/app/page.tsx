import Header from '@/components/Header'

import React from 'react'

import { Hero } from '@/components/Hero';
import { ProductShowcase } from '@/components/ProductShowcase';




const page = () => {
  return (
    <div className='font-sora'>
      <Header />
      <Hero/>
      <ProductShowcase/>

    </div>
  )
}

export default page