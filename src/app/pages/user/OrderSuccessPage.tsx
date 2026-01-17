import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { Button } from '../../components/ui/button';
import { SpinWheel, Reward } from '../../components/SpinWheel';
import { useStore } from '../../contexts/StoreContext';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Wallet, Receipt, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../../components/ui/badge';


export default function OrderSuccessPage() {
  const { updateOrder } = useStore();
  const { orderId } = useParams();
  const [reward, setReward] = useState<Reward | null>(null);

  const handleWin = (wonReward: Reward) => {
    setReward(wonReward);
    if (orderId) {
      updateOrder(orderId, { spinReward: wonReward.label });
    }
  };

  return (
    <UserLayout>
      <div className="relative min-h-[calc(100vh-6rem)] w-full overflow-hidden bg-background text-foreground flex flex-col lg:flex-row">

        {/* BACKGROUND: Abstract Gradient Mesh */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-primary/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        </div>

        {/* LEFT PANEL: The "Receipt" Ticket */}
        <div className="relative z-10 w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center p-6 md:p-12 lg:border-r border-border/10 backdrop-blur-sm bg-background/40">

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-card border border-border/50 shadow-2xl rounded-sm overflow-hidden"
          >
            {/* Ticket Perforation Top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-border/30 to-transparent flex justify-between px-1">
              {[...Array(20)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-background -mt-1" />)}
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Order Confirmed</p>
                  <h1 className="text-3xl font-heading font-black tracking-tighter text-foreground">THANK YOU</h1>
                </div>
                <div className="bg-success/10 p-2 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
              </div>

              <div className="space-y-4 py-8 border-y border-dashed border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-medium text-foreground">{orderId || '8X29-92KA'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-mono font-medium text-foreground">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-mono font-medium text-foreground uppercase flex items-center gap-2"><Wallet className="w-3 h-3" /> Paid</span>
                </div>
              </div>

              {reward ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-primary/5 border border-primary/20 p-4 text-center rounded-sm"
                >
                  <p className="text-xs text-primary uppercase tracking-widest font-bold mb-1">Bonus Unlocked</p>
                  <p className="text-xl font-heading font-black text-foreground">{reward.label}</p>
                </motion.div>
              ) : (
                <div className="text-center p-4 bg-muted/30 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest animate-pulse">Spin to Win Pending...</p>
                </div>
              )}

              <div className="pt-4">
                <Button asChild className="w-full h-12 uppercase tracking-widest text-xs font-bold bg-foreground text-background hover:bg-foreground/90 rounded-none shadow-lg">
                  <Link to="/products">
                    Continue Shopping <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Ticket Perforation Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-border/30 to-transparent flex justify-between px-1">
              {[...Array(20)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-background -mb-1" />)}
            </div>
          </motion.div>

          <div className="mt-8 text-center sm:text-left">
            <p className="text-sm text-muted-foreground max-w-xs mx-auto sm:mx-0">
              A confirmation email has been sent to your registered address.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: The "Portal" Wheel */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-8 lg:p-0 min-h-[500px] lg:min-h-auto overflow-hidden">

          <div className="absolute inset-0 flex items-center justify-center z-0 opacity-10">
            <h2 className="text-[15vw] font-black tracking-tighter text-foreground select-none">BONUS</h2>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.5 }}
            className="relative z-10"
          >
            <div className="text-center mb-8 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"
              />
              <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur border-primary/50 text-primary px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
                <Sparkles className="w-3 h-3 mr-2 inline-block" /> Exclusive Offer
              </Badge>
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-foreground drop-shadow-lg">
                Spin Your Prize
              </h3>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <SpinWheel onWin={handleWin} />
            </div>
          </motion.div>
        </div>

      </div>
    </UserLayout>
  );
}
