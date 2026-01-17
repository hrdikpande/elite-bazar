import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Minus, Plus, ShoppingBag, ArrowLeft, Heart, Check } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Button asChild className="rounded-none">
            <Link to="/products">Back to Collection</Link>
          </Button>
        </div>
      </UserLayout>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-8 hover:bg-transparent px-0 hover:text-foreground">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Link>
        </Button>

        {/* Product Details - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="aspect-[4/5] bg-muted overflow-hidden relative group">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock === 'out-of-stock' && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-foreground text-background rounded-none uppercase tracking-widest py-2 px-3">
                    Sold Out
                  </Badge>
                </div>
              )}
            </div>
            {/* Thumbnails (Mock for now, could act as gallery) */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[product.image, product.image, product.image].map((src, i) => (
                <div key={i} className="w-20 h-24 bg-muted flex-shrink-0 cursor-pointer border border-transparent hover:border-foreground transition-colors">
                  <ImageWithFallback src={src} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8 py-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">{product.category}</p>
                <button onClick={toggleWishlist} className="group">
                  <Heart className={cn("w-6 h-6 transition-colors", isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground group-hover:text-foreground")} />
                </button>
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-medium text-foreground tracking-tight">{product.name}</h1>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-light text-foreground">₹{product.price.toLocaleString()}</span>
                {product.stock === 'low-stock' && (
                  <span className="text-sm font-medium text-warning bg-warning/10 px-2 py-1">Limited Availability</span>
                )}
              </div>
            </div>

            <div className="prose prose-invert text-muted-foreground leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="h-px bg-border" />

            {/* Actions */}
            {product.stock === 'out-of-stock' ? (
              <div className="p-4 bg-muted text-center text-muted-foreground">
                This item is currently unavailable.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted disabled:opacity-50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="flex-1 rounded-none h-14 text-base tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddToCart}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    ADD TO CART
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1 rounded-none h-14 text-base tracking-wide border-foreground text-foreground hover:bg-foreground hover:text-background" onClick={handleBuyNow}>
                    BUY NOW
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" /> <span>Authentic Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" /> <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" /> <span>Free Shipping &gt; ₹5000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" /> <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-8">
                <h3 className="text-lg font-medium mb-4 font-heading">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Desc */}
            {product.detailedDescription && (
              <div className="pt-4 space-y-2">
                <h3 className="text-lg font-medium font-heading">Product Details</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.detailedDescription}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-16">
            <h2 className="text-3xl font-heading font-medium mb-12 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {relatedProducts.map(relatedProduct => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="group block">
                  <div className="aspect-[4/5] bg-muted overflow-hidden mb-4 relative">
                    <ImageWithFallback
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm font-semibold text-foreground">₹{relatedProduct.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
