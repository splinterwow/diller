
import { Product } from '@/lib/supabase';

// Mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Smartphone X Pro",
    description: "Latest flagship smartphone with advanced features",
    price: 799000,
    stock: 50,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/phone1/200/300",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Laptop UltraBook",
    description: "Lightweight laptop with powerful performance",
    price: 1299000,
    stock: 25,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/laptop1/200/300",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Wireless Headphones",
    description: "Premium noise-cancelling headphones",
    price: 299000,
    stock: 100,
    category: "Audio",
    image_url: "https://picsum.photos/seed/headphones1/200/300",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "Smart Watch Series 5",
    description: "Advanced smartwatch with health tracking features",
    price: 399000,
    stock: 75,
    category: "Wearables",
    image_url: "https://picsum.photos/seed/watch1/200/300",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    name: "Tablet Pro 12.9",
    description: "Large display tablet for professionals",
    price: 899000,
    stock: 30,
    category: "Electronics",
    image_url: "https://picsum.photos/seed/tablet1/200/300",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to get the next available ID
const getNextProductId = (): number => {
  return Math.max(...mockProducts.map(p => p.id)) + 1;
};

// Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  try {
    return [...mockProducts];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Fetch a single product by ID
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    return mockProducts.find(product => product.id === id) || null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
}

// Create a new product
export async function createProduct(
  product: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<Product> {
  try {
    const newProduct: Product = {
      id: getNextProductId(),
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockProducts.push(newProduct);
    
    console.log('Creating product:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

// Update a product
export async function updateProduct(
  id: number, 
  updates: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product> {
  try {
    const productIndex = mockProducts.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    const product = mockProducts[productIndex];
    const updatedProduct: Product = {
      ...product,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    mockProducts[productIndex] = updatedProduct;
    
    console.log('Updating product:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
}

// Delete a product
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const initialLength = mockProducts.length;
    const productIndex = mockProducts.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    mockProducts.splice(productIndex, 1);
    
    console.log('Deleting product with id:', id);
    return mockProducts.length < initialLength;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
}

// Update product status
export async function updateProductStatus(
  id: number, 
  status: 'active' | 'inactive'
): Promise<Product> {
  try {
    return updateProduct(id, { status });
  } catch (error) {
    console.error(`Error updating product status for id ${id}:`, error);
    throw error;
  }
}
