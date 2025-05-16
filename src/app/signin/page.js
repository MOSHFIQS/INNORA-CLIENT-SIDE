import Link from 'next/link';
import React from 'react';

const Page = () => {
    




    const handleSignIn = e => {
        e.preventDefault()
    }




    return (
        // sign in
        <div>
            <div className="flex flex-col items-center justify-center h-screen ">
                <div className="w-full max-w-md rounded-lg shadow p-6 border border-gray-300">
                    <h2 className="text-2xl font-bold mb-4 text-center">SignIn to INNORA</h2>
                    <form onSubmit={handleSignIn} className="flex flex-col gap-2">
                        <input
                            placeholder="Email address"
                            className="input input-bordered w-full"
                            type="email"
                        />
                        <input
                            placeholder="Password"
                            className="input input-bordered w-full"
                            type="password"
                        />
                        <div className='w-full'>
                            <button
                                className="bg-gradient-to-r w-full from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                                type="submit"
                            >
                                SignIn
                            </button>
                            <p className="mt-4 text-center w-full">
                                Don't have an account? <Link href={'/signup'} className='text-blue-600 font-bold '>SignUp</Link>
                            </p>
                        </div>
                        <div className="divider ">OR</div>

                        <button className="btn bg-white text-black border-[#e5e5e5]">
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
