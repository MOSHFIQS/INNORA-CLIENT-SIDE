// 'use client';

// import { useContext, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/provider/AuthProvider';

// // Create a secure Axios instance
// const axiosSecure = axios.create({
//     baseURL: 'http://localhost:5000',
//     withCredentials: true,
// });

// const useAxiosSecure = () => {
//     const { logOutUser } = useContext(AuthContext);
//     const router = useRouter();

//     useEffect(() => {
//         const interceptor = axiosSecure.interceptors.response.use(
//             res => res,
//             err => {
//                 const status = err?.response?.status;

//                 if (status === 401 || status === 403) {
//                     console.warn('Token invalid or expired. Logging out...');

//                     logOutUser()
//                         .then(() => {
//                             router.push('/signin');
//                         })
//                         .catch(error => {
//                             console.error('Logout Error:', error);
//                         });
//                 }

//                 return Promise.reject(err); // Important to allow caller to handle error too
//             }
//         );

//         return () => {
//             axiosSecure.interceptors.response.eject(interceptor);
//         };
//     }, [logOutUser, router,logOutUser]);

//     return axiosSecure;
// };

// export default useAxiosSecure;
