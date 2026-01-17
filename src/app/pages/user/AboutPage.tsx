import { useStore } from '../../contexts/StoreContext';
import UserLayout from '../../components/UserLayout';
import { motion } from 'framer-motion';
import { Award, Globe, Heart, ShieldCheck, Zap, Star } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function AboutPage() {
    const { aboutPageConfig } = useStore();
    const { heroImage, heroTitle, heroSubtitle, storyContent, values } = aboutPageConfig;

    // Use values from config if available, otherwise default to icons mapping
    // Note: For simplicity in this iteration, we map string icon names to Lucide icons if we stored them as strings in the future
    // But currently 'values' in config uses hardcoded icons in StoreContext initial state. 
    // Ideally we'd map string names to icons dynamically.
    // For now, let's keep the hardcoded 'features' list but potentially overwrite text if we had that in config.
    // Since we only added 'values' to config interface but didn't build a complex editor for it yet, 
    // let's primarily use the hero/story parts which are fully editable.

    // Icon mapping
    const iconMap: Record<string, any> = {
        Award, Globe, ShieldCheck, Heart, Zap: Award, Star: Award // Fallbacks
    };

    const defaultValues = [
        {
            icon: 'Award',
            title: "Premium Quality",
            description: "We source only the finest materials and partner with master artisans to ensure every product meets our exacting standards."
        },
        {
            icon: 'Globe',
            title: "Sustainable Sourcing",
            description: "Our commitment to the planet means working with suppliers who prioritize ethical labor and eco-friendly practices."
        },
        {
            icon: 'ShieldCheck',
            title: "Authenticity Guaranteed",
            description: "Every item in our collection is verified for authenticity, giving you complete peace of mind with every purchase."
        },
        {
            icon: 'Heart',
            title: "Customer First",
            description: "We believe in building lasting relationships. Our dedicated support team is always here to ensure your satisfaction."
        }
    ];

    // Use configured values if they exist, otherwise use defaults
    const displayValues = (values && values.length > 0) ? values : defaultValues;

    return (
        <UserLayout>
            <div className="bg-background min-h-screen">
                {/* Hero Section */}
                <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroImage}
                            alt="About Hero"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>

                    <div className="relative z-10 container mx-auto px-6 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6"
                        >
                            {heroTitle}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light"
                        >
                            {heroSubtitle}
                        </motion.p>
                    </div>
                </div>

                {/* Dynamic Content Section */}
                <div className="container mx-auto px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto prose prose-xl dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary leading-relaxed"
                    >
                        <div className="whitespace-pre-wrap">{storyContent}</div>
                    </motion.div>
                </div>

                {/* Values Grid */}
                <div className="bg-secondary/30 py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Choose EliteBazar?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">We are more than just a marketplace. We are a community dedicated to excellence.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {displayValues.map((feature, index) => {
                                const IconComponent = iconMap[feature.icon] || Award;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <Card className="h-full border-none shadow-lg bg-background/50 backdrop-blur-sm hover:bg-background transition-colors duration-300">
                                            <CardContent className="p-8 text-center">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                                    <IconComponent className="w-6 h-6" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout >
    );
}
