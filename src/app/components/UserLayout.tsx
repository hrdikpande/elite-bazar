import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, Search, X, User as UserIcon, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useStore } from '../contexts/StoreContext';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '../../lib/utils';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { cart, products, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [...new Set(products.map(p => p.category))];
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle scroll effect for glassmorphism header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Premium Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "bg-background/80 backdrop-blur-md border-border py-3" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-heading font-black tracking-tighter text-foreground hover:opacity-80 transition-opacity">
              EliteBazar<span className="text-primary text-xs align-top">®</span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
              <Link
                to="/products"
                className={cn(
                  "hover:text-primary transition-colors relative group",
                  location.pathname === '/products' ? "text-primary" : "text-muted-foreground"
                )}
              >
                Start Shopping
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>
              </Link>
              {categories.slice(0, 3).map(category => (
                <Link
                  key={category}
                  to={`/products/${category.toLowerCase()}`}
                  className="text-muted-foreground hover:text-primary transition-colors capitalize"
                >
                  {category}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center border border-border rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-ring bg-secondary/50">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-xs ml-2 w-24 placeholder:text-muted-foreground focus:w-40 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </div>

              {/* Wishlist Icon */}
              <Link to={{ pathname: user ? "/profile" : "/login", search: user ? "?tab=wishlist" : "" }} className="relative group">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                  <Heart className="h-5 w-5 stroke-[1.5]" />
                </Button>
              </Link>

              {/* Profile/Login Icon */}
              {user ? (
                <Link to="/profile" className="relative group">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                    <UserIcon className="h-5 w-5 stroke-[1.5]" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="hidden md:block">
                  <Button variant="ghost" className="rounded-full hover:bg-secondary text-sm font-medium">
                    Login
                  </Button>
                </Link>
              )}

              <Link to="/cart" className="relative group">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
                  <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                  {cartItemsCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full ring-2 ring-background animate-in zoom-in spin-in"></span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-8 mt-12">
                    <Link to="/products" className="text-2xl font-heading font-bold">Shop All</Link>
                    {categories.map(category => (
                      <Link
                        key={category}
                        to={`/products/${category.toLowerCase()}`}
                        className="text-xl font-light capitalize text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with top padding for fixed header */}
      <main className="flex-1 pt-24">
        {children}
      </main>

      {/* Premium Footer - Static Dark Theme */}
      <footer className="bg-zinc-950 text-zinc-50 mt-24 pt-20 pb-10 border-t border-zinc-800">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-heading font-bold mb-6 tracking-tighter text-white">EliteBazar</h3>
              <p className="text-zinc-400 max-w-sm font-light leading-relaxed">
                Curating the finest digital and physical goods for the modern lifestyle.
                Quality, aesthetics, and performance in every product.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-medium tracking-wide text-sm uppercase text-zinc-500">Shop</h4>
              <ul className="space-y-4 text-sm font-light text-zinc-400">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/products/electronics" className="hover:text-white transition-colors">Electronics</Link></li>
                <li><Link to="/products/fashion" className="hover:text-white transition-colors">Fashion</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-medium tracking-wide text-sm uppercase text-zinc-500">Business</h4>
              <ul className="space-y-4 text-sm font-light text-zinc-400">
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
                <li><Link to="/distributor/login" className="hover:text-white transition-colors">Distributor Portal</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-medium tracking-wide text-sm uppercase text-zinc-500">Support</h4>
              <ul className="space-y-4 text-sm font-light text-zinc-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-900 text-xs text-zinc-500">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>&copy; {new Date().getFullYear()} EliteBazar Inc. All rights reserved.</p>
              <span className="hidden md:inline text-zinc-700">|</span>
              <a href="https://spotwebs.in/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors flex items-center gap-1 group">
                Maintained by <span className="font-bold text-white">Spotwebs</span>
              </a>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
