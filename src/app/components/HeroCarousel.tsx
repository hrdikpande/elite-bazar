import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { BannerItem } from '../contexts/StoreContext';

interface HeroCarouselProps {
    banners: BannerItem[];
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 1.2, // Slight zoom effect on entry
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 1, // Reset scale on exit
    }),
};

export default function HeroCarousel({ banners }: HeroCarouselProps) {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Normalize page index
    const imageIndex = banners.length > 0 ? Math.abs(page % banners.length) : 0;
    const currentBanner = banners[imageIndex];

    const paginate = (newDirection: number) => {
        setPage(([prevPage, _]) => [prevPage + newDirection, newDirection]);
    };

    useEffect(() => {
        // Simple, robust interval. 
        // We only stop if there are no banners or just 1 (no place to scroll to).
        if (banners.length <= 1) return;

        const timer = setInterval(() => {
            setPage(([prevPage, _]) => [prevPage + 1, 1]);
        }, 4000);

        return () => clearInterval(timer);
    }, [banners.length]); // Only re-run if banner count changes. Ignore hover for now to ensure it works.

    // Fallback if no banners
    if (!currentBanner) return null;

    return (
        <div
            className="relative h-[85vh] w-full overflow-hidden bg-black"
        // Removed hover pause to ensure auto-scroll works reliably for diagnosis
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "tween", ease: "easeInOut", duration: 0.8 }, // Smooth cinematic slide
                        opacity: { duration: 0.5 },
                        scale: { duration: 6, ease: "linear" } // Constant subtle zoom
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Parallax-like Background Image */}
                    <motion.img
                        src={currentBanner.image}
                        alt={currentBanner.title}
                        className="w-full h-full object-cover opacity-80"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 7, ease: "easeOut" }} // Slow zoom out
                    />
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={page} // Re-animate text on slide change
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h1 className="text-6xl md:text-8xl font-heading font-bold tracking-tighter leading-none shadow-sm uppercase">
                            {currentBanner.title}
                        </h1>
                        <p className="text-lg md:text-2xl font-light tracking-wide max-w-lg mx-auto text-zinc-200">
                            {currentBanner.subtitle}
                        </p>
                        <div className="pt-8">
                            <Button asChild size="lg" className="bg-white text-black hover:bg-zinc-200 px-8 py-6 rounded-none text-base tracking-widest uppercase transition-transform hover:scale-105">
                                <Link to="/products">Shop Collection</Link>
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-x-0 bottom-10 z-30 flex justify-center gap-4">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage([i, i > imageIndex ? 1 : -1])}
                        className={`w-12 h-1 transition-all duration-300 ${i === imageIndex ? "bg-white" : "bg-white/30 hover:bg-white/60"}`}
                    />
                ))}
            </div>

            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors backdrop-blur-sm hidden md:block"
                onClick={() => paginate(-1)}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors backdrop-blur-sm hidden md:block"
                onClick={() => paginate(1)}
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    );
}
