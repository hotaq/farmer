import { Product, User } from '@/types/database';

// Mock product data for demonstration
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    userId: 'producer-demo-1',
    title: 'Fresh Organic Tomatoes',
    description: 'Premium quality organic tomatoes grown without pesticides. Perfect for salads, cooking, and sauces. Harvested fresh daily.',
    category: 'vegetables',
    price: 45,
    unit: 'kg',
    availableQuantity: 500,
    minimumOrder: 10,
    harvestDate: '2024-01-15',
    expiryDate: '2024-01-25',
    location: 'Chiang Mai, Thailand',
    organic: true,
    images: ['/1284104.jpg'],
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    userId: 'producer-demo-1',
    title: 'Sweet Mangoes',
    description: 'Delicious sweet mangoes from our family farm. Hand-picked at perfect ripeness for maximum flavor and sweetness.',
    category: 'fruits',
    price: 80,
    unit: 'kg',
    availableQuantity: 200,
    minimumOrder: 5,
    harvestDate: '2024-01-14',
    expiryDate: '2024-01-28',
    location: 'Chiang Mai, Thailand',
    organic: false,
    images: ['/Agri900x450.jpg'],
    status: 'active',
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    userId: 'producer-demo-2',
    title: 'Premium Jasmine Rice',
    description: 'High-quality jasmine rice with authentic aroma and taste. Grown using traditional methods in the fertile fields of central Thailand.',
    category: 'grains',
    price: 35,
    unit: 'kg',
    availableQuantity: 1000,
    minimumOrder: 25,
    harvestDate: '2024-01-10',
    location: 'Ayutthaya, Thailand',
    organic: true,
    images: ['/BST010720227279-scaled.jpg'],
    status: 'active',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z'
  },
  {
    id: '4',
    userId: 'producer-demo-1',
    title: 'Fresh Lettuce',
    description: 'Crispy fresh lettuce perfect for salads and sandwiches. Grown in controlled environment for consistent quality.',
    category: 'vegetables',
    price: 25,
    unit: 'kg',
    availableQuantity: 150,
    minimumOrder: 5,
    harvestDate: '2024-01-16',
    expiryDate: '2024-01-23',
    location: 'Chiang Mai, Thailand',
    organic: true,
    images: ['/585774-3840x2160-desktop-4k-vegetables-background-photo.jpg'],
    status: 'active',
    createdAt: '2024-01-16T06:00:00Z',
    updatedAt: '2024-01-16T06:00:00Z'
  }
];

class ProductService {
  private products: Product[] = [];
  private storageKey = 'agri-connect-products';

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.products = JSON.parse(stored);
      } else {
        // Initialize with demo products
        this.products = [...DEMO_PRODUCTS];
        this.saveProducts();
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.products = [...DEMO_PRODUCTS];
    }
  }

  private saveProducts(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }

  // Get all products
  getAllProducts(): Product[] {
    return this.products.filter(product => product.status === 'active');
  }

  // Get products by user ID
  getProductsByUserId(userId: string): Product[] {
    return this.products.filter(product => product.userId === userId);
  }

  // Get product by ID
  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  // Search products
  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.status === 'active' && (
        product.title.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.location.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Filter products by category
  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => 
      product.status === 'active' && product.category === category
    );
  }

  // Create new product
  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  // Update product
  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveProducts();
    return this.products[index];
  }

  // Delete product
  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    this.saveProducts();
    return true;
  }

  // Get featured products (for homepage)
  getFeaturedProducts(limit: number = 6): Product[] {
    return this.products
      .filter(product => product.status === 'active')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Get products with filters
  getFilteredProducts(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    organic?: boolean;
    location?: string;
  }): Product[] {
    return this.products.filter(product => {
      if (product.status !== 'active') return false;
      
      if (filters.category && product.category !== filters.category) return false;
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (filters.organic !== undefined && product.organic !== filters.organic) return false;
      if (filters.location && !product.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      
      return true;
    });
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;