import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function IntroOverlay() {
    // Always start as visible on mount (every reload)
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        }
    }, [isVisible]);

    const handleComplete = () => {
        setIsVisible(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
                    onAnimationComplete={(definition) => {
                        // Safety timeout in case animation end logic is complex
                        if (definition === "exit") {
                            document.body.style.overflow = 'auto';
                        }
                    }}
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 z-0">
                        {/* Aurora Borealis Effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ duration: 0.8, delay: 0 }}
                            className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-[150px] animate-pulse"
                            style={{ animationDuration: '4s' }}
                        />
                    </div>

                    <div className="relative z-10 text-center text-white px-4">
                        {/* Logo Reveal */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0 }}
                            className="mb-6 flex flex-col items-center"
                        >
                            <motion.div
                                initial={{ rotate: -180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "backOut", delay: 0.1 }}
                                className="mb-4 bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/20"
                            >
                                <Sparkles className="w-10 h-10 text-primary" />
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter overflow-hidden">
                                {"EliteBazar".split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.1 + (index * 0.02), ease: "backOut" }}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, letterSpacing: "0.2em" }}
                            animate={{ opacity: 1, letterSpacing: "0.5em" }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                            className="text-xs md:text-sm uppercase font-light text-white/50"
                        >
                            Redefining Luxury
                        </motion.div>

                        {/* Enter Button / Auto-Exit Timer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="mt-12"
                            onAnimationComplete={() => {
                                // Auto exit after 1.5 seconds total (extremely fast)
                                setTimeout(handleComplete, 1500);
                            }}
                        >
                            <button
                                onClick={handleComplete}
                                className="text-white/30 text-[10px] uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                            >
                                Skip Intro
                            </button>
                        </motion.div>
                    </div>

                    {/* Curtain Raise Effect for Exit */}
                    <motion.div
                        initial={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                        className="absolute inset-0 bg-black z-[-1] origin-top"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
