'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Signup = () => {
     const { register } = useAuth();
     const [passwordError, setPasswordError] = useState('');
     const [loading, setLoading] = useState(false);
     const router = useRouter();

     const handleSignUp = async (e) => {
          e.preventDefault();
          const form = e.target;
          const fullName = form.name.value.trim();
          const email = form.email.value.trim();
          const password = form.password.value;
          const phone = form.phone.value.trim();

          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || 'Guest';
          const lastName = nameParts.slice(1).join(' ') || 'User';

          if (password.length < 6) {
               return setPasswordError('Password must contain at least 6 characters');
          }
          setPasswordError('');

          setLoading(true);
          try {
               await register({
                    email,
                    password,
                    firstName,
                    lastName,
                    phone: phone || undefined,
               });
               toast.success('Account created successfully! Welcome to INNORA.');
               router.push('/');
          } catch (err) {
               const errorMsg = err?.data?.message || err?.message || 'Failed to create account. Please try again.';
               toast.error(errorMsg);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-[#151515]">
               <div className="w-full max-w-md bg-white dark:bg-[#202020] shadow-2xl p-8 border border-gray-200 dark:border-gray-800 transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-2 text-center uppercase tracking-widest text-gray-900 dark:text-white font-serif">
                         Sign Up to INNORA
                    </h2>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">
                         Join our exclusive member collective
                    </p>

                    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                         <div>
                              <label className="text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                   Full Name
                              </label>
                              <input
                                   placeholder="e.g. Sarah Jenkins"
                                   className="w-full p-3 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:border-[#b99d75]"
                                   type="text"
                                   name="name"
                                   required
                              />
                         </div>

                         <div>
                              <label className="text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                   Email Address
                              </label>
                              <input
                                   placeholder="e.g. sarah@example.com"
                                   className="w-full p-3 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:border-[#b99d75]"
                                   type="email"
                                   name="email"
                                   required
                              />
                         </div>

                         <div>
                              <label className="text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-1 block">
                                   Phone Number (Optional)
                              </label>
                              <input
                                   placeholder="+1 (555) 000-0000"
                                   className="w-full p-3 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:border-[#b99d75]"
                                   type="tel"
                                   name="phone"
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
                              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                         </div>

                         <div className="pt-2">
                              <button
                                   disabled={loading}
                                   className="w-full py-3 bg-black dark:bg-[#b99d75] text-white font-bold uppercase tracking-wider hover:bg-[#b99d75] dark:hover:bg-[#a68c65] transition duration-300 disabled:opacity-50 cursor-pointer"
                                   type="submit"
                              >
                                   {loading ? 'Creating Account...' : 'Sign Up'}
                              </button>
                         </div>

                         <p className="mt-4 text-center text-xs text-gray-600 dark:text-gray-400">
                              Already have an account?{' '}
                              <Link href="/signin" className="text-[#b99d75] font-bold hover:underline">
                                   Sign In
                              </Link>
                         </p>
                    </form>
               </div>
          </div>
     );
};

export default Signup;
