import { useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import UserLayout from '../../components/UserLayout';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Heart, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '../../components/ui/badge';

export default function ProductListPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const { products, addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const [sortBy, setSortBy] = useState<string>('featured');
  const [filterCategory, setFilterCategory] = useState<string>(category || 'all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return sorted;
  }, [products, filterCategory, sortBy, searchQuery]);

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock !== 'out-of-stock') {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
  };

  return (
    <UserLayout>
      {/* Cinematic Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 z-0">
          {/* Abstract minimalistic background */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 to-foreground z-10" />
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2 }}
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070')] bg-cover bg-center"
          />
        </div>

        <div className="relative z-20 text-center space-y-4 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-medium tracking-tighter">
              {searchQuery ? 'Search Results' : 'The Collection'}
            </h1>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-muted font-light max-w-2xl mx-auto"
          >
            {searchQuery
              ? `Found ${filteredAndSortedProducts.length} results for "${searchQuery}"`
              : "Curated essentials for the modern lifestyle. Distinctive design, exceptional quality."}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Sticky Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-border/50">

          {/* Category Pills - Horizontal Scroll */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex items-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                    filterCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown - Minimalist */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden md:block">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 bg-background border-b border-border py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer text-foreground"
            >
              <option value="featured" className="bg-background text-foreground">Featured</option>
              <option value="price-low" className="bg-background text-foreground">Price: Low to High</option>
              <option value="price-high" className="bg-background text-foreground">Price: High to Low</option>
              <option value="name" className="bg-background text-foreground">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode='wait'>
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              {filteredAndSortedProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <motion.div key={product.id} variants={itemVariants}>
                    <Link to={`/product/${product.id}`} className="group block h-full">
                      {/* Image Container with Hover Effects */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-6">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                        {/* Badges */}
                        {product.stock === 'out-of-stock' && (
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-foreground text-background rounded-none uppercase text-xs tracking-wider">Sold Out</Badge>
                          </div>
                        )}
                        {product.stock === 'low-stock' && (
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 rounded-none uppercase text-xs tracking-wider">Low Stock</Badge>
                          </div>
                        )}

                        {/* Quick Actions - Slide Up on Hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10 flex gap-2">
                          <Button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.stock === 'out-of-stock'}
                            className="flex-1 bg-card text-foreground hover:bg-primary hover:text-primary-foreground rounded-none border border-transparent shadow-lg text-xs tracking-wide h-10 transition-all font-medium"
                          >
                            {product.stock === 'in-stock' ? (<><ShoppingBag className="w-3 h-3 mr-2" /> REQUICK ADD</>) : 'UNAVAILABLE'}
                          </Button>
                        </div>

                        {/* Wishlist Button - Always Visible but subtle */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id);
                            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                          }}
                          className={cn(
                            "absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-20",
                            isWishlisted
                              ? "bg-red-500/20 text-red-500 scale-100"
                              : "bg-black/20 text-transparent group-hover:bg-black/60 group-hover:text-white hover:scale-110"
                          )}
                        >
                          <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                        </button>
                      </div>

                      {/* Minimalist Product Info */}
                      <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-lg font-medium text-foreground group-hover:text-muted-foreground transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 font-light tracking-wide">
                          {product.category}
                        </p>
                        <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
                          <span className="text-lg font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
                          {/* Decorative Arrow that appears on hover */}
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <Search className="w-16 h-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-medium text-foreground mb-2">No matches found</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any products matching your filters. Try adjusting your search or category.
              </p>
              <Button onClick={() => { setFilterCategory('all'); setSortBy('featured'); }} variant="outline" className="rounded-none px-8">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UserLayout>
  );
}
