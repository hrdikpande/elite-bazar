import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './contexts/StoreContext';
import { Toaster } from './components/ui/sonner';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// User Portal Pages
const HomePage = lazy(() => import('./pages/user/HomePage'));
const ProductListPage = lazy(() => import('./pages/user/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/user/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/user/CartPage'));
const CheckoutPage = lazy(() => import('./pages/user/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/user/OrderSuccessPage'));

const UserLogin = lazy(() => import('./pages/user/UserLogin'));
const UserRegister = lazy(() => import('./pages/user/UserRegister'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const UpdatePassword = lazy(() => import('./pages/auth/UpdatePassword'));
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const AboutPage = lazy(() => import('./pages/user/AboutPage'));
const ContactPage = lazy(() => import('./pages/user/ContactPage'));
const FaqPage = lazy(() => import('./pages/user/FaqPage'));
const PrivacyPage = lazy(() => import('./pages/user/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/user/TermsPage'));

// Admin Portal Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const EmailTemplates = lazy(() => import('./pages/admin/EmailTemplates'));

// Distributor Portal Pages
const DistributorLogin = lazy(() => import('./pages/distributor/DistributorLogin'));
const DistributorRegister = lazy(() => import('./pages/distributor/DistributorRegister'));
const DistributorDashboard = lazy(() => import('./pages/distributor/DistributorDashboard'));
import ThemeManager from './components/ThemeManager';



import IntroOverlay from './components/IntroOverlay';
import ScrollToTop from './components/ScrollToTop';

// Loading Fallback
const PageLoader = () => (
  <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-background text-primary">
    <Loader2 className="w-10 h-10 animate-spin mb-4" />
    <p className="text-sm font-medium tracking-widest uppercase animate-pulse">Loading EliteBazar...</p>
  </div>
);

import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

// ... (imports remain)

export default function App() {
  return (
    <StoreProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <ThemeManager />
          <IntroOverlay />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* User Portal Routes - Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:category" element={<ProductListPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />

              {/* User Portal Routes - Protected */}
              <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'distributor']} />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                <Route path="/profile" element={<UserProfile />} />
              </Route>

              {/* User Account Routes */}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />

              {/* Static Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>

              {/* Distributor Portal Routes */}
              <Route path="/distributor/login" element={<DistributorLogin />} />
              <Route path="/distributor/register" element={<DistributorRegister />} />
              <Route element={<ProtectedRoute allowedRoles={['distributor']} />}>
                <Route path="/distributor/*" element={<DistributorDashboard />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster />
        </BrowserRouter>
      </ErrorBoundary>
    </StoreProvider>
  );
}
