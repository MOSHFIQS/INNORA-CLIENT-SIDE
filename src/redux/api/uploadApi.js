import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
          uploadImage: builder.mutation({
               query: (formData) => ({
                    url: '/uploads/image',
                    method: 'POST',
                    body: formData,
               }),
          }),
     }),
});

export const { useUploadImageMutation } = uploadApi;
