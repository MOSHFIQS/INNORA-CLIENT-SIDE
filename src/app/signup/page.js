'use client'
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';

const Signup = () => {
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

        signUpUser(email, password)
            .then(result => {
                setPasswordError('');
                updateProfileInfo(name, imageUrl)
                router.push('/')
                toast.success('User Create And Auto SignIn Successfully')
            })
            .catch(err => {
                toast.error("Something Went Wrong Please Try Again")
            })
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen ">
                <div className="w-full max-w-md p-6 border border-gray-300 dark:bg-[#c0a783] md:hover:scale-150 transition-all duration-700 ease-in-out">
                    <h2 className="text-2xl font-bold mb-4 text-center uppercase dark:text-white">SignUp To INNORA</h2>
                    <form onSubmit={handleSignUp} className="flex flex-col gap-2">
                        <input placeholder="Name" className="p-3 border dark:hover:border-white w-full dark:hover:placeholder:text-white" type="text" name='name' />
                        <input placeholder="Email address" className="p-3 border dark:hover:border-white w-full dark:hover:placeholder:text-white" type="email" name='email' />
                        <input placeholder="Password" className="p-3 border dark:hover:border-white w-full dark:hover:placeholder:text-white" type="password" name='password' />
                        <h1 className="text-red-600 font-bold">{passwordError}</h1>
                        <input placeholder="Add Image" className="p-3 border dark:hover:border-white w-full dark:hover:placeholder:text-white" type="text" name='image' />
                        <div className='w-full'>
                            <button className="bg-black border w-full py-2 border-white text-white uppercase dark:hover:bg-white dark:hover:text-black dark:hover:border-black font-extrabold" type="submit">
                                SignUp
                            </button>
                            <p className="mt-4 text-center w-full dark:hover:text-white">
                                Already have an account? <Link href={'/signin'} className='font-bold'>SignIn</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
