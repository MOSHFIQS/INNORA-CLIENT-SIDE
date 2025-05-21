'use client'
import React, { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        function toggleVisibility() {
            if (window.scrollY > 200) setIsVisible(true);
            else setIsVisible(false);
        }

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Custom smooth scroll to top with duration 1000ms (1 second)
    function scrollToTop() {
        const totalScrollDistance = window.scrollY;
        const scrollDuration = 1000; // ms
        let startTime = null;

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / scrollDuration, 1);
            const easeProgress = easeInOutQuad(progress);

            window.scrollTo(0, totalScrollDistance * (1 - easeProgress));

            if (elapsed < scrollDuration) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    return (
        <button
            onClick={scrollToTop}
            className={`group fixed bottom-6 right-6 z-50 transition-opacity duration-300 bg-[#c0a783] border hover:border-white hover:bg-black text-white p-3 shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll to top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                {/* Vertical line (|) hidden by default, animates on hover */}
                <path
                    d="M12 19V5"
                    className="line"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Arrowhead (^) always visible and moves on hover */}
                <path
                    d="M5 12l7-7 7 7"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Inline CSS for the animation */}
            <style jsx>{`
                .line {
                    stroke-dasharray: 14;
                    stroke-dashoffset: 14;
                    opacity: 0;
                    transition-property: stroke-dashoffset, opacity;
                    transition-duration: 0.4s, .8s;
                    transition-timing-function: ease;
                }
                .group:hover .line {
                    stroke-dashoffset: 0;
                    opacity: 1;
                    transition-duration: 0.4s, 0s;
                }
            `}</style>
        </button>
    );
}
