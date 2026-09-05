import React from 'react';

const Loading = () => {
    return (
        <div className="flex-col gap-4 w-screen h-screen flex items-center justify-center">
            <div
                className="w-20 h-20 border-4 border-transparent text-white text-4xl animate-spin flex items-center justify-center border-t-white rounded-full"
            >
                <div
                    className="w-16 h-16 border-4 border-transparent text-[#b99d75] text-6xl animate-spin flex items-center justify-center border-t-[#b99d75] rounded-full"
                >
                    
                </div>
            </div>
        </div>
        
    );
};

export default Loading;