'use client';

import { Product } from '@/types/database';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({ product, showActions = false, onEdit, onDelete }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number, unit: string) => {
    return `฿${price.toLocaleString()}/${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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

  const defaultImage = '/1284104.jpg';
  const productImage = imageError ? defaultImage : (product.images[0] || defaultImage);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={productImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={getCategoryColor(product.category)}>
              {product.category}
            </Badge>
            {product.organic && (
              <Badge variant="secondary" className="bg-green-600 text-white">
                Organic
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(product.price, product.unit)}
            </div>
            <div className="text-sm text-gray-500">
              Min: {product.minimumOrder || 1} {product.unit}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{product.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>{product.availableQuantity} {product.unit} available</span>
            </div>
          </div>
          
          {product.harvestDate && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Harvested: {formatDate(product.harvestDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        {showActions ? (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onEdit?.(product)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={() => onDelete?.(product.id)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Link href={`/products/${product.id}`} className="flex-1">
              <Button className="w-full">
                View Details
              </Button>
            </Link>
            <Button variant="outline" className="flex-1">
              Contact Seller
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}