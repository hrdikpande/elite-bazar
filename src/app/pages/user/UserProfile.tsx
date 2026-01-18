import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore, Address, Product } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Package, Heart, MapPin, LogOut, Trash2, Plus, PenSquare, Gift, Lock, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export default function UserProfile() {
    const { user, logout, userOrders, wishlist, products, removeFromWishlist, addresses, addAddress, removeAddress, updateAddress, updatePassword } = useStore();
    const navigate = useNavigate();

    // Address Form State
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addrForm, setAddrForm] = useState({
        name: '', street: '', city: '', state: '', zip: '', phone: '', type: 'home' as 'home' | 'work' | 'other', isDefault: false
    });

    // Password Visibility State
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate('/');
        }
    };

    const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            updateAddress(editingAddress.id, addrForm);
            toast.success('Address updated');
        } else {
            addAddress(addrForm);
            toast.success('Address added');
        }
        setIsAddressDialogOpen(false);
        setEditingAddress(null);
        setAddrForm({ name: '', street: '', city: '', state: '', zip: '', phone: '', type: 'home', isDefault: false });
    };

    const openEditAddress = (addr: Address) => {
        setEditingAddress(addr);
        setAddrForm({
            name: addr.name, street: addr.street, city: addr.city, state: addr.state,
            zip: addr.zip, phone: addr.phone, type: addr.type, isDefault: addr.isDefault
        });
        setIsAddressDialogOpen(true);
    };

    if (!user) return null;

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-6">
                        <Card>
                            <CardContent className="p-6 text-center space-y-2">
                                <div className="w-20 h-20 bg-muted rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
                                    {user.name?.charAt(0) || user.username.charAt(0)}
                                </div>
                                <h2 className="font-bold text-lg">{user.name || 'User'}</h2>
                                <p className="text-sm text-muted-foreground">{user.username}</p>
                            </CardContent>
                        </Card>
                        <Button variant="outline" className="w-full border-red-200 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" /> Logout
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Tabs defaultValue="orders" className="space-y-6">
                            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
                                <TabsTrigger value="orders" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-medium text-base">
                                    Orders
                                </TabsTrigger>
                                <TabsTrigger value="wishlist" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-medium text-base">
                                    Wishlist ({wishlist.length})
                                </TabsTrigger>
                                <TabsTrigger value="addresses" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-medium text-base">
                                    Saved Addresses
                                </TabsTrigger>
                                <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 font-medium text-base">
                                    Security
                                </TabsTrigger>
                            </TabsList>

                            {/* ORDERS TAB */}
                            <TabsContent value="orders" className="space-y-6 pt-4">
                                {userOrders.length > 0 ? (
                                    userOrders.map(order => {
                                        const statusColors: Record<string, string> = {
                                            new: 'bg-secondary text-foreground',
                                            processing: 'bg-warning/15 text-warning',
                                            shipped: 'bg-info/15 text-info',
                                            delivered: 'bg-success/15 text-success',
                                        };
                                        const statusColor = statusColors[order.status.toLowerCase()] || 'bg-secondary text-foreground';

                                        return (
                                            <Card key={order.id} className="rounded-none border-border">
                                                <CardHeader className="bg-muted/30 py-4 flex flex-row items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold">Order #{order.id}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {order.spinReward && (
                                                            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 flex items-center">
                                                                <Gift className="w-3 h-3 mr-1" /> {order.spinReward}
                                                            </Badge>
                                                        )}
                                                        <Badge variant="outline" className={`uppercase ${statusColor}`}>{order.status}</Badge>
                                                        <span className="font-bold">₹{order.total.toLocaleString()}</span>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-6">
                                                    <div className="space-y-4">
                                                        {order.items.map(item => (
                                                            <div key={item.productId} className="flex items-center gap-4">
                                                                <div className="w-16 h-16 bg-muted">
                                                                    <ImageWithFallback src={item.product.image} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-sm">{item.product.name}</p>
                                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No orders yet. Start shopping!</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* WISHLIST TAB */}
                            <TabsContent value="wishlist" className="pt-4">
                                {wishlistedProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {wishlistedProducts.map(product => (
                                            <div key={product.id} className="group relative border border-border bg-card">
                                                <div className="aspect-[4/5] overflow-hidden bg-muted">
                                                    <ImageWithFallback src={product.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium">{product.name}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">₹{product.price.toLocaleString()}</p>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeFromWishlist(product.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Button className="w-full rounded-none" onClick={() => navigate(`/product/${product.id}`)}>View Product</Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Your wishlist is empty.</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* ADDRESSES TAB */}
                            <TabsContent value="addresses" className="pt-4 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Add New Button Card */}
                                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                                        <DialogTrigger asChild>
                                            <button className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[200px]"
                                                onClick={() => {
                                                    setEditingAddress(null);
                                                    setAddrForm({ name: '', street: '', city: '', state: '', zip: '', phone: '', type: 'home', isDefault: false });
                                                }}
                                            >
                                                <Plus className="w-8 h-8" />
                                                <span className="font-bold">Add New Address</span>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                                <div><Label>Full Name</Label><Input value={addrForm.name} onChange={e => setAddrForm(p => ({ ...p, name: e.target.value }))} required /></div>
                                                <div><Label>Street Address</Label><Input value={addrForm.street} onChange={e => setAddrForm(p => ({ ...p, street: e.target.value }))} required /></div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><Label>City</Label><Input value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} required /></div>
                                                    <div><Label>State</Label><Input value={addrForm.state} onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))} required /></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><Label>ZIP Code</Label><Input value={addrForm.zip} onChange={e => setAddrForm(p => ({ ...p, zip: e.target.value }))} required /></div>
                                                    <div><Label>Phone</Label><Input value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} required /></div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="default" checked={addrForm.isDefault} onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))} />
                                                    <Label htmlFor="default">Set as default address</Label>
                                                </div>
                                                <Button type="submit" className="w-full bg-primary text-primary-foreground">Save Address</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Address Cards */}
                                    {addresses.map(addr => (
                                        <div key={addr.id} className="border border-border p-6 rounded-lg relative group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="uppercase text-xs">{addr.type}</Badge>
                                                    {addr.isDefault && <Badge className="bg-primary text-primary-foreground">Default</Badge>}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditAddress(addr)}><PenSquare className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeAddress(addr.id)}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                            <h4 className="font-bold">{addr.name}</h4>
                                            <p className="text-muted-foreground text-sm mt-1">{addr.street}</p>
                                            <p className="text-muted-foreground text-sm">{addr.city}, {addr.state} - {addr.zip}</p>
                                            <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2"><MapPin className="w-3 h-3" /> {addr.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* SECURITY TAB */}
                            <TabsContent value="security" className="pt-4 max-w-xl">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Change Password</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const currentPass = (form.elements.namedItem('current-password') as HTMLInputElement).value;
                                            const newPass = (form.elements.namedItem('new-password') as HTMLInputElement).value;
                                            const confirmPass = (form.elements.namedItem('confirm-password') as HTMLInputElement).value;

                                            if (newPass !== confirmPass) {
                                                toast.error('New passwords do not match');
                                                return;
                                            }

                                            // Client-side password check removed as we don't store it.
                                            // Backend verification happens via Supabase re-auth flow if strictness needed.

                                            updatePassword(user.id, newPass);
                                            toast.success('Password updated successfully');
                                            form.reset();
                                        }} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Current Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="current-password"
                                                        name="current-password"
                                                        type={showCurrentPass ? "text" : "password"}
                                                        className="pl-10 pr-10"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">New Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="new-password"
                                                        name="new-password"
                                                        type={showNewPass ? "text" : "password"}
                                                        className="pl-10 pr-10"
                                                        required
                                                        minLength={6}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPass(!showNewPass)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="confirm-password"
                                                        name="confirm-password"
                                                        type={showConfirmPass ? "text" : "password"}
                                                        className="pl-10 pr-10"
                                                        required
                                                        minLength={6}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full bg-primary text-primary-foreground">Update Password</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </UserLayout >
    );
}
