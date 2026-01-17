import { useStore } from '../../contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { ThreeDBarChart } from '../../components/charts/ThreeDBarChart';
import { ThreeDPieChart } from '../../components/charts/ThreeDPieChart';

export default function AdminOverview() {
  const { products, orders, distributors } = useStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter(p => p.stock === 'out-of-stock');

  // --- Mock Data for Charts ---

  // 1. Revenue Mock Data (Last 6 Months)
  const revenueData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
  ];

  // 2. Category Distribution Data
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  // Custom Cool Colors for Charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Distributors',
      value: distributors.filter(d => d.isActive).length,
      icon: Users,
      color: 'text-foreground',
      bgColor: 'bg-secondary',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
  ];

  const statusColors = {
    new: 'bg-secondary text-foreground',
    processing: 'bg-warning/15 text-warning',
    shipped: 'bg-info/15 text-info',
    delivered: 'bg-success/15 text-success',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-heading font-medium mb-2 tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- 3D CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 3D Bar Chart - Revenue */}
        <ThreeDBarChart
          title="Revenue Analytics (3D)"
          icon={DollarSign}
          data={revenueData}
          xKey="name"
          yKey="revenue"
          colors={COLORS}
        />

        {/* 3D-style Pie Chart - Category Distribution */}
        <ThreeDPieChart
          title="Category Distribution"
          icon={Package}
          data={pieData}
          dataKey="value"
          nameKey="name"
          colors={COLORS}
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 hover:bg-muted/50 p-2 rounded transition-colors cursor-pointer">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-primary">₹{order.total.toLocaleString()}</p>
                      <Badge className={statusColors[order.status]}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 hover:bg-muted/50 p-2 rounded transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant="destructive" className="animate-pulse">Out of Stock</Badge>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Package className="w-12 h-12 mb-2 opacity-20" />
                  <p>All products in stock</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
