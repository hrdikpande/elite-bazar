import { Link, useNavigate } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-8">Add some products to get started!</p>
              <Button asChild size="lg">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <Card key={item.productId}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                      <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.productId}`}>
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.product.description}</p>
                      <p className="text-2xl font-bold text-foreground">₹{item.product.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col items-end gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Subtotal: <span className="font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-success font-semibold">FREE</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-foreground">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>

                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
