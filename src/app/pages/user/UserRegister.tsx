import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { toast } from 'sonner';

export default function UserRegister() {
    const { register } = useStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
            toast.success('Account created! Please check your email to verify your account.');
            navigate('/');
        }
        // Error toast handled in Context
    };

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">Join us for exclusive access and rewards</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                                <Button type="submit" className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                                    Create Account
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Already have an account? <Link to="/login" className="text-foreground font-semibold hover:underline">Sign in</Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
