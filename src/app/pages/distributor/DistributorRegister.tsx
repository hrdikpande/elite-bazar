import { useState } from 'react';
import { Eye, EyeOff, Briefcase } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { toast } from 'sonner';

export default function DistributorRegister() {
    const { registerDistributor } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            setIsSubmitting(false);
            return;
        }

        const success = await registerDistributor(formData.name, formData.email, formData.password, formData.phone);
        if (success) {
            toast.success('Application received! You can now login.');
            navigate('/distributor/login');
        } else {
            setIsSubmitting(false);
        }
        // Error handled in Context
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-secondary flex items-center justify-center rounded-none mb-4">
                        <Briefcase className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-2xl font-bold">Partner Program</CardTitle>
                    <CardDescription>Join our distributor network</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Business / Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Enterprise Ltd"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="partner@example.com"
                                value={formData.email}
                                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={formData.showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                    className="pr-10"
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
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={formData.showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    required
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {formData.showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 space-y-4">
                            <Button type="submit" className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                                {isSubmitting ? 'Registering...' : 'Apply for Partnership'}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Already a partner? <Link to="/distributor/login" className="text-foreground font-semibold hover:underline">Sign in</Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
