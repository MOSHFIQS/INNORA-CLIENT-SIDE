import Link from 'next/link';
import React from 'react';

const page = () => {
    return (
        // sign up
        <div>
            <div className="flex flex-col items-center justify-center h-screen ">
                <div className="w-full max-w-md rounded-lg shadow p-6 border border-gray-300">
                    <h2 className="text-2xl font-bold mb-4 text-center">SignUp To INNORA</h2>
                    <form className="flex flex-col gap-2">
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
                            Already have an account? <Link href={'/signin'} className='text-blue-600 font-bold '>SignIn</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default page;