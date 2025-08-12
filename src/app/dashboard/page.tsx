'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRuleBasedAuth, useRequireAuth } from '@/hooks/use-rule-based-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User, ShoppingCart, Package, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { productService } from '@/lib/product-service'
import { Product } from '@/types/database'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  user_type?: string
  location?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, signOut } = useRuleBasedAuth()
  const { isLoading } = useRequireAuth('/auth/signin')
  const [productCount, setProductCount] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isLoading, isAuthenticated, router])

  // Load user's products data
  useEffect(() => {
    if (user && user.userType === 'producer') {
      // Map demo user ID to product user ID format
      const productUserId = user.id === 'demo-producer-1' ? 'producer-demo-1' : user.id
      const userProducts = productService.getProductsByUserId(productUserId)
      setProductCount(userProducts.length)
      
      // Calculate total value of products
      const total = userProducts.reduce((sum, product) => {
        return sum + (product.price * product.availableQuantity)
      }, 0)
      setTotalValue(total)
      
      // Get recent products (latest 3)
      const recent = userProducts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
      setRecentProducts(recent)
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        toast.error('Error signing out')
        return
      }
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Error signing out')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const getUserTypeColor = (userType?: string) => {
    switch (userType) {
      case 'farmer': return 'bg-green-100 text-green-800'
      case 'buyer': return 'bg-blue-100 text-blue-800'
      case 'supplier': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Agri-Connect</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.userType)}`}>
                {user.userType || 'User'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.fullName || user.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Welcome to your Agri-Connect dashboard</p>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.fullName || 'Not set'}</div>
              <p className="text-xs text-muted-foreground">
                {user.location || 'Location not set'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productCount}</div>
              <p className="text-xs text-muted-foreground">
                {user?.userType === 'producer' ? 'Products listed' : 'Products available'}
              </p>
            </CardContent>
          </Card>

          {user?.userType === 'producer' ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">฿{totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total inventory value
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Unread messages
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {user?.userType === 'producer' && (
                <Button 
                  className="h-20 flex flex-col items-center justify-center space-y-2" 
                  variant="outline"
                  onClick={() => router.push('/my-products?view=add')}
                >
                  <Package className="h-6 w-6" />
                  <span className="text-sm">Add Product</span>
                </Button>
              )}
              <Button 
                className="h-20 flex flex-col items-center justify-center space-y-2" 
                variant="outline"
                onClick={() => router.push('/marketplace')}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm">{user?.userType === 'producer' ? 'View Marketplace' : 'Browse Products'}</span>
              </Button>
              {user?.userType === 'producer' && (
                <Button 
                  className="h-20 flex flex-col items-center justify-center space-y-2" 
                  variant="outline"
                  onClick={() => router.push('/my-products')}
                >
                  <Package className="h-6 w-6" />
                  <span className="text-sm">My Products</span>
                </Button>
              )}
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm">Messages</span>
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
                <User className="h-6 w-6" />
                <span className="text-sm">Edit Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Products for Producers */}
        {user?.userType === 'producer' && recentProducts.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>
                Your latest product listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{product.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.organic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.organic ? 'Organic' : 'Conventional'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">฿{product.price}/{product.unit}</span>
                      <span className="text-gray-500">{product.availableQuantity} {product.unit} available</span>
                    </div>
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/my-products')}
                >
                  View All Products
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Dashboard for Producers */}
        {user?.userType === 'producer' && (
          <div className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              <p className="text-gray-600">Track your business performance and insights</p>
            </div>
            <AnalyticsDashboard userId={user.id} />
          </div>
        )}

        {/* Coming Soon */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Features currently in development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Order Management</h3>
                <p className="text-sm text-gray-600">Track your orders and sales</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Real-time Chat</h3>
                <p className="text-sm text-gray-600">Communicate with buyers and sellers</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-sm text-gray-600">Detailed reports and forecasting</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Reviews & Ratings</h3>
                <p className="text-sm text-gray-600">Build trust through feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}