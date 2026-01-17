/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

// Types - Kept consistent with existing app to prevent breakage
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  detailedDescription: string;
  image: string;
  category: string;
  stock: 'in-stock' | 'out-of-stock' | 'low-stock';
  variants?: string[];
  specifications?: Record<string, string>;
}

export interface BannerItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  items: CartItem[];
  total: number; // Added this to match schema usage
  status: 'new' | 'processing' | 'shipped' | 'delivered';
  couponCode?: string;
  spinReward?: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
}

export interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  couponCode: string;
  isActive: boolean;
  passwordHash?: string; // Legacy comp.
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface User {
  id: string;
  username: string; // This is the email
  name?: string;
  role: 'admin' | 'distributor' | 'customer';
  distributorId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Reward {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

export interface AboutPageConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  storyContent: string;
  values: { icon: string; title: string; description: string }[];
}

export interface ContactPageConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  email: string;
  phone: string;
  address: string;
  hours: { days: string; active: string }[];
  note: string;
}

export interface StoreContextType {
  // Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Cart (Local State for now)
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders
  orders: Order[];
  userOrders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;

  // Distributors
  distributors: Distributor[];
  addDistributor: (distributor: Omit<Distributor, 'id' | 'passwordHash'> & { password?: string }) => Promise<void>;
  updateDistributor: (id: string, distributor: Partial<Distributor>) => Promise<void>;
  updateDistributorPassword: (id: string, newPasswordHash: string) => void; // Deprecated/No-op
  deleteDistributor: (id: string) => Promise<void>;
  getDistributorByCoupon: (couponCode: string) => Distributor | undefined;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Auth & Profile
  user: User | null;
  login: (username: string, password: string, role: 'admin' | 'distributor' | 'customer') => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  registerDistributor: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;


  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;

  // Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;

  // Content
  banners: BannerItem[];
  updateBanners: (banners: BannerItem[]) => Promise<void>;
  featuredProducts: string[];
  updateFeaturedProducts: (productIds: string[]) => void;

  // Deprecated simple strings
  aboutContent: string;
  updateAboutContent: (content: string) => void;
  contactContent: string;
  updateContactContent: (content: string) => void;

  // Detailed Configs
  aboutPageConfig: AboutPageConfig;
  updateAboutPageConfig: (config: AboutPageConfig) => Promise<void>;
  contactPageConfig: ContactPageConfig;
  updateContactPageConfig: (config: ContactPageConfig) => Promise<void>;

  // Spin Wheel
  spinWheelRewards: Reward[];
  addReward: (reward: Omit<Reward, 'id'>) => Promise<void>;
  removeReward: (id: string) => Promise<void>;
  updateSpinWheelRewards: (rewards: Reward[]) => void;

  // Password Management
  updatePassword: (userId: string, newPassword: string) => Promise<void>;
  users: User[]; // Admin view of users
}

// Defaults
const defaultContactConfig: ContactPageConfig = {
  heroImage: "",
  heroTitle: "Get in Touch",
  heroSubtitle: "We're here to help.",
  email: "support@elitebazar.com",
  phone: "+1 (555) 123-4567",
  address: "123 Fashion Ave",
  hours: [],
  note: "Contact us."
};

const defaultAboutConfig: AboutPageConfig = {
  heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
  heroTitle: "Our Story",
  heroSubtitle: "Redefining the art of modern commerce.",
  storyContent: "Welcome to EliteBazar.",
  values: []
};


