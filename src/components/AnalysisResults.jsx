// src/components/AnalysisResults.jsx
import React, { useState, useEffect } from "react";

const BASE_URL = "https://swingcomparison-backend.onrender.com";

const AnalysisResults = ({ results, sliderIndex, setSliderIndex }) => {
    // Register service worker for image caching
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('Service Worker registered:', reg.scope))
                    .catch(err => console.error('Service Worker registration failed:', err));
            });
        }
    }, []);
    // Preload images helper
    const preloadImages = (imageUrls) => {
        return imageUrls.map((url) => {
            const img = new window.Image();
            img.src = url;
            return img;
        });
    };

    const [userImages, setUserImages] = useState([]);
    const [proImages, setProImages] = useState([]);
    const [overlayImages, setOverlayImages] = useState([]);

    useEffect(() => {
        if (!results) return;
        const userUrls = (results.frames || []).map(f => `${BASE_URL}${f}`);
        const proUrls = (results.pro_frames || []).map(f => `${BASE_URL}${f}`);
        const overlayUrls = (results.overlay_frames || []).map(f => `${BASE_URL}${f}`);

        if (userUrls.length > 0) {
            setUserImages(preloadImages(userUrls));
        } else {
            setUserImages([]);
        }
        if (proUrls.length > 0) {
            setProImages(preloadImages(proUrls));
        } else {
            setProImages([]);
        }
        if (overlayUrls.length > 0) {
            setOverlayImages(preloadImages(overlayUrls));
        } else {
            setOverlayImages([]);
        }
    }, [results]);

    if (!results) return null;
    console.log("Results:", results);
    return (
        <div className="mt-6 text-center w-full max-w-screen-xl px-4 mx-auto">
            <h2 className="text-xl font-semibold text-black">
                From our database your swing is most similar to...
            </h2>
            <p className="text-4xl font-bold text-gray-800">
                {results.match} ({results.similarity}% similarity)
            </p>

            {results.frames?.length > 0 && results.pro_frames?.length > 0 && (
                <div className="mt-6 w-full">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                        <div className="flex-1 text-center">
                            <p className="text-xl font-semibold text-gray-700 mb-1">Your Swing</p>
                            <img
                                src={userImages[sliderIndex]?.src}
                                alt={`User Frame`}
                                className="w-full h-auto max-h-[70vh] object-contain rounded shadow"
                            />
                        </div>
                        <div className="flex-1 text-center">
                            <p className="text-xl font-semibold text-gray-700 mb-1">{results.match}</p>
                            <img
                                src={proImages[sliderIndex]?.src}
                                alt={`Pro Frame`}
                                className="w-full h-auto max-h-[70vh] object-contain rounded shadow"
                            />
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <input
                            type="range"
                            min={0}
                            max={results.frames.length - 1}
                            value={sliderIndex}
                            onChange={(e) => setSliderIndex(Number(e.target.value))}
                            className="w-full md:w-2/3"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Frame {sliderIndex + 1} / {results.frames.length}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-10 text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Overlay View</h3>
                <div className="relative w-full max-w-xl mx-auto aspect-[4/3]">
                    <img
                        src={overlayImages[sliderIndex]?.src}
                        alt={`Overlay Frame`}
                        className="absolute top-0 left-0 w-full h-full object-contain"
                    />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    Frame {sliderIndex + 1} / {results.frames?.length || 0} (Overlay)
                </p>
            </div>
        </div>
    );
}

export default AnalysisResults;