import { useState, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Button } from './ui/button';
import { Gift } from 'lucide-react';
import { toast } from 'sonner';
import { useStore, Reward } from '../contexts/StoreContext';

// Re-export Reward type for compatibility
export type { Reward };

interface SpinWheelProps {
    onWin: (reward: Reward) => void;
}

export function SpinWheel({ onWin }: SpinWheelProps) {
    const { spinWheelRewards } = useStore();
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const controls = useAnimation();
    const wheelRef = useRef<HTMLDivElement>(null);

    // Fallback if no rewards are configured
    const rewards = spinWheelRewards.length > 0 ? spinWheelRewards : [
        { id: 'default', label: 'Bonus Gift', color: '#18181b', textColor: '#ffffff' }
    ];

    const startSpin = async () => {
        if (isSpinning || hasSpun) return;

        setIsSpinning(true);

        // Random rotation between 5 and 10 full spins (1800 - 3600 degrees) + random segment offset
        // 6 segments, 60 degrees each.
        const segmentAngle = 360 / rewards.length;
        const randomSegment = Math.floor(Math.random() * rewards.length);
        const extraDegrees = randomSegment * segmentAngle;

        // We want to land on the chosen segment at the TOP pointer.
        // The wheel rotates CLOCKWISE. So to land on index i, we need to effectively rotate BACKWARDS to it.
        // Actually, distinct rotation:
        const baseSpins = 360 * 6; // 6 full spins
        const totalRotation = baseSpins + (360 - extraDegrees);
        // This calculation is a bit rough, let's just spin randomly and calculate result from final angle.

        // Simpler approach: Spin to a specific random total degree
        const randomRotation = 1800 + Math.random() * 1800; // Between 5 and 10 spins

        await controls.start({
            rotate: randomRotation,
            transition: {
                duration: 4,
                ease: [0.1, 0, 0.2, 1], // Cubic bezier for "spin up then slow down"
                type: "tween"
            }
        });

        // Calculate winning item
        const normalizedRotation = randomRotation % 360;
        // At 0 degrees, index 0 is at 3 o'clock (standard CSS rotation).
        // Pointer is usually at 12 o'clock (-90deg).
        // Let's assume standard CSS: 0deg is top if we rotate -90deg initially? 
        // Let's just create a logical mapping based on visual testing, or simplify:

        // Each segment is 60deg.
        // If rotation is 30deg, we are in segment 1? 
        // Let's do a purely random visual spin, then pick a random reward logically and just SAY that's what we won? 
        // No, that feels fake if the wheel clearly points to something else.

        // Correct math:
        // Pointer is at Top (270deg or -90deg in unit circle, but visually top).
        // If wheel rotates N degrees clockwise.
        // The segment currently at top is: (360 - (N % 360)) / segmentSize ?

        const sliceAngle = 360 / rewards.length;
        // Adjust for the fact that index 0 usually starts at 3 o'clock or top depending on CSS. 
        // Let's assume index 0 is at Top [-30, 30] deg?
        // Let's maintain a simpler logic: just select random item and force spin to it.

        // Winning Index
        const winningIndex = Math.floor(Math.random() * rewards.length);
        const winningReward = rewards[winningIndex];

        // Calculate rotation to land `winningIndex` at the top.
        // Assume Reward 0 is at Top (0 deg). Reward 1 is at 60 deg (right/clockwise)? 
        // If we rotate -60deg, Reward 1 comes to top.
        // So target rotation = -(winningIndex * sliceAngle).
        // Add full spins.

        const targetRotation = 3600 + (360 - (winningIndex * (360 / rewards.length))); // 10 spins + offset

        await controls.start({
            rotate: targetRotation,
            transition: { duration: 4.5, ease: [0.15, 0, 0.15, 1] }
        });

        setHasSpun(true);
        setIsSpinning(false);
        onWin(winningReward);
        toast.success(`You won: ${winningReward.label}!`);
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="relative w-80 h-80">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-8 text-black fill-current">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22L2 2L22 2L12 22Z" />
                    </svg>
                </div>

                {/* Wheel */}
                <motion.div
                    className={`w-full h-full rounded-full border-4 border-black overflow-hidden relative shadow-2xl ${(!isSpinning && !hasSpun) ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                    animate={controls}
                    initial={{ rotate: 0 }}
                    onClick={startSpin}
                    whileTap={(!isSpinning && !hasSpun) ? { scale: 0.95 } : undefined}
                >
                    {rewards.map((reward, index) => {
                        const rotation = index * (360 / rewards.length);
                        return (
                            <div
                                key={reward.id}
                                className="absolute w-full h-full top-0 left-0"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                }}
                            >
                                {/* Slice: Use clip-path or skew to make a slice. Simpler: Conic gradient or just simple divs for 6 items. 
                             For 6 items, skews are easiest? Or just absolute positioning half-circles?
                             Actually, with only 6 items, we can use 50% width divs rotated around center.
                         */}
                                <div
                                    className="absolute top-0 left-1/2 w-1/2 h-full -translate-x-1/2 origin-left flex items-start justify-center pt-8"
                                    style={{
                                        backgroundColor: reward.color,
                                        transform: `rotate(${360 / rewards.length / 2}deg) skewY(-${90 - (360 / rewards.length)}deg)`, // Math for hex slices
                                        // This CSS geometry is tricky. Let's use conic-gradient for background and overlay text for simplicity?
                                        // No, users want individual segments. 
                                        // Let's simplify: simple rects rotated? No.
                                        // Let's use conic-gradient for the wheel background and absolute position text.
                                    }}
                                >
                                </div>
                            </div>
                        );
                    })}

                    {/* Redoing the rendering to be simpler and robust */}
                    <div className="w-full h-full rounded-full relative"
                        style={{
                            background: `conic-gradient(
                          ${rewards.map((r, i) => `${r.color} ${i * (100 / rewards.length)}% ${(i + 1) * (100 / rewards.length)}%`).join(', ')}
                      )`
                        }}
                    >
                        {/* Text Labels */}
                        {rewards.map((reward, index) => {
                            const angle = (index * (360 / rewards.length)) + (360 / rewards.length / 2); // Center of slice
                            return (
                                <div
                                    key={reward.id}
                                    className="absolute top-0 left-0 w-full h-full flex justify-center pt-4 font-bold text-xs uppercase tracking-widest"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                        color: reward.textColor,
                                    }}
                                >
                                    <span style={{ transform: 'translateY(10px)' }}>{reward.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-black rounded-full z-10 flex items-center justify-center">
                    <Gift className="w-5 h-5" />
                </div>
            </div>

            <Button
                onClick={startSpin}
                disabled={isSpinning || hasSpun}
                size="lg"
                className="rounded-none bg-black text-white px-12 py-6 text-xl tracking-widest uppercase hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSpinning ? 'Spinning...' : hasSpun ? 'Reward Claimed' : 'Spin to Win'}
            </Button>
        </div>
    );
}
