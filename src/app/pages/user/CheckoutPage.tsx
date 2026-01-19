import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore, Address } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { ShoppingBag, CreditCard, Smartphone, Building2, Banknote, Tag, Plus, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';

export default function CheckoutPage() {
  const { cart, cartTotal, addOrder, clearCart, getDistributorByCoupon, user, addresses, addAddress } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: '',
    email: user?.username || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    couponCode: '',
    paymentMethod: 'upi' as 'upi' | 'card' | 'netbanking' | 'cod',
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [couponValid, setCouponValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Force redirect to login if not authenticated
    if (!user) {
      toast.error('Please login to continue checkout');
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  // Set default address if available and user is logged in
  useEffect(() => {
    if (user && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault);
      if (defaultAddr && !selectedAddressId) {
        setSelectedAddressId(defaultAddr.id);
        updateFormDataWithAddress(defaultAddr);
      }
    }
  }, [addresses, user]);

  const updateFormDataWithAddress = (addr: Address) => {
    setFormData(prev => ({
      ...prev,
      customerName: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip
    }));
  };

  const handleAddressSelect = (addrId: string) => {
    if (addrId === 'new') {
      setIsNewAddress(true);
      setSelectedAddressId('new');
      setFormData(prev => ({ ...prev, street: '', city: '', state: '', zip: '', phone: '', customerName: '' }));
    } else {
      setIsNewAddress(false);
      setSelectedAddressId(addrId);
      const addr = addresses.find(a => a.id === addrId);
      if (addr) updateFormDataWithAddress(addr);
    }
  };

  if (cart.length === 0) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </UserLayout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCouponCheck = () => {
    if (formData.couponCode.trim()) {
      const distributor = getDistributorByCoupon(formData.couponCode);
      setCouponValid(!!distributor);
      if (distributor) {
        toast.success(`Valid coupon code for distributor: ${distributor.name}`);
      } else {
        toast.error('Invalid coupon code');
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Reconstruct full address string for Order object
    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zip}`;

    if (!formData.customerName || !formData.phone || !formData.street || !formData.city || !formData.zip) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Strict Phone Validation (10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      setIsSubmitting(false);
      return;
    }

    // Strict ZIP Validation (6 digits)
    if (!/^\d{6}$/.test(formData.zip)) {
      toast.error('Please enter a valid 6-digit ZIP/PIN code');
      setIsSubmitting(false);
      return;
    }



    // Auto-save new address if user entered one and IS LOGGED IN
    if (user && isNewAddress) {
      addAddress({
        name: formData.customerName,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        type: 'home',
        isDefault: false
      });
    }

    const order = {
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      address: fullAddress,
      items: cart,
      total: cartTotal,
      status: 'new' as const,
      couponCode: formData.couponCode || undefined,
      paymentMethod: formData.paymentMethod,
    };

    const orderId = await addOrder(order);

    if (orderId) {
      toast.success('Order placed successfully!');
      navigate(`/order-success/${orderId}`);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <UserLayout>
      {/* Guest Login Hint */}


      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Address Selection - Only show Saved Addresses if logged in */}
              <Card>
                <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {user && addresses.length > 0 && (
                    <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect}>
                      {addresses.map(addr => (
                        <div key={addr.id} className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 ${selectedAddressId === addr.id ? 'border-primary bg-muted/50' : 'border-border'}`}>
                          <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                          <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
                            <div className="flex justify-between">
                              <span className="font-bold">{addr.name}</span>
                              <Badge variant="outline">{addr.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{addr.street}, {addr.city} {addr.zip}</p>
                            <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          </Label>
                        </div>
                      ))}
                      <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 ${selectedAddressId === 'new' ? 'border-primary bg-muted/50' : 'border-border'}`}>
                        <RadioGroupItem value="new" id="new_addr" />
                        <Label htmlFor="new_addr" className="flex-1 cursor-pointer flex items-center gap-2 font-medium">
                          <Plus className="w-4 h-4" /> Add New Address
                        </Label>
                      </div>
                    </RadioGroup>
                  )}

                  {/* Manual Input if New Address selected */}
                  {(isNewAddress) && (
                    <div className="space-y-4 pt-4 border-t border-border mt-4 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerName">Full Name *</Label>
                          <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} required />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile" required />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="street">Street Address *</Label>
                          <Input id="street" name="street" value={formData.street} onChange={handleInputChange} placeholder="Flat, House No., Building, Street" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                          </div>
                          <div>
                            <Label htmlFor="state">State *</Label>
                            <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="zip">ZIP / Pincode *</Label>
                          <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} maxLength={6} placeholder="6 digits" required />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Coupon Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Distributor Coupon Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Input
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={(e) => {
                        handleInputChange(e);
                        setCouponValid(null);
                      }}
                      placeholder="Enter coupon code (optional)"
                    />
                    <Button type="button" variant="outline" onClick={handleCouponCheck}>
                      Apply
                    </Button>
                  </div>
                  {couponValid === true && (
                    <p className="text-sm text-primary mt-2 flex items-center gap-1">
                      <Badge variant="default">Valid</Badge> Coupon code applied
                    </p>
                  )}
                  {couponValid === false && (
                    <p className="text-sm text-destructive mt-2">Invalid coupon code</p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData(prev => ({ ...prev, paymentMethod: value as typeof formData.paymentMethod }))
                    }
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 border-border">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-foreground" />
                          <span>UPI (Google Pay, PhonePe, Paytm)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 border-border">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-foreground" />
                          <span>Credit / Debit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 border-border">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="flex-1 cursor-pointer flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-foreground" />
                          <span>Net Banking</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 border-border">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-3">
                          <Banknote className="h-5 w-5 text-foreground" />
                          <span>Cash on Delivery</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-primary font-semibold">FREE</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-foreground">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>

        {/* Guest Login Prompt Dialog */}


      </div>
    </UserLayout>
  );
}
