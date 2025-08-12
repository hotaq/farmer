'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/database';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductSearch, ProductFilters } from '@/components/products/ProductSearch';
import { productService } from '@/lib/product-service';
import { useRuleBasedAuth } from '@/hooks/use-rule-based-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, TrendingUp, Users, Package } from 'lucide-react';
import AuthenticatedNavbar from '@/components/layout/AuthenticatedNavbar';
import Link from 'next/link';

export default function MarketplacePage() {
  const { user } = useRuleBasedAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = productService.getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, activeFilters);
  };

  const handleFilter = (filters: ProductFilters) => {
    setActiveFilters(filters);
    applyFilters(searchQuery, filters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilters({});
    setFilteredProducts(products);
  };

  const applyFilters = (query: string, filters: ProductFilters) => {
    let filtered = products;

    // Apply search query
    if (query.trim()) {
      filtered = productService.searchProducts(query);
    }

    // Apply filters
    filtered = productService.getFilteredProducts({
      ...filters,
      // If we have a search query, start with search results
      ...(query.trim() ? {} : {})
    }).filter(product => {
      if (query.trim()) {
        const lowercaseQuery = query.toLowerCase();
        return (
          product.title.toLowerCase().includes(lowercaseQuery) ||
          product.description.toLowerCase().includes(lowercaseQuery) ||
          product.category.toLowerCase().includes(lowercaseQuery) ||
          product.location.toLowerCase().includes(lowercaseQuery)
        );
      }
      return true;
    });

    setFilteredProducts(filtered);
  };

  const stats = {
    totalProducts: products.length,
    categories: new Set(products.map(p => p.category)).size,
    producers: new Set(products.map(p => p.userId)).size,
    organicProducts: products.filter(p => p.organic).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Marketplace</h1>
              <p className="text-gray-600 mt-1">Discover fresh, quality agricultural products</p>
            </div>
            {user?.userType === 'producer' && (
              <Link href="/dashboard/products/new">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Package className="h-4 w-4 mr-2" />
                  List Product
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Producers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.producers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Organic Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.organicProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductSearch
              onSearch={handleSearch}
              onFilter={handleFilter}
              onClearFilters={handleClearFilters}
            />
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-gray-600">
            {loading ? (
              'Loading products...'
            ) : (
              `Showing ${filteredProducts.length} of ${products.length} products`
            )}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          emptyMessage="No products match your search criteria"
        />
      </div>
    </div>
  );
}