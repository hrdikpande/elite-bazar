import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function DistributorLogin() {
  const { login, distributors } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/distributor/dashboard';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password, 'distributor');

    if (result.success) {
      // Toast handled in Context
      navigate(from, { replace: true });
    }
    // Error handled in Context
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-none mb-4">
            <User className="h-6 w-6 text-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-heading font-medium tracking-tight text-foreground">Distributor Network</h1>
          <p className="text-muted-foreground text-sm">Sign in to manage inventory and orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="h-12 border-border focus:border-foreground transition-colors bg-muted/50"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={formData.showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="h-12 border-border focus:border-foreground transition-colors bg-muted/50 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {formData.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-medium tracking-wide uppercase">
            Sign In
          </Button>

          <div className="text-center pt-8 border-t border-border space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Partner Portal</p>
            <p className="text-sm font-medium mt-1 text-foreground">Sign in to manage inventory</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
