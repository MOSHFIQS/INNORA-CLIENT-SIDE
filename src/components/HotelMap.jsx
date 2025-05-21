import React from 'react';

const HotelMap = () => {
    return (
        <div className="w-full border-4  ">
            {/* Heading Section */}
            <div className="text-center py-3 md:py-10  bg-[#1c1c1c] text-white font-mono">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide">Explore Our Location</h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300">
                    Find us in the heart of Melbourne’s vibrant city center
                </p>
            </div>

            {/* Info + Map Section */}
            <div className="w-full relative flex flex-col lg:flex-row items-center justify-center gap-5 px-0.5 lg:px-5 py-2 bg-black text-white rounded-b">
                {/* Hotel Info */}
                {/* <div className=" absolute top-3  left-6 space-y-4 text-center font-bold hidden bg-black lg:block px-3">
                    <h2 className="text-4xl font-bold ">INNORA </h2>
                    <p className="text-lg">
                        123 Queen Street, Melbourne, VIC 3000
                    </p>
                    <p className="">
                        Phone: +61 3 1234 5678
                        <br />
                        Email: contact@grandelitehotel.com
                    </p>
                </div> */}

                {/* Embedded Google Map */}
                <div className="w-full  h-96 md:h-[600px] lg:h-[700px] shadow-lg rounded-lg overflow-hidden border-4 border-white">
                    <iframe
                        title="Hotel Location - Google Map"
                        
                        className="w-full h-full"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093746!2d144.95373531590447!3d-37.81720997975153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4826d8fbb1%3A0x1a2a5a4b1d1e5f15!2sMelbourne%2C%20Australia!5e0!3m2!1sen!2sus!4v1634341806794!5m2!1sen!2sus"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default HotelMap;
