import UserLayout from '../../components/UserLayout';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <UserLayout>
            <div className="bg-background min-h-screen">
                {/* Header */}
                <div className="bg-secondary/30 py-16 border-b border-border">
                    <div className="container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary rotate-3"
                        >
                            <Shield className="w-8 h-8" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: January 2026</p>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction Blurb */}
                        <div className="bg-card border border-border rounded-2xl p-8 mb-12 shadow-sm">
                            <p className="text-lg leading-relaxed text-card-foreground">
                                At <span className="font-bold text-primary">EliteBazar</span>, we believe that privacy is a fundamental right. We are committed to transparency in how we collect, use, and share your personal information. This policy is designed to help you understand our practices.
                            </p>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 not-prose">
                                <div className="p-6 bg-secondary/20 rounded-xl border border-border">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-primary" /> Data Collection
                                    </h3>
                                    <p className="text-sm text-muted-foreground">We only collect essential data needed to provide you with the best shopping experience.</p>
                                </div>
                                <div className="p-6 bg-secondary/20 rounded-xl border border-border">
                                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-primary" /> Data Security
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Your data is encrypted and stored securely using industry-standard protocols.</p>
                                </div>
                            </div>

                            <h3>1. Information We Collect</h3>
                            <p>
                                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This information may include your name, email address, shipping address, and payment information.
                            </p>

                            <h3>2. How We Use Your Information</h3>
                            <p>
                                We use the information we collect to:
                            </p>
                            <ul>
                                <li>Provide, maintain, and improve our services to you.</li>
                                <li>Process your transactions and manage your orders.</li>
                                <li>Send you related information, including confirmations, invoices, and support messages.</li>
                                <li>Communicate with you about products, services, offers, and promotions.</li>
                            </ul>

                            <h3>3. Cookies and Tracking Technologies</h3>
                            <p>
                                We use cookies and similar technologies to improve your experience on our website. Cookies are small data files stored on your hard drive or in device memory that help us improve our services and your experience, see which areas and features of our services are popular, and count visits.
                            </p>

                            <h3>4. Data Sharing</h3>
                            <p>
                                We do not sell your personal data. We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.
                            </p>

                            <h3>5. Your Rights</h3>
                            <p>
                                Depending on your location, you may have rights regarding your personal information, such as the right to access, correct, delete, or restrict the use of your data. Please contact us at support@elitebazar.com to exercise these rights.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
