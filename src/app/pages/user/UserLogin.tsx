import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { toast } from 'sonner';

export default function UserLogin() {
    const { login } = useStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        showPassword: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await login(formData.username, formData.password, 'customer');
            if (result.success) {
                // Toast handled in Context
                navigate(redirect);
            }
            // Error toast handled in Context
        } catch (err) {
            // Unexpected error toast handled in Context (if inside login) or here if outside
        }
    };

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Login to Account</CardTitle>
                        <CardDescription className="text-center">Enter your email and password to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.username}
                                    onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-white hover:underline">Forgot password?</Link>
                                </div>
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

                            <div className="space-y-4">
                                <Button type="submit" className="w-full rounded-none bg-black text-white hover:bg-zinc-800">
                                    Sign In
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Don't have an account? <Link to="/register" className="text-foreground font-semibold hover:underline">Sign up</Link>
                                </div>

                                <div className="text-center pt-8 border-t border-border mt-6">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Secure Login</p>
                                    <p className="text-sm font-medium mt-1 text-foreground">Protected by Supabase Auth</p>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
