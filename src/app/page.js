import Banner from '@/components/Banner'
import HomePageRooms from '@/components/HomePageRooms'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center '>
      <Banner />
      <HomePageRooms />
    </div>
  )
}

export default page
