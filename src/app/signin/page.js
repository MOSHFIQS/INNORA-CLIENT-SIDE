'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
     const { login } = useAuth();
     const router = useRouter();
     const [loading, setLoading] = useState(false);

     const handleSignIn = async (e) => {
          e.preventDefault();
          const form = e.target;
          const email = form.email.value.trim();
          const password = form.password.value;

          setLoading(true);
          try {
               await login({ email, password });
               toast.success('Signed in successfully! Welcome back.');
               router.push('/');
          } catch (error) {
               const errorMsg = error?.data?.message || error?.message || 'Invalid email or password';
               toast.error(errorMsg);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-[#151515]">
               <div className="w-full max-w-md bg-white dark:bg-[#202020] shadow-2xl p-8 border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-2 text-center uppercase tracking-widest text-gray-900 dark:text-white font-serif">
                         Sign In to INNORA
                    </h2>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">
                         Access Your Luxury Experience & Reservations
                    </p>

                    <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                         <div>
                              <label className="text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                   Email Address
                              </label>
                              <input
                                   placeholder="e.g. customer@innora.com"
                                   className="w-full p-3 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:border-[#b99d75]"
                                   type="email"
                                   name="email"
                                   required
                              />
                         </div>

                         <div>
                              <label className="text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                   Password
                              </label>
                              <input
                                   placeholder="••••••••"
                                   className="w-full p-3 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:border-[#b99d75]"
                                   type="password"
                                   name="password"
                                   required
                              />
                         </div>

                         <div className="pt-2">
                              <button
                                   disabled={loading}
                                   className="w-full py-3 bg-black dark:bg-[#b99d75] text-white font-bold uppercase tracking-wider hover:bg-[#b99d75] dark:hover:bg-[#a68c65] transition duration-300 disabled:opacity-50 cursor-pointer"
                                   type="submit"
                              >
                                   {loading ? 'Authenticating...' : 'Sign In'}
                              </button>
                         </div>

                         <div className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
                              Don&apos;t have an account?{' '}
                              <Link href="/signup" className="text-[#b99d75] font-bold hover:underline">
                                   Sign Up
                              </Link>
                         </div>

                         <div className="mt-4 p-3 bg-gray-100 dark:bg-[#2a2a2a] text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded">
                              <p className="font-bold text-[#b99d75] mb-1">Demo Accounts:</p>
                              <p>👑 <b>SuperAdmin:</b> superadmin@innora.com / Admin@123456</p>
                              <p>🏨 <b>Staff:</b> staff@innora.com / Staff@123456</p>
                              <p>✨ <b>Customer:</b> customer@innora.com / Customer@123456</p>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default Page;