export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Keep Cart Local for now
    try {
      return JSON.parse(localStorage.getItem('cart_v2') || '[]');
    } catch { return []; }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]); // Derived from profiles usually
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Admin view

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);

  // Content State
  const [aboutPageConfig, setAboutPageConfig] = useState<AboutPageConfig>(defaultAboutConfig);
  const [contactPageConfig, setContactPageConfig] = useState<ContactPageConfig>(defaultContactConfig);

  // Legacy strings compatibility
  const [aboutContent, setAboutContent] = useState<string>('Welcome to EliteBazar.');
  const [contactContent, setContactContent] = useState<string>('Contact us.');

  const [spinWheelRewards, setSpinWheelRewards] = useState<Reward[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const userOrders = orders.filter(order => {
    if (!user) return false;
    // Match by email if not linked by ID yet (legacy) or match by user_id logic if we had it
    return order.email === user.username;
  });
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // --- EFFECTS ---

  // 1. Initial Data Fetch (Public)
  useEffect(() => {
    fetchPublicData();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch extended profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            username: session.user.email!,
            name: profile.name,
            role: profile.role,
            distributorId: profile.distributorId
          });
          // Fetch user private data
          fetchUserData(session.user.id);
        } else {
          // Fallback if profile missing
          setUser({
            id: session.user.id,
            username: session.user.email!,
            role: 'customer'
          });
        }
      } else {
        setUser(null);
        setWishlist([]);
        setAddresses([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Persist Cart Local
  useEffect(() => { localStorage.setItem('cart_v2', JSON.stringify(cart)); }, [cart]);

  const fetchPublicData = async () => {
    try {
      // Products
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData) setProducts(prodData);

      // Banners
      const { data: bannerData } = await supabase.from('banners').select('*');
      if (bannerData) setBanners(bannerData);

      // Distributors (Public for verifying coupons)
      const { data: distData } = await supabase.from('distributors').select('*');
      if (distData) setDistributors(distData);

      // Rewards
      const { data: rewards } = await supabase.from('rewards').select('*');
      if (rewards) setSpinWheelRewards(rewards);

      // Configs
      const { data: configs } = await supabase.from('page_configs').select('*');
      if (configs) {
        configs.forEach((c: any) => {
          if (c.key === 'about') setAboutPageConfig(c.value);
          if (c.key === 'contact') setContactPageConfig(c.value);
        });
      }
    } catch (error) {
      console.error("Error fetching public data:", error);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Orders
      const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (orderData) setOrders(orderData as any);

      // Addresses
      const { data: addrData } = await supabase.from('addresses').select('*');
      if (addrData) setAddresses(addrData as any);

      // Wishlist
      const { data: wishData } = await supabase.from('wishlist').select('productId');
      if (wishData) setWishlist(wishData.map(w => w.productId));

      // If Admin, fetch profiles as customers
      const { data: profiles } = await supabase.from('profiles').select('*');
      if (profiles) {
        // Map profiles to customers/users for admin view
        const mappedUsers: User[] = profiles.map(p => ({
          id: p.id,
          username: p.email,
          name: p.name,
          role: p.role,
          distributorId: p.distributorId
        }));
        setUsers(mappedUsers);

        const mappedCustomers: Customer[] = profiles.filter(p => p.role === 'customer').map(p => ({
          id: p.id,
          name: p.name || 'Unnamed',
          email: p.email,
        }));
        setCustomers(mappedCustomers);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };


  // --- ACTIONS ---

  // Auth
  const login = async (username: string, password: string, role: 'admin' | 'distributor' | 'customer'): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error || !data.user) {
        console.error("Login failed:", error);
        const msg = error?.message || "Login failed";
        toast.error(msg);
        return { success: false, error: msg };
      }

      // Fetch profile to verify role match
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();

      if (profile) {
        // Strict Role Check
        if (role === 'admin' && profile.role !== 'admin') {
          toast.error("Unauthorized access to Admin Portal");
          await supabase.auth.signOut(); // Force logout
          return { success: false, error: "Unauthorized access" };
        }
        // Add similar checks for distributor if strict verification is needed
        if (role === 'distributor' && profile.role !== 'distributor') {
          toast.error("Unauthorized access to Distributor Portal");
          await supabase.auth.signOut();
          return { success: false, error: "Unauthorized access" };
        }
      }

      toast.success(`Welcome back!`);
      return { success: true };
    } catch (err: any) {
      toast.error("An unexpected error occurred during login");
      return { success: false, error: err.message };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'customer' // Default role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Create profile row manually if trigger doesn't exist (Safer for client-side setup)
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          name: name,
          role: 'customer'
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Non-blocking but good to know
        }

        return true;
      }
      return false;
    } catch (err) {
      toast.error("Registration failed");
      return false;
    }
  };

  const registerDistributor = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'distributor'
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // 1. Create Profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          name: name,
          role: 'distributor'
        });

        // 2. Create Distributor Entity
        const couponCode = name.substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
        const { error: distError } = await supabase.from('distributors').insert({
          id: `dist-${Date.now()}`,
          name,
          email,
          phone,
          couponCode,
          isActive: true // Auto-approve for demo
        });

        if (profileError || distError) {
          console.error("Distributor creation error:", profileError, distError);
          toast.warning("Account created but profile setup had issues. Please contact support.");
        } else {
          return true;
        }
      }
      return false;
    } catch (err) {
      toast.error("Distributor registration failed");
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.info("Logged out successfully");
  };


  // Products
  const addProduct = async (product: Product) => {
    const { error } = await supabase.from('products').insert(product);
    if (!error) {
      setProducts(prev => [...prev, product]);
      toast.success("Product added successfully");
    } else {
      toast.error("Failed to add product");
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    const { error } = await supabase.from('products').update(updatedProduct).eq('id', id);
    if (!error) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
      toast.success("Product updated");
    } else {
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product deleted");
    } else {
      toast.error("Failed to delete product");
    }
  };

  // Orders
  const addOrder = async (orderData: Omit<Order, 'id' | 'date'>): Promise<string | null> => {
    const newOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      user_id: user?.id
    };

    const { error } = await supabase.from('orders').insert({
      ...newOrder,
      items: orderData.items
    });

    if (!error) {
      setOrders(prev => [newOrder as Order, ...prev]);
      clearCart();
      return newOrder.id;
    } else {
      console.error("Order failed", error);
      toast.error("Failed to place order. Please try again.");
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order status updated to ${status}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
      toast.success("Order updated");
    } else {
      toast.error("Failed to update order");
    }
  };


  // Wishlist
  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    const { error } = await supabase.from('wishlist').insert({ user_id: user.id, productId });
    if (!error) {
      setWishlist(prev => [...prev, productId]);
      toast.success("Added to wishlist");
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    const { error } = await supabase.from('wishlist').delete().eq('user_id', user.id).eq('productId', productId);
    if (!error) {
      setWishlist(prev => prev.filter(id => id !== productId));
      toast.success("Removed from wishlist");
    }
  };


  // Addresses
  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddr = { ...address, id: `addr-${Date.now()}`, user_id: user.id };

    if (address.isDefault) {
      await supabase.from('addresses').update({ isDefault: false }).eq('user_id', user.id);
    }

    const { error } = await supabase.from('addresses').insert(newAddr);
    if (!error) {
      fetchUserData(user.id);
      toast.success("Address added");
    } else {
      toast.error("Failed to add address");
    }
  };

  const removeAddress = async (id: string) => {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (!error) {
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success("Address removed");
    } else {
      toast.error("Failed to remove address");
    }
  };

  const updateAddress = async (id: string, updated: Partial<Address>) => {
    const { error } = await supabase.from('addresses').update(updated).eq('id', id);
    if (!error) {
      fetchUserData(user?.id || '');
      toast.success("Address updated");
    } else {
      toast.error("Failed to update address");
    }
  };


  // Distributors
  const addDistributor = async (distributorData: Omit<Distributor, 'id' | 'passwordHash'> & { password?: string }) => {
    const newDist = {
      ...distributorData,
      id: `dist-${Date.now()}`,
      isActive: true
    };
    delete (newDist as any).password;

    const { error } = await supabase.from('distributors').insert(newDist);
    if (!error) {
      setDistributors(prev => [...prev, newDist as Distributor]);
      toast.success("Distributor added");
    } else {
      toast.error("Failed to add distributor");
    }
  };

  const updateDistributor = async (id: string, updated: Partial<Distributor>) => {
    const { error } = await supabase.from('distributors').update(updated).eq('id', id);
    if (!error) {
      setDistributors(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
      toast.success("Distributor updated");
    } else {
      toast.error("Failed to update distributor");
    }
  };

  const deleteDistributor = async (id: string) => {
    const { error } = await supabase.from('distributors').delete().eq('id', id);
    if (!error) {
      setDistributors(prev => prev.filter(d => d.id !== id));
      toast.success("Distributor deleted");
    } else {
      toast.error("Failed to delete distributor");
    }
  };

  const getDistributorByCoupon = (couponCode: string) => {
    return distributors.find(d => d.couponCode.toLowerCase() === couponCode.toLowerCase() && d.isActive);
  };

  // Customers/Profiles Admin
  const addCustomer = async (cust: Omit<Customer, 'id'>) => {
    console.warn("Adding customers manually via admin requires backend function.");
    toast.info("Feature requires backend implementation");
  };

  const updateCustomer = async (id: string, updated: Partial<Customer>) => {
    const { error } = await supabase.from('profiles').update(updated).eq('id', id);
    if (!error && user) {
      fetchUserData(user.id);
      toast.success("Customer profile updated");
    } else {
      toast.error("Failed to update customer");
    }
  };

  const deleteCustomer = async (id: string) => {
    console.warn("Deleting users requires backend function.");
    toast.info("Deleting users requires backend implementation");
  };


  // Cart (Local)
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
    // Toast handled by calling component
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    toast.success("Removed from cart");
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) removeFromCart(productId);
    else setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);


  // Banners & Content
  const updateBanners = async (newBanners: BannerItem[]) => {
    // console.log("Banner update not fully implemented in refactor yet");
    toast.info("Banner update partially implemented");
  };

  const updateAboutPageConfig = async (config: AboutPageConfig) => {
    const { error } = await supabase.from('page_configs').upsert({ key: 'about', value: config });
    if (!error) {
      setAboutPageConfig(config);
      toast.success("About page updated");
    } else {
      toast.error("Failed to update About page");
    }
  };

  const updateContactPageConfig = async (config: ContactPageConfig) => {
    const { error } = await supabase.from('page_configs').upsert({ key: 'contact', value: config });
    if (!error) {
      setContactPageConfig(config);
      toast.success("Contact page updated");
    } else {
      toast.error("Failed to update Contact page");
    }
  };

  // Spin Wheel
  const addReward = async (reward: Omit<Reward, 'id'>) => {
    const newReward = { ...reward, id: Date.now().toString() };
    const { error } = await supabase.from('rewards').insert(newReward);
    if (!error) {
      setSpinWheelRewards(prev => [...prev, newReward]);
      toast.success("Reward added");
    } else {
      toast.error("Failed to add reward");
    }
  };

  const removeReward = async (id: string) => {
    const { error } = await supabase.from('rewards').delete().eq('id', id);
    if (!error) {
      setSpinWheelRewards(prev => prev.filter(r => r.id !== id));
      toast.success("Reward removed");
    } else {
      toast.error("Failed to remove reward");
    }
  };

  // Stubs
  const updateDistributorPassword = () => { };
  const updatePassword = async (userId: string, newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      toast.success("Password updated successfully");
    } else {
      toast.error(error.message || "Failed to update password");
    }
  };
  const updateFeaturedProducts = () => { };
  const updateSpinWheelRewards = () => { };
  const updateAboutContent = () => { };
  const updateContactContent = () => { };


  const value: StoreContextType = {
    products, setProducts, addProduct, updateProduct, deleteProduct,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal,
    orders, userOrders, addOrder, updateOrderStatus, updateOrder,
    distributors, addDistributor, updateDistributor, updateDistributorPassword, deleteDistributor, getDistributorByCoupon,
    customers, addCustomer, updateCustomer, deleteCustomer,
    user, login, register, registerDistributor, logout,
    wishlist, addToWishlist, removeFromWishlist,
    addresses, addAddress, removeAddress, updateAddress,
    banners, updateBanners, featuredProducts, updateFeaturedProducts,
    aboutContent, updateAboutContent, contactContent, updateContactContent,
    aboutPageConfig, updateAboutPageConfig, contactPageConfig, updateContactPageConfig,
    spinWheelRewards, addReward, removeReward, updateSpinWheelRewards,
    users, updatePassword,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
