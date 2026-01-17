import UserLayout from '../../components/UserLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Input } from '../../components/ui/input';
import { Search, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FaqPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: "Orders & Shipping",
            items: [
                {
                    question: "How can I track my order?",
                    answer: "Once your order is shipped, you will receive a tracking number via email. You can also view your order status in the 'My Orders' section of your profile."
                },
                {
                    question: "Do you ship internationally?",
                    answer: "Yes, we ship to select international locations. Shipping rates and delivery times vary depending on the destination."
                },
                {
                    question: "Can I change my shipping address?",
                    answer: "If your order has not been shipped yet, you can contact our support team to update your address. Once shipped, we cannot change the destination."
                }
            ]
        },
        {
            category: "Returns & Refunds",
            items: [
                {
                    question: "What is your return policy?",
                    answer: "We offer a 30-day return policy for all unused items in their original packaging. Please contact our support team to initiate a return."
                },
                {
                    question: "How long do refunds take?",
                    answer: "Refunds are processed within 5-7 business days after we receive your return. The amount will be credited back to your original payment method."
                }
            ]
        },
        {
            category: "Payments & Discounts",
            items: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept Visa, MasterCard, American Express, PayPal, and UPI payments."
                },
                {
                    question: "How do I use a discount code?",
                    answer: "You can enter your discount code at checkout in the 'Promo Code' field. The discount will be applied to your total immediately."
                }
            ]
        }
    ];

    const filteredFaqs = faqs.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <UserLayout>
            <div className="bg-background min-h-screen">
                {/* Hero Header */}
                <div className="bg-secondary/30 py-20 text-center">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">How can we help?</h1>
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search for answers..."
                                    className="pl-12 h-12 text-lg bg-background shadow-md border-transparent focus:border-primary transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* FAQ Content */}
                <div className="container mx-auto px-6 py-16">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((category, catIndex) => (
                                <motion.div
                                    key={catIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: catIndex * 0.1 }}
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                                        {category.category}
                                    </h2>
                                    <Accordion type="single" collapsible className="w-full space-y-4">
                                        {category.items.map((faq, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`item-${catIndex}-${index}`}
                                                className="border border-border rounded-xl px-4 bg-card/50 hover:bg-card transition-colors"
                                            >
                                                <AccordionTrigger className="text-lg font-medium hover:no-underline py-4">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground pb-4 text-base leading-relaxed">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                No results found for "{searchQuery}". Try a different search term.
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-primary text-primary-foreground py-16">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-heading font-bold mb-4">Still have questions?</h2>
                        <p className="mb-8 opacity-90">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-primary bg-background rounded-full hover:bg-secondary transition-colors"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
