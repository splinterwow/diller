
// Types for our application data model

// Database types - representing our tables
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: 'superadmin' | 'admin' | 'warehouse' | 'dealer' | 'agent' | 'store';
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'pending';
  phone?: string | null;
  address?: string | null;
};

export type Store = {
  id: number;
  name: string;
  address: string;
  dealer_id: string;
  status: 'active' | 'inactive' | 'pending';
  orders_count: number;
  created_at: string;
  dealer_name?: string; // Add this field to store dealer name
};

export type Dealer = {
  id: string;
  name: string;
  email?: string | null;
  region: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  stores_count: number;
  created_at: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: number;
  customer_id: string;
  store_id: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items_count: number;
  created_at: string;
  updated_at: string;
  store_name?: string;
  customer_name?: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  product_name?: string;
};

export type Return = {
  id: number;
  order_id: number;
  customer_id: string;
  reason: string;
  items_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  customer_name?: string;
  order_reference?: string;
};

export type Invoice = {
  id: number;
  order_id: number;
  customer_id: string;
  total: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
  customer_name?: string;
  order_reference?: string;
};
