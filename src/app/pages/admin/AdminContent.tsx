import { useState, useEffect } from 'react';
import { useStore, AboutPageConfig, ContactPageConfig, BannerItem } from '../../contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '../../components/ui/image-upload';
import { toast } from 'sonner';

export default function AdminContent() {
    const {
        banners, updateBanners,
        aboutPageConfig, updateAboutPageConfig,
        contactPageConfig, updateContactPageConfig
    } = useStore();

    const [newBanner, setNewBanner] = useState<Partial<BannerItem>>({ image: '', title: '', subtitle: '' });

    // About State
    const [aboutConfig, setAboutConfig] = useState<AboutPageConfig>(aboutPageConfig);

    // Contact State
    const [contactConfig, setContactConfig] = useState<ContactPageConfig>(contactPageConfig);

    useEffect(() => {
        setAboutConfig(aboutPageConfig);
        setContactConfig(contactPageConfig);
    }, [aboutPageConfig, contactPageConfig]);

    const handleAddBanner = () => {
        if (!newBanner.image || !newBanner.title) {
            toast.error("Image and Title are required");
            return;
        }

        const bannerToAdd: BannerItem = {
            id: Date.now().toString(),
            image: newBanner.image,
            title: newBanner.title,
            subtitle: newBanner.subtitle || '',
            link: '/products'
        };

        updateBanners([...banners, bannerToAdd]);
        setNewBanner({ image: '', title: '', subtitle: '' });
        toast.success('Banner added successfully');
    };

    const handleRemoveBanner = (id: string) => {
        const newBanners = banners.filter(b => b.id !== id);
        updateBanners(newBanners);
        toast.success('Banner removed');
    };

    const handleSaveAbout = () => {
        updateAboutPageConfig(aboutConfig);
        toast.success('About page content saved');
    };

    const handleSaveContact = () => {
        updateContactPageConfig(contactConfig);
        toast.success('Contact page content saved');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-medium tracking-tight">Content Management</h2>
                <p className="text-muted-foreground">Manage homepage banners and site content</p>
            </div>

            <Tabs defaultValue="banners" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="banners">Banners</TabsTrigger>
                    <TabsTrigger value="about">About Us</TabsTrigger>
                    <TabsTrigger value="contact">Contact Us</TabsTrigger>
                </TabsList>

                <TabsContent value="banners" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Homepage Banners</CardTitle>
                            <CardDescription>Add or remove promotional banners shown on the homepage.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
                                <h3 className="font-medium text-sm">Add New Banner</h3>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <ImageUpload
                                            value={newBanner.image}
                                            onChange={(val) => setNewBanner({ ...newBanner, image: val })}
                                            placeholder="Upload banner image"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Banner Title (e.g. SUMMER SALE)"
                                            value={newBanner.title}
                                            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Subtitle (e.g. Up to 50% off)"
                                            value={newBanner.subtitle}
                                            onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={handleAddBanner} disabled={!newBanner.image || !newBanner.title} type="button">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Banner
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {banners.map((banner, index) => (
                                    <div key={banner.id} className="group relative aspect-video bg-muted rounded-lg overflow-hidden border">
                                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                                            <h4 className="font-bold text-lg">{banner.title}</h4>
                                            <p className="text-sm text-gray-300">{banner.subtitle}</p>
                                            <Button variant="destructive" size="sm" className="mt-4" onClick={() => handleRemoveBanner(banner.id)}>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                        {/* Always visible label for admin context */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate group-hover:opacity-0 transition-opacity">
                                            {banner.title}
                                        </div>
                                    </div>
                                ))}
                                {banners.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
                                        <ImageIcon className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                        <p>No banners active. Add one to get started.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Us Settings</CardTitle>
                            <CardDescription>Manage hero section and main story content.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hero Image</label>
                                <ImageUpload
                                    value={aboutConfig.heroImage}
                                    onChange={(val) => setAboutConfig({ ...aboutConfig, heroImage: val })}
                                    placeholder="Upload hero image"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hero Title</label>
                                    <Input
                                        value={aboutConfig.heroTitle}
                                        onChange={(e) => setAboutConfig({ ...aboutConfig, heroTitle: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hero Subtitle</label>
                                    <Input
                                        value={aboutConfig.heroSubtitle}
                                        onChange={(e) => setAboutConfig({ ...aboutConfig, heroSubtitle: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Main Story Content</label>
                                <Textarea
                                    rows={8}
                                    value={aboutConfig.storyContent}
                                    onChange={(e) => setAboutConfig({ ...aboutConfig, storyContent: e.target.value })}
                                    placeholder="Enter your brand story..."
                                    className="font-mono text-sm"
                                />
                            </div>
                            <Button onClick={handleSaveAbout}>
                                <Save className="h-4 w-4 mr-2" />
                                Save About Settings
                            </Button>

                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-medium mb-4">Core Values</h3>
                                <div className="space-y-4">
                                    {(aboutConfig.values || []).map((val, idx) => (
                                        <div key={idx} className="grid gap-2 border p-4 rounded bg-muted/10 relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                                onClick={() => {
                                                    const newValues = [...(aboutConfig.values || [])];
                                                    newValues.splice(idx, 1);
                                                    setAboutConfig({ ...aboutConfig, values: newValues });
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    placeholder="Title (e.g. Premium Quality)"
                                                    value={val.title}
                                                    onChange={(e) => {
                                                        const newValues = [...(aboutConfig.values || [])];
                                                        newValues[idx].title = e.target.value;
                                                        setAboutConfig({ ...aboutConfig, values: newValues });
                                                    }}
                                                />
                                                <Select
                                                    value={val.icon}
                                                    onValueChange={(v) => {
                                                        const newValues = [...(aboutConfig.values || [])];
                                                        newValues[idx].icon = v;
                                                        setAboutConfig({ ...aboutConfig, values: newValues });
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Icon" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Award">Award</SelectItem>
                                                        <SelectItem value="Globe">Globe</SelectItem>
                                                        <SelectItem value="ShieldCheck">Shield</SelectItem>
                                                        <SelectItem value="Heart">Heart</SelectItem>
                                                        <SelectItem value="Zap">Zap</SelectItem>
                                                        <SelectItem value="Star">Star</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Textarea
                                                placeholder="Description"
                                                value={val.description}
                                                onChange={(e) => {
                                                    const newValues = [...(aboutConfig.values || [])];
                                                    newValues[idx].description = e.target.value;
                                                    setAboutConfig({ ...aboutConfig, values: newValues });
                                                }}
                                                rows={2}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const newValues = [...(aboutConfig.values || [])];
                                            newValues.push({ icon: 'Star', title: '', description: '' });
                                            setAboutConfig({ ...aboutConfig, values: newValues });
                                        }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Value
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Us Settings</CardTitle>
                            <CardDescription>Update contact details and hours.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Title</label>
                                <Input
                                    value={contactConfig.heroTitle}
                                    onChange={(e) => setContactConfig({ ...contactConfig, heroTitle: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Page Subtitle</label>
                                <Input
                                    value={contactConfig.heroSubtitle}
                                    onChange={(e) => setContactConfig({ ...contactConfig, heroSubtitle: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact Email</label>
                                    <Input
                                        value={contactConfig.email}
                                        onChange={(e) => setContactConfig({ ...contactConfig, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact Phone</label>
                                    <Input
                                        value={contactConfig.phone}
                                        onChange={(e) => setContactConfig({ ...contactConfig, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Address</label>
                                    <Input
                                        value={contactConfig.address}
                                        onChange={(e) => setContactConfig({ ...contactConfig, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Note</label>
                                <Textarea
                                    rows={4}
                                    value={contactConfig.note}
                                    onChange={(e) => setContactConfig({ ...contactConfig, note: e.target.value })}
                                    placeholder="A note to your customers..."
                                />
                            </div>

                            <Button onClick={handleSaveContact}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Contact Settings
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
