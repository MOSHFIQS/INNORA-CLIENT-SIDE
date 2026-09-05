'use client';

import React, { useState, useEffect } from 'react';
import { useCreateInquiryMutation } from '@/redux/api/inquiryApi';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, Lock, Loader2 } from 'lucide-react';

const RequestForm = () => {
     const { user } = useAuth();
     const [createInquiry, { isLoading }] = useCreateInquiryMutation();
     const [formData, setFormData] = useState({
          name: '',
          subject: '',
          email: '',
          message: '',
          phone: '',
     });

     const isUserLoggedIn = Boolean(user?.email);

     useEffect(() => {
          if (user) {
               const fullName =
                    user.fullName ||
                    `${user.firstName || ''} ${user.lastName || ''}`.trim();
               setFormData((prev) => ({
                    ...prev,
                    name: prev.name || fullName,
                    email: user.email || prev.email,
                    phone: prev.phone || user.phone || '',
               }));
          }
     }, [user]);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          if (name === 'email' && isUserLoggedIn) return;
          setFormData((prev) => ({ ...prev, [name]: value }));
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          const finalEmail = (isUserLoggedIn ? user?.email : formData.email)?.toLowerCase().trim();

          if (!formData.name.trim() || !finalEmail || !formData.message.trim()) {
               toast.error('Please complete all required fields');
               return;
          }

          try {
               await createInquiry({
                    ...formData,
                    email: finalEmail,
               }).unwrap();
               toast.success('Your message has been sent to our concierge team!');
               setFormData({
                    name: isUserLoggedIn ? (user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()) : '',
                    subject: '',
                    email: isUserLoggedIn ? (user?.email || '') : '',
                    message: '',
                    phone: isUserLoggedIn ? (user?.phone || '') : '',
               });
          } catch (error: any) {
               toast.error(error?.data?.message || 'Failed to send message. Please try again.');
          }
     };

     return (
          <div className="min-h-[85vh] dark:bg-[#1c1c1c] bg-gray-50 dark:text-white flex items-center justify-center px-4 py-16">
               <div className="w-full max-w-6xl space-y-10">
                    <div className="text-center space-y-2">
                         <p className="text-xs text-[#c5a06f] uppercase font-bold tracking-widest">Connect with our Concierge</p>
                         <h2 className="text-3xl md:text-5xl font-serif font-extrabold uppercase">Submit Your Inquiry</h2>
                         <p className="text-xs text-gray-500 max-w-md mx-auto">
                              For private dining, wedding banquets, suite reservations, or special inquiries, our team is at your service 24/7.
                         </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         {/* Contact Info Card */}
                         <div className="bg-[#181818] text-white p-8 border border-gray-800 space-y-6">
                              <h3 className="text-xl font-bold font-serif uppercase tracking-wider text-[#b99d75]">
                                   Hotel Information
                              </h3>
                              <div className="space-y-4 text-xs text-gray-300">
                                   <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-[#b99d75] shrink-0" />
                                        <p>777 Ocean View Boulevard, Coastal Haven, CA</p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-[#b99d75] shrink-0" />
                                        <p>+1 (800) 555-4666</p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-[#b99d75] shrink-0" />
                                        <p>concierge@innora.com</p>
                                   </div>
                              </div>
                              <div className="border-t border-gray-800 pt-6 text-[11px] text-gray-400">
                                   <p className="font-bold text-white mb-1">Check-in: 14:00 | Check-out: 11:00</p>
                                   <p>Valet parking & chauffeur transfers available upon request.</p>
                              </div>
                         </div>

                         {/* Form */}
                         <div className="lg:col-span-2 bg-white dark:bg-[#202020] p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
                              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                   <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                             Full Name *
                                        </label>
                                        <input
                                             type="text"
                                             name="name"
                                             placeholder="Your full name"
                                             required
                                             value={formData.name}
                                             onChange={handleChange}
                                             className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f]"
                                        />
                                   </div>

                                   <div>
                                        <div className="flex items-center justify-between mb-1">
                                             <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                                  Email Address *
                                             </label>
                                             {isUserLoggedIn && (
                                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#b99d75] uppercase">
                                                       <Lock className="w-2.5 h-2.5" />
                                                       Account Email (Fixed)
                                                  </span>
                                             )}
                                        </div>
                                        <input
                                             type="email"
                                             name="email"
                                             placeholder="Your email address"
                                             required
                                             readOnly={isUserLoggedIn}
                                             value={formData.email}
                                             onChange={handleChange}
                                             className={`w-full p-3 border focus:outline-none transition ${
                                                  isUserLoggedIn
                                                       ? 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#282828] text-gray-500 dark:text-gray-400 cursor-not-allowed select-none'
                                                       : 'border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:border-[#c5a06f]'
                                             }`}
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                             Subject / Event Type
                                        </label>
                                        <input
                                             type="text"
                                             name="subject"
                                             placeholder="e.g. Banquet, Private Dining, Suite Inquiry"
                                             value={formData.subject}
                                             onChange={handleChange}
                                             className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f]"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                             Phone Number
                                        </label>
                                        <input
                                             type="tel"
                                             name="phone"
                                             placeholder="e.g. +1 (555) 000-0000"
                                             value={formData.phone}
                                             onChange={handleChange}
                                             className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f]"
                                        />
                                   </div>

                                   <div className="col-span-1 md:col-span-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                             How can our concierge assist you? *
                                        </label>
                                        <textarea
                                             name="message"
                                             placeholder="Detail your request, dietary restrictions, arrival timelines, or questions for our concierge team..."
                                             rows={4}
                                             required
                                             value={formData.message}
                                             onChange={handleChange}
                                             className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f] resize-none"
                                        ></textarea>
                                   </div>

                                   <div className="col-span-1 md:col-span-2">
                                        <Button
                                             type="submit"
                                             disabled={isLoading}
                                             className="w-full bg-[#b99d75] hover:bg-[#a68c65] text-white py-3 font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                             {isLoading ? (
                                                  <Loader2 className="w-4 h-4 animate-spin" />
                                             ) : (
                                                  <Send className="w-4 h-4" />
                                             )}
                                             <span>{isLoading ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                                        </Button>
                                   </div>
                              </form>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default RequestForm;
