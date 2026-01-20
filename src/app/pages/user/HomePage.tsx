import { Link } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore } from '../../contexts/StoreContext';
import { Product } from '../../types';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowRight, Heart } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from "motion/react";
import HeroCarousel from '../../components/HeroCarousel';


export default function HomePage() {
  const { products, featuredProducts, wishlist, addToWishlist, removeFromWishlist, banners } = useStore();

  const featured = products.filter(p => featuredProducts.includes(p.id)).slice(0, 4);
  const categories = [...new Set(products.map(p => p.category))];

  // Bento Grid Layout Helpers
  const getBentoSpan = (index: number) => {
    // Pattern: Large, Small, Small | Small, Large, Small ...
    const pattern = index % 4;
    if (pattern === 0) return "md:col-span-2 md:row-span-2";
    return "md:col-span-1 md:row-span-1";
  };

  // Curated Images for Categories
  const categoryImages: Record<string, string> = {
    'Timepieces': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
    'Travel': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    'Apparel': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop',
    'Accessories': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
    'Footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    'Home': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
    'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
    'Beauty': 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop',
    'Fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
    'Jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb05220c?q=80&w=1000&auto=format&fit=crop',
    'Wellness': 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=1000&auto=format&fit=crop',
  };

  return (
    <UserLayout>


      {/* 1. Cinematic Hero Carousel */}
      <HeroCarousel banners={banners} />

      {/* 2. Bento Grid Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-heading font-bold tracking-tighter text-foreground">Shop by Category</h2>
            <Link to="/products" className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground transition-colors text-foreground">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4">
            {categories.slice(0, 5).map((category, idx) => (
              <Link
                key={category}
                to={`/products/${category.toLowerCase()}`}
                className={cn(
                  "relative group overflow-hidden bg-muted",
                  getBentoSpan(idx)
                )}
              >
                <ImageWithFallback
                  src={categoryImages[category] || `https://source.unsplash.com/random/800x800?${category},fashion`}
                  alt={category}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold uppercase tracking-wide">{category}</h3>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 inline-block mt-2 border-b border-white">Explore</span>
                </div>
              </Link>
            ))}
            {/* "All" card if we run out of cats or just to fill grid */}
            <Link
              to="/products"
              className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-primary flex items-center justify-center"
            >
              <div className="text-center p-6">
                <span className="block text-primary-foreground text-lg font-medium mb-2">Discover More</span>
                <div className="w-8 h-8 rounded-full border border-primary-foreground/30 flex items-center justify-center mx-auto group-hover:bg-primary-foreground group-hover:text-primary transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. New Arrivals - Horizontal Scroll / Slider Vibe */}
      <section className="py-24 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-heading font-bold tracking-tighter mb-12 text-center text-foreground">New Arrivals</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product, i) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/product/${product.id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-card mb-4 border border-border/50">
                      {product.stock === 'low-stock' && (
                        <Badge className="absolute top-2 left-2 z-10 bg-amber-500 text-white rounded-none text-[10px] px-2 py-0.5 uppercase tracking-wide">
                          Low Stock
                        </Badge>
                      )}
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Quick Add Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Quick View</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id);
                          toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                        }}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500 text-red-500" : "text-foreground")} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-foreground group-hover:text-muted-foreground transition-colors truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm font-bold text-foreground">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="rounded-none border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors px-8">
              <Link to="/products">View Entire Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Editorial / Brand Story */}
      <section className="py-32 bg-secondary text-foreground relative overflow-hidden">

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 tracking-tighter text-foreground">THE CRAFTSMANSHIP</h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            We believe in the power of good design. Every piece is curated to ensure the highest quality, tailored for those who appreciate the finer details in life.
          </p>
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            <span>Sustainable Sourcing</span>
            <span>•</span>
            <span>Artisan Made</span>
            <span>•</span>
            <span>Timeless Design</span>
          </div>
        </div>
      </section>
    </UserLayout>
  );
}
