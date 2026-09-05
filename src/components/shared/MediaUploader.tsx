'use client';

import React, { useState } from 'react';
import { useUploadImageMutation } from '@/redux/api/uploadApi';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export interface MediaUploaderProps {
     value?: string | string[];
     onChange?: (value: any) => void;
     multiple?: boolean;
     maxFiles?: number;
     label?: string;
     hint?: string;
}

export default function MediaUploader({
     value = [],
     onChange,
     multiple = true,
     maxFiles = 5,
     label = 'Suite Photographs',
     hint = 'Upload high resolution images (PNG, JPG, WEBP up to 10MB)',
}: MediaUploaderProps) {
     const [uploadImage, { isLoading }] = useUploadImageMutation();
     const [isDragging, setIsDragging] = useState(false);

     const images = Array.isArray(value) ? value : value ? [value] : [];

     const handleFile = async (file: File) => {
          if (!file) return;
          if (!file.type.startsWith('image/')) {
               toast.error('Please select an image file');
               return;
          }
          if (file.size > 10 * 1024 * 1024) {
               toast.error('Image must be under 10MB');
               return;
          }

          const formData = new FormData();
          formData.append('file', file);

          try {
               const res: any = await uploadImage(formData).unwrap();
               const url = res?.url;
               if (!url) throw new Error('Upload failed');

               if (multiple) {
                    const newImages = [...images, url].slice(0, maxFiles);
                    onChange?.(newImages);
               } else {
                    onChange?.(url);
               }
               toast.success('Image uploaded');
          } catch (err: any) {
               toast.error(err?.data?.message || 'Failed to upload image');
          }
     };

     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(e.target.files || []);
          if (!multiple && files[0]) {
               handleFile(files[0]);
          } else {
               files.forEach((f) => handleFile(f));
          }
          e.target.value = '';
     };

     const removeImage = (indexToRemove) => {
          if (multiple) {
               const updated = images.filter((_, idx) => idx !== indexToRemove);
               onChange?.(updated);
          } else {
               onChange?.('');
          }
     };

     return (
          <div className="space-y-2">
               {label && (
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                         {label}
                    </label>
               )}

               {/* Dropzone Area */}
               <div
                    onDragOver={(e) => {
                         e.preventDefault();
                         setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                         e.preventDefault();
                         setIsDragging(false);
                         const files = Array.from(e.dataTransfer.files || []);
                         files.forEach((f) => handleFile(f));
                    }}
                    className={`relative border-2 border-dashed p-5 text-center transition-colors cursor-pointer ${
                         isDragging
                              ? 'border-[#b99d75] bg-[#b99d75]/5'
                              : 'border-gray-300 dark:border-gray-700 hover:border-[#b99d75]/60 bg-gray-50/50 dark:bg-[#1a1a1a]'
                    }`}
               >
                    <input
                         type="file"
                         accept="image/*"
                         multiple={multiple}
                         onChange={handleFileChange}
                         disabled={isLoading}
                         className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                    />

                    <div className="flex flex-col items-center justify-center gap-2">
                         {isLoading ? (
                              <Loader2 className="w-7 h-7 text-[#b99d75] animate-spin" />
                         ) : (
                              <UploadCloud className="w-7 h-7 text-[#b99d75]" />
                         )}
                         <div>
                              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                   {isLoading ? 'Uploading to cloud...' : 'Click or drag photos here'}
                              </p>
                              {hint && <p className="text-[10px] text-gray-500 mt-0.5">{hint}</p>}
                         </div>
                    </div>
               </div>

               {/* Previews */}
               {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                         {images.map((url, idx) => (
                              <div
                                   key={`${url}-${idx}`}
                                   className="group relative aspect-square border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 overflow-hidden"
                              >
                                   <img
                                        src={url}
                                        alt={`Upload ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                   />
                                   <button
                                        type="button"
                                        onClick={(e) => {
                                             e.stopPropagation();
                                             removeImage(idx);
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white transition rounded-none opacity-90 group-hover:opacity-100"
                                        title="Remove photo"
                                   >
                                        <X className="w-3 h-3" />
                                   </button>
                              </div>
                         ))}
                    </div>
               )}
          </div>
     );
}
