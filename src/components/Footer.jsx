import React from 'react';
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { BsSend } from "react-icons/bs";
const Footer = () => {
    return (
        <div className=''>
            <footer className="bg-cover bg-no-repeat text-center md:text-start bg-fixed  text-black  bg-[#b99d75] cormorant py-10">
                <div className=" grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 place-items-start justify-items-center gap-8 h-full w-full p-10 rounded-lg">
                    <aside className="flex flex-col items-center md:items-start  gap-7">
                        <div className='flex items-center '>
                            {/* <img src='/logo.png' draggable={false} className="w-16 hover:scale-105 duration-300 " alt="" /> */}
                            <p className=" hover:text-white text-3xl  font-extrabold font-mono">
                                [ INNORA LIMITED ]
                            </p>

                        </div>
                        <p className='hover:text-white text-[14px]'>Luxurious, spacious, and elegantly designed rooms offering top-tier comfort.</p>
                        <div className='flex gap-3'>
                            <button className='w-10 h-10 hover:bg-white hover:text-black duration-300 bg-black text-white'>FB</button>
                            <button className='w-10 h-10 hover:bg-white hover:text-black duration-300 bg-black text-white'>IN</button>
                            <button className='w-10 h-10 hover:bg-white hover:text-black duration-300 bg-black text-white'>TW</button>
                            <button className='w-10 h-10 hover:bg-white hover:text-black duration-300 bg-black text-white'>YT</button>
                        </div>
                    </aside>
                    <nav className="grid gap-5 w-full ">
                        <h6 className=" text-2xl font-extrabold hover:text-white">| Contact Us</h6>
                        <a className="link link-hover hover:text-white text-[14px]">No: 58 A, East Madison Street, Baltimore, MD, USA 4508</a>
                        <h1 className="flex items-center justify-center md:justify-start gap-5 hover:text-white "><span><LuPhoneCall size={20} /></span> +00 123 456 789</h1>
                        <h1 className="flex items-center justify-center md:justify-start gap-5 hover:text-white "><span><MdOutlineMail size={20} /></span> innora@gmail.com</h1>
                    </nav>
                    <nav className="grid gap-5 ">
                        <h6 className="hover:text-white text-2xl font-extrabold">| Information</h6>
                        <a className="link link-hover hover:text-white">Home</a>
                        <a className="link link-hover hover:text-white">About us</a>
                        <a className="link link-hover hover:text-white">Rooms</a>
                        <a className="link link-hover hover:text-white">Latest News</a>
                        <a className="link link-hover hover:text-white">Gallery</a>
                    </nav>
                    <nav className="grid gap-5 ">
                        <h6 className="hover:text-white text-2xl font-extrabold">| Support</h6>
                        <a className="link link-hover hover:text-white">Privacy policy</a>
                        <a className="link link-hover hover:text-white">Terms</a>
                        <a className="link link-hover hover:text-white">Help</a>
                        <a className="link link-hover hover:text-white">Contact</a>
                    </nav>
                    <nav className="grid gap-5 text-start">
                        <h6 className=" text-2xl font-extrabold hover:text-white">| Our Newsletter</h6>
                        <p className=" hover:text-white text-[14px]">Parturient vel per id venenatis venenatis litora. Conubia mauris leo metus eros tincidunt. </p>
                        <div className='border hover:border-white hover:duration-200  flex gap-1 items-center  p-1'>
                            <input type="text" placeholder='Email Address' className='hover:placeholder:text-white w-full  py-2 px-3' />
                            <button className='w-14 h-full flex items-center justify-center bg-black text-white hover:bg-white hover:text-black'><BsSend /></button>
                        </div>
                        <div className='flex gap-3'>
                            <input type="checkbox" className='checkbox checkbox-warning rounded-none checked:bg-black checked:text-white checked:border-white border-black hover:border-white ' />
                            <p className='hover:text-white'>Your email is safe with us <span><a href="#" className='underline'>privacy policy</a></span> </p>
                        </div>
                    </nav>
                </div>
            </footer>
            <hr />
            <div className='flex lg:flex-row flex-col  items-center  justify-between gap-2 lg:gap-10 px-10 py-4 bg-[#b99d75] text-black cormorant'>
                <h5 className='font-medium text-sm hover:text-white text-center font-sans uppercase'>© 2025  INNORA. All Rights Reserved.</h5>
                <img src="https://wdttaza.wpengine.com/wp-content/uploads/2024/11/payment-img.png" className='object-contain' alt="" />
                <div className='flex gap-2 '>
                    <h5 className='hover:text-white'>Privacy policy</h5>
                    |
                    <h5 className='hover:text-white'>Terms of use</h5>
                </div>
            </div>
        </div>
    );
};

export default Footer;