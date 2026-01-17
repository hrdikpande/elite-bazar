import { useState } from 'react';
import { useStore, Product } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Pencil, Trash2, Search, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';


interface ProductFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  onCancel: () => void;
}

const ProductForm = ({ formData, setFormData, handleSubmit, isEditing, onCancel }: ProductFormProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData((prev: any) => ({ ...prev, image: result }));
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., Electronics"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Short Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="detailedDescription">Detailed Description</Label>
        <Textarea
          id="detailedDescription"
          value={formData.detailedDescription}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, detailedDescription: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <Label className="mb-2 block">Product Image *</Label>

        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            } ${formData.image ? 'border-none p-0 overflow-hidden' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {formData.image ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData((prev: any) => ({ ...prev, image: '' }));
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          )}
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>

        {/* Fallback URL Input */}
        <div className="mt-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground uppercase font-bold">
              OR
            </span>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, image: e.target.value }))}
              placeholder="Paste Image URL directly..."
              className="pl-12"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="stock">Stock Status</Label>
        <Select value={formData.stock} onValueChange={(value: any) => setFormData((prev: any) => ({ ...prev, stock: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Availability</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
        {isEditing && (
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


export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    detailedDescription: '',
    image: '',
    category: '',
    stock: 'in-stock' as 'in-stock' | 'out-of-stock' | 'low-stock',
  });

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error('Please fill all required fields, including Product Image');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      image: formData.image || `https://images.unsplash.com/photo-${Date.now()}?w=400&h=400`,
      specifications: {
        Brand: 'Premium Brand',
        Warranty: '1 Year',
      },
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully');
      setEditingProduct(null);
    } else {
      addProduct({
        id: `product-${Date.now()}`,
        ...productData,
      });
      toast.success('Product added successfully');
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      detailedDescription: '',
      image: '',
      category: '',
      stock: 'in-stock',
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      detailedDescription: product.detailedDescription,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success('Product deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-heading font-medium tracking-tight">Products Management</h2>
          <p className="text-muted-foreground">{products.length} total products</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              isEditing={false}
              onCancel={() => { }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isEditing={true}
            onCancel={() => {
              setEditingProduct(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      product.stock === 'in-stock' ? 'default' :
                        product.stock === 'low-stock' ? 'warning' : 'secondary'
                    }>
                      {product.stock === 'in-stock' ? 'In Stock' :
                        product.stock === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(product.id, product.name)}
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
