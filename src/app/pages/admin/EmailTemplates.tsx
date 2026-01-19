import { useState, useEffect } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { Save, RefreshCw, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '../../../lib/supabase';

interface TemplateData {
    subject: string;
    body: string;
}

interface TemplateRecord {
    type: string;
    subject: string;
    body: string;
}

export default function EmailTemplates() {
    const { } = useStore();
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState<Record<string, TemplateData>>({
        'order_confirmation': { subject: 'Order Confirmation #{order_id}', body: 'Thank you for your order...' },
        'welcome_email': { subject: 'Welcome to EliteBazar', body: 'We are glad to have you...' }
    });

    // Fetch templates from DB (Simulated or Real)
    useEffect(() => {
        const fetchTemplates = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('email_templates').select('*');
            if (data && data.length > 0) {
                const newTemplates = { ...templates };
                (data as TemplateRecord[]).forEach((t) => {
                    newTemplates[t.type] = { subject: t.subject, body: t.body };
                });
                setTemplates(newTemplates);
            }
            setLoading(false);
        };

        fetchTemplates();
    }, [supabase]);

    const handleSave = async (type: string) => {
        setLoading(true);
        const template = templates[type];

        const { error } = await supabase.from('email_templates').upsert({
            type,
            subject: template.subject,
            body: template.body,
            updated_at: new Date().toISOString()
        }, { onConflict: 'type' });

        if (error) {
            toast.error('Failed to save template: ' + error.message);
        } else {
            toast.success('Template saved successfully');
        }
        setLoading(false);
    };

    const handleChange = (type: string, field: 'subject' | 'body', value: string) => {
        setTemplates(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
                    <p className="text-muted-foreground">Customize the automated emails sent to users.</p>
                </div>
            </div>

            <Tabs defaultValue="order_confirmation" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="order_confirmation">Order Confirmation</TabsTrigger>
                    <TabsTrigger value="welcome_email">Welcome Email</TabsTrigger>
                </TabsList>

                {Object.entries(templates).map(([type, template]) => (
                    <TabsContent key={type} value={type} className="space-y-4 pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="capitalize">{type.replace('_', ' ')} Template</CardTitle>
                                <CardDescription>
                                    Available variables: {type === 'order_confirmation' ? '{order_id}, {customer_name}, {total}' : '{name}'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Subject Line</Label>
                                    <Input
                                        value={template.subject}
                                        onChange={(e) => handleChange(type, 'subject', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Body (HTML supported)</Label>
                                    <Textarea
                                        className="min-h-[300px] font-mono text-sm"
                                        value={template.body}
                                        onChange={(e) => handleChange(type, 'body', e.target.value)}
                                    />
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <Button onClick={() => handleSave(type)} disabled={loading}>
                                        {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" /> Save Template
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
