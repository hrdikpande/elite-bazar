import { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Distributor } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

// Interface for the form props
interface DistributorFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    couponCode: string;
    isActive: boolean;

    password?: string;
    showPassword?: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    couponCode: string;
    isActive: boolean;

    password?: string;
    showPassword?: boolean;
  }>>;
  handleSubmit: (e: React.FormEvent) => void;
  editingDistributor: Distributor | null;
  onCancel: () => void;
}

const DistributorForm: React.FC<DistributorFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  editingDistributor,
  onCancel
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password {editingDistributor ? '(Leave blank to keep current)' : '*'}</Label>
        <div className="relative">
          <Input
            id="password"
            type={formData.showPassword ? "text" : "password"}
            value={formData.password || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required={!editingDistributor}
            placeholder={editingDistributor ? "********" : "Enter password"}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {formData.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="couponCode">Coupon Code *</Label>
        <Input
          id="couponCode"
          value={formData.couponCode}
          onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }))}
          placeholder="e.g., DIST2025"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">This code will be used by customers at checkout</p>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Active Status</Label>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {editingDistributor ? 'Update Distributor' : 'Add Distributor'}
        </Button>
        {editingDistributor && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};


export default function AdminDistributors() {
  const { distributors, addDistributor, updateDistributor, deleteDistributor } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    couponCode: string;
    isActive: boolean;

    password?: string;
    showPassword?: boolean;
  }>({
    name: '',
    email: '',
    phone: '',
    couponCode: '',
    isActive: true,

    password: '',
    showPassword: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.couponCode || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (editingDistributor) {
      if (formData.password && formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      updateDistributor(editingDistributor.id, formData);
      toast.success('Distributor updated successfully');
      setEditingDistributor(null);
    } else {
      if (!formData.password) {
        toast.error('Password is required for new distributors');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      await addDistributor(formData);
      toast.success('Distributor added successfully');
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      couponCode: '',
      isActive: true,

      password: '',
      showPassword: false,
    });
  };

  const handleEdit = (distributor: Distributor) => {
    setEditingDistributor(distributor);
    setFormData({
      name: distributor.name,
      email: distributor.email,
      phone: distributor.phone,
      couponCode: distributor.couponCode,
      isActive: distributor.isActive,
      password: '', // Password not filled for edit
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete distributor "${name}"?`)) {
      deleteDistributor(id);
      toast.success('Distributor deleted successfully');
    }
  };

  const toggleActive = (distributor: Distributor) => {
    updateDistributor(distributor.id, { isActive: !distributor.isActive });
    toast.success(`Distributor ${!distributor.isActive ? 'activated' : 'deactivated'}`);
  };

  /* Removed nested DistributorForm */

  const handleCancel = () => {
    setEditingDistributor(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading font-medium tracking-tight">Distributors Management</h2>
          <p className="text-muted-foreground">{distributors.length} total distributors</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Distributor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Distributor</DialogTitle>
            </DialogHeader>
            <DistributorForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              editingDistributor={editingDistributor}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDistributor} onOpenChange={(open) => !open && setEditingDistributor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Distributor</DialogTitle>
          </DialogHeader>
          <DistributorForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            editingDistributor={editingDistributor}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Distributors Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributors.map(distributor => (
                <TableRow key={distributor.id}>
                  <TableCell className="font-semibold">{distributor.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{distributor.email}</p>
                      <p className="text-muted-foreground">{distributor.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{distributor.couponCode}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={distributor.isActive}
                        onCheckedChange={() => toggleActive(distributor)}
                      />
                      <Badge variant={distributor.isActive ? 'default' : 'secondary'}>
                        {distributor.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(distributor)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(distributor.id, distributor.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
