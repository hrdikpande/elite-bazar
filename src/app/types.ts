
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
    total: number;
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
    passwordHash?: string;
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
    updateDistributorPassword: (id: string, newPasswordHash: string) => void;
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
    updatePassword: (userId: string, newPassword: string) => Promise<boolean>;
    resetPasswordForEmail: (email: string) => Promise<boolean>;
    users: User[]; // Admin view of users
}
