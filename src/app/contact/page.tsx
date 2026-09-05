'use client';

import React, { useState } from 'react';
import { useCreateInquiryMutation } from '@/redux/api/inquiryApi';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const RequestForm = () => {
     const [createInquiry, { isLoading }] = useCreateInquiryMutation();
     const [formData, setFormData] = useState({
          name: '',
          subject: '',
          email: '',
          message: '',
          phone: '',
     });

     const handleSubmit = async (e) => {
          e.preventDefault();
          try {
               await createInquiry(formData).unwrap();
               toast.success('Your message has been sent to our concierge team!');
               setFormData({ name: '', subject: '', email: '', message: '', phone: '' });
          } catch (error) {
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
                                   <input
                                        type="text"
                                        placeholder="Full Name *"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f]"
                                   />
                                   <input
                                        type="email"
                                        placeholder="Email Address *"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f]"
                                   />
                                   <input
                                        type="text"
                                        placeholder="Subject / Event Type"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f]"
                                   />
                                   <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f]"
                                   />
                                   <textarea
                                        placeholder="How can our concierge assist you? *"
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="p-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#c5a06f] col-span-1 md:col-span-2 resize-none"
                                   ></textarea>
                                   <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="col-span-1 md:col-span-2 bg-[#b99d75] hover:bg-[#a68c65] text-white py-3 font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                                   >
                                        <Send className="w-4 h-4" />
                                        {isLoading ? 'Sending Inquiry...' : 'Submit Inquiry'}
                                   </button>
                              </form>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default RequestForm;
