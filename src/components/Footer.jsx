import React from 'react';
import { LuPhoneCall } from "react-icons/lu";
import { MdOutlineMail } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className="dark:border-0 border-t">
            <footer className="bg-cover bg-no-repeat text-center md:text-start bg-fixed text-black bg-white dark:bg-[#b99d75]  hover:py-10 transition-all duration-700 ease-in-out">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-30 place-items-start justify-items-center gap-20 md:gap-8 h-full w-full p-10 rounded-lg">

                    {/* Company Info */}
                    <aside className="flex flex-col items-center md:items-start xl:col-span-7 gap-7">
                        <div className='flex items-center'>
                            <p className="dark:hover:text-white text-3xl font-extrabold playwrite">
                                INNORA LIMITED 
                            </p>
                        </div>
                        <p className='dark:hover:text-white text-sm text-center md:text-start'>
                            Luxurious, spacious, and elegantly designed rooms offering top-tier comfort.
                        </p>
                        <div className='flex gap-3'>
                            <button className='w-10 h-10 flex items-center justify-center hover:bg-white hover:border hover:text-black duration-300 bg-black text-white'><FaFacebookF /></button>
                            <button className='w-10 h-10 flex items-center justify-center hover:bg-white hover:border hover:text-black duration-300 bg-black text-white'><FaInstagram /></button>
                            <button className='w-10 h-10 flex items-center justify-center hover:bg-white hover:border hover:text-black duration-300 bg-black text-white'><FaTwitter /></button>
                            <button className='w-10 h-10 flex items-center justify-center hover:bg-white hover:border hover:text-black duration-300 bg-black text-white'><FaYoutube /></button>
                        </div>
                    </aside>

                    {/* Contact Info */}
                    <nav className="grid gap-5 xl:col-span-7 w-full">
                        <h6 className="text-2xl font-extrabold dark:hover:text-white">| Contact Us</h6>
                        <p className="text-sm dark:hover:text-white">
                            No: 58 A, East Madison Street, Baltimore, MD, USA 4508
                        </p>
                        <div className="flex items-center text-xs justify-center md:justify-start gap-3 dark:hover:text-white">
                            <LuPhoneCall size={20} /> +880 17 088 6762 45
                        </div>
                        <div className="flex items-center text-sm justify-center md:justify-start gap-3 dark:hover:text-white">
                            <MdOutlineMail size={20} /> innora@gmail.com
                        </div>
                    </nav>

                    {/* Information Links */}
                    <nav className="grid gap-5 xl:col-span-4 w-full">
                        <h6 className="dark:hover:text-white text-2xl font-extrabold">| Information</h6>
                        <a className="link link-hover  dark:hover:text-white">Home</a>
                        <a className="link link-hover  dark:hover:text-white">About us</a>
                        <a className="link link-hover  dark:hover:text-white">Rooms</a>
                        <a className="link link-hover  dark:hover:text-white">Latest News</a>
                        <a className="link link-hover  dark:hover:text-white">Gallery</a>
                    </nav>

                    {/* Support Links */}
                    <nav className="grid gap-5 xl:col-span-4 w-full">
                        <h6 className="dark:hover:text-white text-2xl font-extrabold">| Support</h6>
                        <a className="link link-hover dark:hover:text-white">Privacy policy</a>
                        <a className="link link-hover dark:hover:text-white">Terms</a>
                        <a className="link link-hover dark:hover:text-white">Help</a>
                        <a className="link link-hover dark:hover:text-white">Contact</a>
                    </nav>

                    {/* Newsletter */}
                    <nav className="grid gap-5  text-start w-full xl:col-span-8 lg:col-span-2 md:col-span-2">
                        <h6 className="text-2xl font-extrabold dark:hover:text-white">| Our Newsletter</h6>
                        <p className="text-sm dark:hover:text-white">
                            
                        Trusted hotel booking with secure, instant confirmation and real-time availability.
                        </p>
                        <div className='border border-black dark:hover:border-white duration-200 flex gap-1 items-center p-1'>
                            <label htmlFor="newsletter" className="sr-only">Email Address</label>
                            <input
                                type="email"
                                id="newsletter"
                                placeholder="Email Address"
                                className="w-full py-2 px-3 dark:hover:placeholder:text-white outline-none bg-transparent"
                            />
                            <button className="w-14 h-full flex items-center justify-center bg-black text-white hover:bg-white hover:border hover:text-black">
                                <BsSend />
                            </button>
                        </div>
                        <div className='flex gap-3 items-start'>
                            <input
                                type="checkbox"
                                id="consent"
                                className='checkbox checkbox-warning rounded-none checked:bg-black checked:text-white checked:border-white border-black dark:hover:border-white'
                            />
                            <label htmlFor="consent" className='text-sm dark:hover:text-white'>
                                Your email is safe with us <span><a href="#" className='underline'>privacy policy</a></span>
                            </label>
                        </div>
                    </nav>
                </div>
            </footer>

            {/* Bottom Footer */}
            <hr />
            <div className='flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-10 px-10 py-4 playwrite bg-white dark:bg-[#b99d75] text-black '>
                <h5 className='font-medium text-sm dark:hover:text-white text-center  uppercase '>
                    © 2025 INNORA. All Rights Reserved.
                </h5>
                <img
                    src="https://wdttaza.wpengine.com/wp-content/uploads/2024/11/payment-img.png"
                    className='object-contain '
                    alt="Payment Methods"
                />
                <div className='flex gap-2'>
                    <a href="#" className='dark:hover:text-white'>Privacy policy</a>
                    |
                    <a href="#" className='dark:hover:text-white'>Terms of use</a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
