import { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Search, Eye, ShoppingCart, User as UserIcon } from 'lucide-react';

export default function AdminCustomers() {
    const { users, orders } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

    // Filter customers only (exclude admin/distributors from this view if desired, or show all with badges)
    const customers = users.filter(u => u.role === 'customer');

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getUserStats = (email: string) => {
        const userOrders = orders.filter(o => o.email === email);
        const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
        return { count: userOrders.length, totalSpent };
    };

    const selectedUserOrders = selectedUser
        ? orders.filter(o => o.email === selectedUser.username)
        : [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-medium tracking-tight">Customer Management</h2>
                <p className="text-muted-foreground">View and manage registered customers</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => {
                                    const stats = getUserStats(customer.username);
                                    return (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-muted p-2 rounded-full">
                                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="font-semibold text-foreground">{customer.name || 'Unknown Name'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{customer.username}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{customer.role}</Badge>
                                            </TableCell>
                                            <TableCell>{stats.count}</TableCell>
                                            <TableCell>₹{stats.totalSpent.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(customer)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    History
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No customers found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* User History Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order History: {selectedUser?.name}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {selectedUserOrders.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedUserOrders.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>₹{order.total.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12 text-zinc-500">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No orders placed by this customer yet.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
