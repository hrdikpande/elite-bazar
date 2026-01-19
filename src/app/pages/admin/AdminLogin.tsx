import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(formData.username, formData.password, 'admin');

    if (result.success) {
      // Toast handled in Context
      navigate(from, { replace: true });
    }
    // Error handled in Context
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-none mb-4">
            <Shield className="h-6 w-6 text-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-heading font-medium tracking-tight text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground text-sm"> Authenticate to access management console.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
              className="h-12 border-border focus:border-foreground transition-colors bg-muted/50"
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={formData.showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="h-12 border-border focus:border-foreground transition-colors bg-muted/50 pr-10"
                placeholder="Enter password"
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
            Secure Sign In
          </Button>

          <div className="text-center pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Admin Access</p>
            <p className="text-sm font-medium mt-1 text-foreground">Sign in with your admin credentials</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
