"use client";


const services = [
    {
        title: "Parking Facility",
        description:
            "Libero libero sem egestas donec tincidunt turpis platea facilisis morbi dis duis cras",
        image: "https://cdn-icons-png.freepik.com/512/11295/11295529.png"
    },
    {
        title: "Wellness & Relaxation",
        description:
            "Eros justo consequat lobortis euismod est erat amet fei sociosqu vel magna purus gravida",
        image: "https://cdn-icons-png.flaticon.com/512/8447/8447081.png"
    },
    {
        title: "Pick-Up Service",
        description:
            "Orci quam turpis viverra primis cursus per taciti hendrerit ginibus per etsi",
        image:
            "https://cdn0.iconfinder.com/data/icons/ecommers-colored-pack/64/delivery_pick_up_e_commerce_colored_outline-512.png"
    },
    {
        title: "Clothing Cleaning Service",
        description:
            "Sociosqu finibus ultrices ex amet praesent lacus platea at onsectetur condimentum",
        image:
            "https://cdn1.iconfinder.com/data/icons/sales-7/512/size_label_tshirt_clothes_clothing_shopping-256.png"
    },
    {
        title: "Free High-Speed WiFi",
        description:
            "Accumsan sodales condimentum duis metus purus volutpat penatibus mattis sem",
        image:
            "https://i.ibb.co/7t4yXH0x/wifi-png-wi-fi-wifi-symbol-wireless-internet-wifi-icon-png-white-115629358276nwhuixajt-removebg-prev.png"
    },
    {
        title: "Morning Refreshment",
        description:
            "Dapibus nullam ac et augue augue leo vel dictum eociosqu cursus elementum conubia",
        image:
            "https://cdn-icons-png.flaticon.com/512/6792/6792280.png"
    },
    {
        title: "Outdoor Pool",
        description:
            "Euismod posuere consequat leo congue penatibus potenti idio sociosqu et dictum volutpat",
        image:
            "https://cdn2.iconfinder.com/data/icons/real-estate-filled-line-6/96/7_-_Pool-512.png"
    },
    {
        title: "Security Camera",
        description:
            "Sem purus placerat iaculis posuere odio consectetur vel torquent consectetur dis penatibus",
        image:
            "https://cdn3.iconfinder.com/data/icons/security-3-4/48/147-512.png"
    },
    {
        title: "Room Services",
        description:
            "Elit euismod mi quis urna iaculis platea mauris sed sociosqu primis nibh taciti",
        image:
            "https://cdn-icons-png.flaticon.com/512/2460/2460965.png"
    }
];

export default function HotelServices() {
    return (
        <div className="bg-gray-700 flex items-center justify-center flex-col space-y-16 py-16">
            <h1 className=" text-4xl md:text-5xl font-extrabold  text-white text-center uppercase ">Stay in Luxury with Top-Rated Amenities</h1>
            <section className="bg-gray-700 text-white  px-6 md:px-20">
                <div className="grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`flex gap-5  items-center  hover:bg-gray-500 rounded-lg px-5 py-4 bg-gray-600`}
                        >
                            <img
                                src={service.image}
                                alt={service.title}
                                className="min-w-[40px] h-[40px] object-contain"
                            />
                            <div>
                                <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-300">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
