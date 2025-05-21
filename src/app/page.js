
import Banner from '@/components/Banner'
import HomePageRooms from '@/components/HomePageRooms'
import HotelMap from '@/components/HotelMap'
import HotelServices from '@/components/HotelServices'
import React from 'react'
import ScrollToTop from "react-scroll-to-top";

const page = () => {
  return (
    <div className=' '>


      <Banner />
      <HomePageRooms />
      <HotelMap />
      <HotelServices />
    </div>
  )
}

export default page
