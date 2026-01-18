import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { hashPassword } from '../../../lib/security';
import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  LogOut,
  Eye,
  EyeOff,
  Package,
  Lock,
} from 'lucide-react';
import { useState } from 'react';
import { ThreeDBarChart } from '../../components/charts/ThreeDBarChart';
import { ThreeDPieChart } from '../../components/charts/ThreeDPieChart';

export default function DistributorDashboard() {
  const { user, logout, orders, distributors, updateDistributorPassword } = useStore();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  // Password Change State
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'distributor') {
      navigate('/distributor/login');
    }
  }, [user, navigate]);

  const distributor = distributors.find(d => d.id === user?.distributorId);

  const myOrders = useMemo(() => {
    if (!distributor) return [];
    return orders.filter(order => order.couponCode === distributor.couponCode);
  }, [orders, distributor]);

  const stats = useMemo(() => {
    const totalRevenue = myOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = myOrders.length > 0 ? totalRevenue / myOrders.length : 0;

    return {
      totalOrders: myOrders.length,
      totalRevenue,
      avgOrderValue,
    };
  }, [myOrders]);

  if (!user || user.role !== 'distributor' || !distributor) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/distributor/login');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      // In a real app, we'd verify currentPassword with backend. 
      // Here we just update to new hash.
      const newHash = await hashPassword(passwordForm.newPassword);
      updateDistributorPassword(distributor.id, newHash);
      toast.success("Password updated successfully");
      setIsPasswordOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '', showCurrent: false, showNew: false, showConfirm: false });
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const statusColors = {
    new: 'bg-secondary text-foreground',
    processing: 'bg-warning/15 text-warning',
    shipped: 'bg-info/15 text-info',
    delivered: 'bg-success/15 text-success',
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold text-primary">Distributor Portal</h1>
            <p className="text-sm text-muted-foreground">{distributor.name}</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current"
                        type={passwordForm.showCurrent ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {passwordForm.showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new"
                        type={passwordForm.showNew ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm(prev => ({ ...prev, showNew: !prev.showNew }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {passwordForm.showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm"
                        type={passwordForm.showConfirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordForm(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {passwordForm.showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout} className="border-border hover:bg-muted text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome */}
          <div>
            <h2 className="text-3xl font-heading font-bold mb-2">Welcome, {distributor.name}!</h2>
            <p className="text-muted-foreground">Track orders placed using your coupon code: <Badge variant="outline" className="ml-1 font-mono text-primary border-primary">{distributor.couponCode}</Badge></p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-primary/20 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Order Value</p>
                    <p className="text-3xl font-bold">₹{Math.round(stats.avgOrderValue).toLocaleString()}</p>
                  </div>
                  <div className="bg-muted p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ThreeDBarChart
              title="Revenue Trend"
              icon={TrendingUp}
              data={myOrders.slice(0, 7).map(o => ({
                date: new Date(o.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
                revenue: o.total
              }))} // showing last 7 orders effectively
              xKey="date"
              yKey="revenue"
              color="#2563EB"
              height={300}
            />

            <ThreeDPieChart
              title="Order Status Breakdown"
              icon={Package}
              data={Object.entries(myOrders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)).map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value
              }))}
              dataKey="value"
              nameKey="name"
              height={300}
            />
          </div>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {myOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">₹{order.total.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-semibold mb-2">No Orders Yet</p>
                  <p>Orders placed using your coupon code will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details Dialog */}
          <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Order ID</p>
                      <p className="font-mono font-semibold">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-semibold">{new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Customer Name</p>
                      <p className="font-semibold">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-semibold">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge className={statusColors[selectedOrder.status]}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-semibold uppercase">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map(item => (
                        <div key={item.productId} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
