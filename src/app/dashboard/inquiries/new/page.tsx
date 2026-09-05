'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/shared/PageHeader';
import { useCreateInquiryMutation } from '@/redux/api/inquiryApi';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Send, Loader2, MessageSquare, Phone, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewInquiryPage() {
     const router = useRouter();
     const { user } = useAuth();

     const [createInquiry, { isLoading }] = useCreateInquiryMutation();

     const [formData, setFormData] = useState({
          name: user?.fullName || '',
          email: user?.email || '',
          phone: user?.phone || '',
          subject: '',
          message: '',
     });

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
               toast.error('Please complete all required fields');
               return;
          }

          try {
               await createInquiry(formData).unwrap();
               toast.success('Concierge inquiry submitted successfully');
               router.push('/dashboard/inquiries');
          } catch (err) {
               toast.error(err?.data?.message || 'Failed to submit inquiry');
          }
     };

     return (
          <div className="max-w-3xl mx-auto space-y-6">
               <PageHeader
                    title="Submit Concierge Inquiry"
                    description="Send a message to our front desk, arrange special stay accommodations, or request private dining services."
                    breadcrumbs={[
                         { label: 'Dashboard', href: '/dashboard' },
                         { label: 'Inquiries', href: '/dashboard/inquiries' },
                         { label: 'New Inquiry' },
                    ]}
                    actions={
                         <Link
                              href="/dashboard/inquiries"
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Back</span>
                         </Link>
                    }
               />

               <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-6 shadow-xs">
                         <h2 className="text-base font-serif font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-[#b99d75]" />
                              <span>Inquiry Communication Details</span>
                         </h2>

                         {/* Contact Info */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Guest / Sender Name *
                                   </label>
                                   <div className="relative">
                                        <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                             type="text"
                                             name="name"
                                             required
                                             value={formData.name}
                                             onChange={handleChange}
                                             placeholder="e.g. Lord Alexander Wright"
                                             className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                        />
                                   </div>
                              </div>

                              <div className="space-y-1.5">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Email Address *
                                   </label>
                                   <div className="relative">
                                        <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                             type="email"
                                             name="email"
                                             required
                                             value={formData.email}
                                             onChange={handleChange}
                                             placeholder="e.g. guest@innorahotels.com"
                                             className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                        />
                                   </div>
                              </div>

                              <div className="space-y-1.5 md:col-span-2">
                                   <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                        Contact Phone (Optional)
                                   </label>
                                   <div className="relative">
                                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                             type="tel"
                                             name="phone"
                                             value={formData.phone}
                                             onChange={handleChange}
                                             placeholder="e.g. +1 (555) 234-5678"
                                             className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                                        />
                                   </div>
                              </div>
                         </div>

                         {/* Subject */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Subject / Topic *
                              </label>
                              <input
                                   type="text"
                                   name="subject"
                                   required
                                   value={formData.subject}
                                   onChange={handleChange}
                                   placeholder="e.g. Private Airport Chauffeur & Champagne on Arrival"
                                   className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>

                         {/* Message */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                   Message & Specific Requirements *
                              </label>
                              <textarea
                                   name="message"
                                   rows={6}
                                   required
                                   value={formData.message}
                                   onChange={handleChange}
                                   placeholder="Detail your request, dietary restrictions, arrival timelines, or questions for our concierge team..."
                                   className="w-full px-3.5 py-2.5 text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#202020] text-gray-900 dark:text-white rounded-none focus:border-[#b99d75] focus:outline-none"
                              />
                         </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3">
                         <Link
                              href="/dashboard/inquiries"
                              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                         >
                              Cancel
                         </Link>
                         <button
                              type="submit"
                              disabled={isLoading}
                              className="flex items-center gap-2 px-6 py-2.5 bg-[#b99d75] hover:bg-[#a68c65] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-sm"
                         >
                              {isLoading ? (
                                   <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                   <Send className="w-4 h-4" />
                              )}
                              <span>Send Inquiry</span>
                         </button>
                    </div>
               </form>
          </div>
     );
}
