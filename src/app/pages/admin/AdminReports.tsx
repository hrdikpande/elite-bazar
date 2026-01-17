import { useMemo } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import { ThreeDBarChart } from '../../components/charts/ThreeDBarChart';
import { ThreeDPieChart } from '../../components/charts/ThreeDPieChart';

export default function AdminReports() {
  const { products, orders, distributors } = useStore();

  const reports = useMemo(() => {
    // Sales by Date
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const salesByDate = last7Days.map(date => {
      const dayOrders = orders.filter(o => o.date.startsWith(date));
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      };
    });

    // Top Products
    const productSales = new Map<string, { product: typeof products[0], quantity: number, revenue: number }>();
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.productId) || {
          product: item.product,
          quantity: 0,
          revenue: 0,
        };
        productSales.set(item.productId, {
          product: item.product,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.product.price * item.quantity),
        });
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Distributor Performance
    const distributorStats = distributors.map(dist => {
      const distOrders = orders.filter(o => o.couponCode === dist.couponCode);
      return {
        distributor: dist,
        orderCount: distOrders.length,
        revenue: distOrders.reduce((sum, o) => sum + o.total, 0),
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Category Distribution
    const categoryStats = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryStats).map(([name, value]) => ({
      name,
      value,
    }));

    // Order Status Distribution
    const statusStats = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusStats).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      salesByDate,
      topProducts,
      distributorStats,
      categoryData,
      statusData,
      totalRevenue,
      avgOrderValue,
    };
  }, [products, orders, distributors]);

  // Unified Theme Palette for Charts (Sapphire, Violet, Green, Teal, Slate)
  const COLORS = ['#2563EB', '#8B5CF6', '#16A34A', '#0D9488', '#64748B'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-medium tracking-tight mb-2">Reports & Analytics</h2>
        <p className="text-muted-foreground">Comprehensive business insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{reports.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">₹{Math.round(reports.avgOrderValue).toLocaleString()}</p>
              </div>
              <div className="bg-primary/20 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="bg-secondary p-3 rounded-full">
                <Package className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Distributors</p>
                <p className="text-2xl font-bold">{distributors.filter(d => d.isActive).length}</p>
              </div>
              <div className="bg-muted p-3 rounded-full">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <ThreeDBarChart
          title="Sales Trend (Last 7 Days)"
          icon={TrendingUp}
          data={reports.salesByDate}
          xKey="date"
          yKey="sales"
          color="#2563EB"
          height={300}
        />

        {/* Category Distribution */}
        <ThreeDPieChart
          title="Product Categories"
          icon={Package}
          data={reports.categoryData}
          dataKey="value"
          nameKey="name"
          height={300}
        />
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.topProducts.map((item, index) => (
                <TableRow key={item.product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-semibold">{item.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.product.category}</TableCell>
                  <TableCell>{item.quantity} units</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{item.revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Distributor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Distributor Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Distributor</TableHead>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Revenue Generated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.distributorStats.map(stat => (
                <TableRow key={stat.distributor.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{stat.distributor.name}</p>
                      <p className="text-sm text-muted-foreground">{stat.distributor.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{stat.distributor.couponCode}</Badge>
                  </TableCell>
                  <TableCell>{stat.orderCount}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{stat.revenue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {reports.distributorStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No distributor orders yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
