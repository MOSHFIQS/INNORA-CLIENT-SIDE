import React from 'react';

const Loading = () => {
    return (
        <div className="w-full flex-1 min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-6">
            <div
                className="w-16 h-16 border-4 border-transparent text-white animate-spin flex items-center justify-center border-t-white rounded-full"
            >
                <div
                    className="w-12 h-12 border-4 border-transparent text-[#b99d75] animate-spin flex items-center justify-center border-t-[#b99d75] rounded-full"
                >
                    
                </div>
            </div>
        </div>
    );
};

export default Loading;