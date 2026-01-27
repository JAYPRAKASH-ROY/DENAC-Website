'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';

import Navbar from './Navbar';

const FRAME_COUNT = 120;
const IMAGES: HTMLImageElement[] = [];

export default function HeadphoneScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

    useEffect(() => {
        let loadedCount = 0;

        const loadImages = async () => {
            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                img.src = `/frames/frame_${i}.jpg`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === FRAME_COUNT) {
                        setImagesLoaded(true);
                        setIsLoading(false);
                    }
                };
                img.onerror = (e) => {
                    console.error(`Failed to load frame ${i}`, e);
                };
                IMAGES[i - 1] = img;
            }
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(index) - 1));
        const image = IMAGES[safeIndex];

        if (image && image.complete) {
            // Enforce 1080p internal resolution
            const cw = 1920;
            const ch = 1080;

            const imgW = image.width;
            const imgH = image.height;

            // Scale to CONTAIN within 1920x1080
            const scale = Math.min(cw / imgW, ch / imgH);
            const newW = imgW * scale;
            const newH = imgH * scale;

            const offsetX = (cw - newW) / 2;
            const offsetY = (ch - newH) / 2;

            context.clearRect(0, 0, cw, ch);
            context.fillStyle = '#050505';
            context.fillRect(0, 0, cw, ch);
            context.drawImage(image, offsetX, offsetY, newW, newH);
        }
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (imagesLoaded) {
            requestAnimationFrame(() => renderFrame(latest));
        }
    });

    useEffect(() => {
        if (imagesLoaded) {
            renderFrame(1);
        }
    }, [imagesLoaded]);

    // Removed resizing logic because canvas size is fixed to 1920x1080 via props

    return (
        <div ref={containerRef} className="h-[800vh] relative">
            <div className="sticky top-0 h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 z-10">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}

                {/* 16:9 Aspect Ratio Container */}
                <div className="relative aspect-video w-full max-h-screen max-w-full bg-[#050505]">
                    <Navbar />
                    <canvas
                        ref={canvasRef}
                        width={1920}
                        height={1080}
                        className="block w-full h-full object-contain"
                    />

                    {/* Overlay constrained to the same 16:9 box */}
                    <ScrollOverlay scrollYProgress={scrollYProgress} />
                </div>
            </div>
        </div>
    );
}

