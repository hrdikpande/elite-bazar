import UserLayout from '../../components/UserLayout';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function TermsPage() {
    return (
        <UserLayout>
            <div className="bg-background min-h-screen">
                {/* Header */}
                <div className="bg-secondary/30 py-16 border-b border-border">
                    <div className="container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary -rotate-3"
                        >
                            <FileText className="w-8 h-8" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Terms of Service</h1>
                        <p className="text-muted-foreground">Last updated: January 2026</p>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary">
                            <div className="p-6 bg-info/10 border border-info/20 rounded-xl mb-8 flex gap-4 items-start not-prose">
                                <AlertCircle className="w-6 h-6 text-info shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-info mb-1">Please Read Carefully</h4>
                                    <p className="text-sm text-foreground/80">These terms constitute a legally binding agreement between you and EliteBazar regarding your use of our website and services.</p>
                                </div>
                            </div>

                            <h3>1. Acceptance of Terms</h3>
                            <p>
                                By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>

                            <h3>2. Use License</h3>
                            <p>
                                Permission is granted to temporarily download one copy of the materials (information or software) on EliteBazar's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul>
                                <li>Modify or copy the materials;</li>
                                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                <li>Attempt to decompile or reverse engineer any software contained on EliteBazar's website;</li>
                                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                            </ul>

                            <h3>3. Disclaimer</h3>
                            <p>
                                The materials on EliteBazar's website are provided on an 'as is' basis. EliteBazar makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>

                            <h3>4. Limitation of Liability</h3>
                            <p>
                                In no event shall EliteBazar or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EliteBazar's website, even if EliteBazar or a EliteBazar authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>

                            <h3>5. Governing Law</h3>
                            <p>
                                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which EliteBazar operates and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
