'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/database';
import { productService } from '@/lib/product-service';
import { useRuleBasedAuth } from '@/hooks/use-rule-based-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProductForm } from '@/components/products/ProductForm';
import AuthenticatedNavbar from '@/components/layout/AuthenticatedNavbar';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  TrendingUp,
  AlertCircle,
  Filter
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type ViewMode = 'list' | 'add' | 'edit';

export default function MyProductsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useRuleBasedAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/signin');
        return;
      }
      if (user.userType !== 'producer') {
        router.push('/dashboard');
        return;
      }
      loadProducts();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = productService.getAllProducts();
      // Filter products by current user
      const userProducts = allProducts.filter(product => product.userId === user?.id);
      setProducts(userProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleCreateProduct = async (productData: Partial<Product>) => {
    try {
      setIsSubmitting(true);
      const newProduct = productService.createProduct({
        ...productData,
        userId: user!.id
      } as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      
      setProducts(prev => [newProduct, ...prev]);
      setViewMode('list');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;

    try {
      setIsSubmitting(true);
      const updatedProduct = productService.updateProduct(editingProduct.id, productData);
      
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setViewMode('list');
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const success = productService.deleteProduct(productId);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setViewMode('edit');
  };

  const formatPrice = (price: number, unit: string) => {
    return `฿${price.toLocaleString()}/${unit}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold_out':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Available';
      case 'sold_out':
        return 'Sold Out';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-orange-100 text-orange-800',
      grains: 'bg-yellow-100 text-yellow-800',
      dairy: 'bg-blue-100 text-blue-800',
      meat: 'bg-red-100 text-red-800',
      herbs: 'bg-purple-100 text-purple-800',
      nuts: 'bg-amber-100 text-amber-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const stats = {
    total: products.length,
    available: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.status === 'sold_out').length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.availableQuantity), 0)
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'add') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavbar />
        <div className="py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setViewMode('list')}
              className="mb-4"
            >
              ← Back to My Products
            </Button>
          </div>
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setViewMode('list')}
            isLoading={isSubmitting}
          />
        </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'edit' && editingProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavbar />
        <div className="py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => {
                setViewMode('list');
                setEditingProduct(null);
              }}
              className="mb-4"
            >
              ← Back to My Products
            </Button>
          </div>
          <ProductForm
            product={editingProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => {
              setViewMode('list');
              setEditingProduct(null);
            }}
            isLoading={isSubmitting}
          />
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
              <p className="text-gray-600 mt-1">Manage your product listings</p>
            </div>
            <Button
              onClick={() => setViewMode('add')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">฿{stats.totalValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {products.length === 0 ? 'No products yet' : 'No products found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {products.length === 0 
                  ? 'Start by adding your first product to the marketplace.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {products.length === 0 && (
                <Button
                  onClick={() => setViewMode('add')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.images[0] || '/1284104.jpg'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/1284104.jpg';
                    }}
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                    <Badge className={getStatusColor(product.status)}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(product.price, product.unit)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{product.availableQuantity} {product.unit} available</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}