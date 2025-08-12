'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { productService } from '@/lib/product-service'
import { Product } from '@/types/database'
import { TrendingUp, TrendingDown, DollarSign, Package, Eye, ShoppingCart } from 'lucide-react'

interface AnalyticsDashboardProps {
  userId: string
}

interface ProductAnalytics {
  totalProducts: number
  totalValue: number
  averagePrice: number
  organicPercentage: number
  topCategory: string
  recentViews: number
  potentialSales: number
}

interface SalesMetrics {
  thisMonth: number
  lastMonth: number
  growth: number
  topSellingProduct: string
}

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null)
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Convert demo user ID to product user ID format
        const productUserId = userId.replace('demo-', '').replace('-1', '-demo-1')
        const userProducts = productService.getProductsByUserId(productUserId)
        setProducts(userProducts)

        if (userProducts.length > 0) {
          // Calculate product analytics
          const totalValue = userProducts.reduce((sum, product) => 
            sum + (product.price * product.availableQuantity), 0
          )
          
          const averagePrice = userProducts.reduce((sum, product) => 
            sum + product.price, 0
          ) / userProducts.length
          
          const organicCount = userProducts.filter(p => p.organic).length
          const organicPercentage = (organicCount / userProducts.length) * 100
          
          // Find most common category
          const categoryCount = userProducts.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          
          const topCategory = Object.entries(categoryCount)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
          
          // Mock metrics for demonstration
          const recentViews = Math.floor(Math.random() * 500) + 100
          const potentialSales = Math.floor(totalValue * 0.3)
          
          setAnalytics({
            totalProducts: userProducts.length,
            totalValue,
            averagePrice,
            organicPercentage,
            topCategory,
            recentViews,
            potentialSales
          })
          
          // Mock sales metrics
          const thisMonth = Math.floor(Math.random() * 50000) + 10000
          const lastMonth = Math.floor(Math.random() * 45000) + 8000
          const growth = ((thisMonth - lastMonth) / lastMonth) * 100
          
          setSalesMetrics({
            thisMonth,
            lastMonth,
            growth,
            topSellingProduct: userProducts[0]?.title || 'N/A'
          })
        }
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics || !salesMetrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No analytics data available. Start by adding some products!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">฿{salesMetrics.thisMonth.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              {salesMetrics.growth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${
                salesMetrics.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(salesMetrics.growth).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold">฿{analytics.totalValue.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {analytics.totalProducts} products listed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold">{analytics.recentViews}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Potential Sales</p>
                <p className="text-2xl font-bold">฿{analytics.potentialSales.toLocaleString()}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Based on current inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Portfolio</CardTitle>
            <CardDescription>Overview of your product listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Price</span>
                <span className="font-semibold">฿{analytics.averagePrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Organic Products</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{analytics.organicPercentage.toFixed(1)}%</span>
                  <Badge variant={analytics.organicPercentage > 50 ? 'default' : 'secondary'}>
                    {analytics.organicPercentage > 50 ? 'High' : 'Low'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Top Category</span>
                <Badge variant="outline">{analytics.topCategory}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Best Seller</span>
                <span className="font-semibold text-sm">{salesMetrics.topSellingProduct}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
            <CardDescription>Monthly performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">This Month</p>
                  <p className="text-lg font-bold">฿{salesMetrics.thisMonth.toLocaleString()}</p>
                </div>
                <Badge variant="default">Current</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Last Month</p>
                  <p className="text-lg font-bold">฿{salesMetrics.lastMonth.toLocaleString()}</p>
                </div>
                <Badge variant="secondary">Previous</Badge>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Growth Rate</span>
                  <div className="flex items-center gap-2">
                    {salesMetrics.growth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`font-bold ${
                      salesMetrics.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {salesMetrics.growth >= 0 ? '+' : ''}{salesMetrics.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Your highest value products by inventory worth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products
              .sort((a, b) => (b.price * b.availableQuantity) - (a.price * a.availableQuantity))
              .slice(0, 5)
              .map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">฿{(product.price * product.availableQuantity).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{product.availableQuantity} {product.unit}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Actions to improve your business performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📈 Increase Visibility</h3>
              <p className="text-sm text-gray-600 mb-3">
                Add more product photos and detailed descriptions to attract more buyers.
              </p>
              <Button size="sm" variant="outline">Update Products</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🌱 Promote Organic</h3>
              <p className="text-sm text-gray-600 mb-3">
                {analytics.organicPercentage < 50 
                  ? 'Consider adding more organic products to increase premium pricing.'
                  : 'Great organic portfolio! Highlight this in your marketing.'
                }
              </p>
              <Button size="sm" variant="outline">View Strategy</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">💰 Optimize Pricing</h3>
              <p className="text-sm text-gray-600 mb-3">
                Review competitor pricing to ensure your products are competitively priced.
              </p>
              <Button size="sm" variant="outline">Price Analysis</Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📦 Inventory Management</h3>
              <p className="text-sm text-gray-600 mb-3">
                Monitor stock levels and update availability to prevent overselling.
              </p>
              <Button size="sm" variant="outline">Manage Stock</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}