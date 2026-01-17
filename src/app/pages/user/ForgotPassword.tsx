import { useState } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        // Mock password reset logic
        setSubmitted(true);
        toast.success('Password reset link sent to your email');
    };

    return (
        <UserLayout>
            <div className="container max-w-md mx-auto px-4 py-16">
                <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Link>

                <Card className="border-border shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
                        <CardDescription className="text-center">
                            Don't worry! It happens. Please enter the email associated with your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="email">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-12">
                                    Send Recovery Link
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-4 space-y-4">
                                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Check your email</h3>
                                    <p className="text-muted-foreground text-sm mt-1">We have sent a password recover link to <strong>{email}</strong>.</p>
                                </div>
                                <Button asChild variant="outline" className="w-full mt-4 rounded-none">
                                    <Link to="/login">Back to Login</Link>
                                </Button>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-sm text-muted-foreground hover:text-foreground underline block w-full pt-2"
                                >
                                    Did not receive the email? Resend
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
