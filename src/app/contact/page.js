import React from "react";

const RequestForm = () => {
    return (
        <div className="h-screen bg-[#1c1c1c] text-white flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-6xl">
                <div className="text-center mt-0 md:mb-10 ">
                    <p className="text-xs text-[#c5a06f] uppercase tracking-widest">Connect with us</p>
                    <h2 className="text-4xl font-serif mt-2">Submit Your Request Form</h2>
                </div>

                <div className="bg-[url('/your-marble-bg.jpg')] bg-cover bg-center px-6 py-12 rounded-lg">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Enter Your Full Name"
                            className="p-3 border border-gray-300 focus:outline-none hover:text-white hover:border-white"
                        />
                        <input
                            type="text"
                            placeholder="How Can I Help You?"
                            className="p-3 border border-gray-300 focus:outline-none hover:text-white hover:border-white"
                        />
                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            className="p-3 border border-gray-300 focus:outline-none hover:text-white hover:border-white"
                        />
                        <textarea
                            placeholder="Additional Message"
                            rows="1"
                            className="p-3 border border-gray-300 focus:outline-none hover:text-white hover:border-white"
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Mobile Number"
                            className="p-3 border border-gray-300 focus:outline-none col-span-1 md:col-span-2"
                        />
                        <button
                            type="submit"
                            className="col-span-1 md:col-span-2 bg-[#c5a06f] text-white py-3 font-medium"
                        >
                            Send Message Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestForm;
