'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, User } from '@/types/database';
import { productService } from '@/lib/product-service';
import { useRuleBasedAuth } from '@/hooks/use-rule-based-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedNavbar from '@/components/layout/AuthenticatedNavbar';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Package, 
  Leaf, 
  MessageCircle, 
  ShoppingCart,
  Star,
  Shield,
  Truck
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useRuleBasedAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadProduct(params.id as string);
    }
  }, [params?.id]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      const productData = productService.getProductById(id);
      setProduct(productData || null);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, unit: string) => {
    return `฿${price.toLocaleString()}/${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const handleContactSeller = () => {
    // In a real app, this would open a chat or send a message
    alert('Chat functionality will be implemented in the next phase!');
  };

  const handleAddToCart = () => {
    // In a real app, this would add to cart or create an order
    alert(`Added ${quantity} ${product?.unit} of ${product?.title} to cart!`);
  };

  const totalPrice = product ? product.price * quantity : 0;
  const defaultImage = '/1284104.jpg';
  const productImage = imageError ? defaultImage : (product?.images[0] || defaultImage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/marketplace">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
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
        <div className="container mx-auto px-4 py-4">
          <Link href="/marketplace">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="relative h-96 w-full overflow-hidden rounded-lg">
                  <Image
                    src={productImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                    {product.organic && (
                      <Badge className="bg-green-600 text-white">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Listed {formatDate(product.createdAt)}</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-4">
                {formatPrice(product.price, product.unit)}
              </div>
            </div>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>{product.availableQuantity} {product.unit}</strong> available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Min order: <strong>{product.minimumOrder || 1} {product.unit}</strong>
                    </span>
                  </div>
                </div>

                {product.harvestDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Harvested: <strong>{formatDate(product.harvestDate)}</strong>
                    </span>
                  </div>
                )}

                {product.expiryDate && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Best before: <strong>{formatDate(product.expiryDate)}</strong>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Section */}
            {user?.userType === 'partner' && (
              <Card>
                <CardHeader>
                  <CardTitle>Place Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="quantity">Quantity ({product.unit})</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={product.minimumOrder || 1}
                      max={product.availableQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum order: {product.minimumOrder || 1} {product.unit}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Price:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ฿{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message to Seller (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Any special requirements or questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleContactSeller}
                      variant="outline" 
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {product.userId.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">Producer</h3>
                    <p className="text-sm text-gray-600">Verified seller</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-gray-200 text-gray-200" />
                      <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}