'use client'
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';

const signup = () => {
    const { signUpUser, updateProfileInfo } = useContext(AuthContext)
    const [passwordError, setPasswordError] = useState('')
    const router = useRouter()


    const handleSignUp = e => {
        e.preventDefault()
        const form = e.target
        const name = form.name.value
        const email = form.email.value
        const password = form.password.value
        const imageUrl = form.image.value

        if (password.length < 8) {
            return setPasswordError('Your Password must contain at least 8 characters');
        }

        if (!/^(?=.*[A-Z])/.test(password)) {
            return setPasswordError('Your Password must contain at least one uppercase letter');
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return setPasswordError('Your Password must contain at least one lowercase letter');
        }

        signUpUser(email,password)
        .then(result => {
            console.log(result.user)
            setPasswordError('');
            updateProfileInfo(name,imageUrl)
            router.push('/')
            toast.success('User Create And Auto SignIn Successfully')
        })
        .catch(err => {
            toast.error("Something Went Wrong Please Try Again")
        })
    }
    return (
        // sign up
        <div >
            <div className="flex flex-col items-center justify-center h-screen  ">
                <div className="w-full max-w-md rounded-lg shadow p-6 border border-gray-300 bg-[#c0a783]">
                    <h2 className="text-3xl font-bold mb-4 text-center uppercase text-white">SignUp To INNORA</h2>
                    <form onSubmit={handleSignUp} className="flex flex-col gap-2">
                        <input
                            placeholder="Name"
                            className="p-3 border hover:border-white w-full "
                            type="text"
                            name='name'
                        />
                        <input
                            placeholder="Email address"
                            className="p-3 border hover:border-white w-full "
                            type="email"
                            name='email'
                        />
                        <input
                            placeholder="Password"
                            className="p-3 border hover:border-white w-full "
                            type="password"
                            name='password'
                        />
                        <h1 className="text-red-600 font-bold">{passwordError}</h1>
                        <input
                            placeholder="Add Image"
                            className="p-3 border hover:border-white w-full "
                            type="text"
                            name='image'
                        />
                        <div className='w-full'>
                            <button
                                className="bg-gradient-to-r w-full from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                                type="submit"
                            >
                                SignUp
                            </button>
                            <p className="mt-4 text-center w-full">
                                Already have an account? <Link href={'/signin'} className='text-blue-600 font-bold '>SignIn</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default signup;