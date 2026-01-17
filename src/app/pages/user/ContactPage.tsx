import { useStore } from '../../contexts/StoreContext';
import UserLayout from '../../components/UserLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ContactPage() {
    const { contactPageConfig } = useStore();
    const { heroTitle, heroSubtitle, email, phone, address, note } = contactPageConfig;

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Us",
            details: [email],
            color: "text-info"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: [phone],
            color: "text-success"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            details: [address],
            color: "text-primary"
        }
    ];

    return (
        <UserLayout>
            <div className="bg-background min-h-screen">
                {/* Header */}
                <div className="bg-primary/5 py-20 pb-32">
                    <div className="container mx-auto px-6 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-heading font-bold mb-6"
                        >
                            {heroTitle}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        >
                            {heroSubtitle}
                        </motion.p>
                    </div>
                </div>

                <div className="container mx-auto px-6 -mt-20 relative z-10 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                            >
                                <Card className="h-full border-none shadow-xl">
                                    <CardContent className="p-8 flex flex-col items-center text-center">
                                        <div className={`w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-6 ${info.color}`}>
                                            <info.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-4">{info.title}</h3>
                                        {info.details.map((detail, i) => (
                                            <p key={i} className="text-muted-foreground">{detail}</p>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card className="border-none shadow-lg">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <MessageSquare className="w-6 h-6 text-primary" />
                                        Send us a Message
                                    </h2>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        // Simple validation
                                        const form = e.currentTarget;
                                        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                                        if (!email || !email.includes('@')) {
                                            // Using standard browser validation or could add toast
                                            return;
                                        }
                                        // Mock submission
                                        toast.success("Message sent! We'll get back to you shortly.");
                                        form.reset();
                                    }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">First Name *</label>
                                                <Input placeholder="John" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Last Name *</label>
                                                <Input placeholder="Doe" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email *</label>
                                            <Input name="email" type="email" placeholder="john@example.com" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Subject *</label>
                                            <Input placeholder="Order Inquiry" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Message *</label>
                                            <Textarea placeholder="How can we help you?" className="min-h-[150px]" required />
                                        </div>
                                        <Button type="submit" className="w-full" size="lg">
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Dynamic Content & Map Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Admin Context Content */}
                            <div className="bg-secondary/30 rounded-2xl p-8">
                                <h3 className="text-xl font-bold mb-4">A Note from Us</h3>
                                <div className="prose dark:prose-invert">
                                    <div className="whitespace-pre-wrap">{note}</div>
                                </div>
                            </div>

                            {/* Hours */}
                            <Card className="border-none shadow-lg bg-primary text-primary-foreground">
                                <CardContent className="p-8">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Clock className="w-6 h-6" />
                                        Business Hours
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b border-primary-foreground/20 pb-2">
                                            <span>Monday - Friday</span>
                                            <span className="font-bold">9:00 AM - 6:00 PM EST</span>
                                        </div>
                                        <div className="flex justify-between border-b border-primary-foreground/20 pb-2">
                                            <span>Saturday</span>
                                            <span className="font-bold">10:00 AM - 4:00 PM EST</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Sunday</span>
                                            <span className="font-bold opacity-80">Closed</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
