'use client'
import { AuthContext } from '@/provider/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
    const { signInUser, googleLogin } = useContext(AuthContext)
    const router = useRouter()



    // email and password login manage
    const handleSignIn = e => {
        e.preventDefault()
        const form = e.target
        const email = form.email.value
        const password = form.password.value
        signInUser(email, password)
            .then(result => {
                router.push('/')
                toast.success('User Sign Successfully')
            })
            .catch((error) => {
                const errorMessage = error.code.replace("auth/", ""); 
                toast.error(errorMessage)
            })
    }

    // google login manage
    const handleGoogle = () => {
        googleLogin()
            .then(() => {
                router.push('/')
                toast.success('User Sign Successfully')
            })
            .catch(error => {
                const errorMessage = error.code.replace("auth/", "");
                toast.error(errorMessage)
            })
    }





    return (
        // sign in
        <div>
            <div className="flex flex-col items-center justify-center h-screen ">
                <div className="w-full max-w-md  shadow p-6 border border-gray-300 bg-[#c0a783]">
                    <h2 className="text-2xl  font-semibold  mb-4 text-center uppercase text-white">SignIn to INNORA</h2>
                    <form onSubmit={handleSignIn} className="flex flex-col gap-2">
                        <input
                            placeholder="Email address"
                            className="bg-transparent p-3 border-black border hover:border-white w-full"
                            type="email"
                            name='email'
                        />
                        <input
                            placeholder="Password"
                            className="bg-transparent p-3 border-black border hover:border-white w-full"
                            type="password"
                            name='password'
                        />
                        <div className='w-full'>
                            <button
                                className="bg-black border w-full py-2 border-white text-white uppercase hover:bg-white hover:text-black hover:border-black font-extrabold"
                                type="submit"
                            >
                                SignIn
                            </button>
                            <p className="mt-4 text-center w-full hover:text-white">
                                Dont have an account? <Link href={'/signup'} className='text-black   hover:text-white'>SignUp</Link>
                            </p>
                        </div>
                        <div className="divider text-white my-0">OR</div>

                        <button onClick={handleGoogle} className="btn rounded-none bg-white text-black border-[#e5e5e5]">
                            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                            Login with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;