function ScrollOverlay({ scrollYProgress }: { scrollYProgress: any }) {
    // 7 Sections spread across 0-1
    // 0.00 - 0.10: Intro
    // 0.15 - 0.25: Sound
    // 0.30 - 0.40: ANC
    // 0.45 - 0.55: Materials
    // 0.60 - 0.70: Battery
    // 0.75 - 0.85: Connectivity
    // 0.90 - 1.00: CTA

    const opacityIntro = useTransform(scrollYProgress, [0, 0.08, 0.12], [1, 1, 0]);

    const opacitySound = useTransform(scrollYProgress, [0.13, 0.18, 0.22, 0.27], [0, 1, 1, 0]);
    const ySound = useTransform(scrollYProgress, [0.13, 0.18, 0.22, 0.27], [50, 0, 0, -50]);

    const opacityANC = useTransform(scrollYProgress, [0.28, 0.33, 0.37, 0.42], [0, 1, 1, 0]);
    const yANC = useTransform(scrollYProgress, [0.28, 0.33, 0.37, 0.42], [50, 0, 0, -50]);

    const opacityMat = useTransform(scrollYProgress, [0.43, 0.48, 0.52, 0.57], [0, 1, 1, 0]);
    const yMat = useTransform(scrollYProgress, [0.43, 0.48, 0.52, 0.57], [50, 0, 0, -50]);

    const opacityBat = useTransform(scrollYProgress, [0.58, 0.63, 0.67, 0.72], [0, 1, 1, 0]);
    const yBat = useTransform(scrollYProgress, [0.58, 0.63, 0.67, 0.72], [50, 0, 0, -50]);

    const opacityConn = useTransform(scrollYProgress, [0.73, 0.78, 0.82, 0.87], [0, 1, 1, 0]);
    const yConn = useTransform(scrollYProgress, [0.73, 0.78, 0.82, 0.87], [50, 0, 0, -50]);

    const opacityCTA = useTransform(scrollYProgress, [0.88, 0.93, 1], [0, 1, 1]);
    const yCTA = useTransform(scrollYProgress, [0.88, 0.93, 1], [50, 0, 0]);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center font-sans">

            {/* 1. Intro */}
            <motion.div style={{ opacity: opacityIntro }} className="absolute text-center px-4 w-full">
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white/95 mb-4">DENAC</h1>
                <p className="text-xl md:text-3xl text-white/60 tracking-tight font-light">Pure Sound. Redefined.</p>
            </motion.div>

            {/* 2. Sound Quality - Left Aligned */}
            <motion.div style={{ opacity: opacitySound, y: ySound }} className="absolute w-full px-12 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-6">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90">Computational Audio.</h2>
                    <div className="space-y-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-white mb-2">Adaptive EQ</h3>
                            <p className="text-white/60 text-sm leading-relaxed">Automatically tunes music to the shape of your ear for a rich, consistent listening experience.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-white mb-2">High-Fidelity Audio</h3>
                            <p className="text-white/60 text-sm leading-relaxed">Custom-built drivers render deep bass and crisp highs with minimal distortion.</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 3. ANC - Right Aligned */}
            <motion.div style={{ opacity: opacityANC, y: yANC }} className="absolute w-full px-12 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="md:col-start-2 text-right space-y-6">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90">Silence the World.</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl text-left">
                            <h3 className="text-lg font-semibold text-white mb-1">2x Stronger</h3>
                            <p className="text-white/60 text-xs">Active Noise Cancellation compared to previous gen.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl text-left">
                            <h3 className="text-lg font-semibold text-white mb-1">Transparency</h3>
                            <p className="text-white/60 text-xs">Hear the world around you without taking them off.</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 4. Materials - Center Bottom */}
            <motion.div style={{ opacity: opacityMat, y: yMat }} className="absolute w-full px-12 md:px-24 flex flex-col items-center text-center">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 mb-8">Forged in Titanium.</h2>
                <div className="flex gap-4 md:gap-8 justify-center w-full max-w-3xl">
                    <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                        <h4 className="text-2xl font-bold text-white mb-2">Aerospace Grade</h4>
                        <p className="text-white/60 text-sm">Lightweight fit.</p>
                    </div>
                    <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                        <h4 className="text-2xl font-bold text-white mb-2">Mesh Canopy</h4>
                        <p className="text-white/60 text-sm">Breathable comfort.</p>
                    </div>
                </div>
            </motion.div>

            {/* 5. Battery - Left Aligned */}
            <motion.div style={{ opacity: opacityBat, y: yBat }} className="absolute w-full px-12 md:px-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="col-span-12 md:col-span-5 text-left space-y-6">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90">All Day Power.</h2>
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-bold text-white">20</span>
                            <span className="text-xl text-white/60">hours of listening</span>
                        </div>
                        <p className="text-white/60 text-lg border-l-2 border-white/20 pl-4">
                            Movie playback, or talk time with Active Noise Cancellation and Spatial Audio enabled.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 6. Connectivity - Right Aligned */}
            <motion.div style={{ opacity: opacityConn, y: yConn }} className="absolute w-full px-12 md:px-24 flex justify-end">
                <div className="max-w-md text-right space-y-6">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white/90">Seamless Connection.</h2>
                    <ul className="space-y-4">
                        <li className="flex items-center justify-end gap-4 text-white/80 text-lg">
                            <span>Instant Pairing</span>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </li>
                        <li className="flex items-center justify-end gap-4 text-white/80 text-lg">
                            <span>Auto-Switching</span>
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </li>
                        <li className="flex items-center justify-end gap-4 text-white/80 text-lg">
                            <span>Audio Sharing</span>
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* 7. CTA */}
            <motion.div style={{ opacity: opacityCTA, y: yCTA }} className="absolute text-center px-4 w-full">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white/90 mb-8">The Future of Sound.</h2>
                <button
                    onClick={() => window.open('https://amzn.in/d/j8upomy', '_blank')}
                    className="pointer-events-auto bg-white text-black px-10 py-4 rounded-full text-lg font-semibold active:scale-95 transition-all hover:bg-gray-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    Pre-order Now
                </button>
            </motion.div>
        </div>
    );
}
