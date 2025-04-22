
import { Order, OrderItem } from '@/lib/supabase';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 1,
    customer_id: 'user123',
    store_id: 1,
    total: 150000,
    status: 'pending',
    items_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    store_name: 'Main Store',
    customer_name: 'John Doe'
  },
  {
    id: 2,
    customer_id: 'user456',
    store_id: 2,
    total: 85000,
    status: 'delivered',
    items_count: 2,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    store_name: 'Branch Store',
    customer_name: 'Jane Smith'
  },
  {
    id: 3,
    customer_id: 'user789',
    store_id: 1,
    total: 120000,
    status: 'processing',
    items_count: 4,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    store_name: 'Main Store',
    customer_name: 'David Johnson'
  },
  {
    id: 4,
    customer_id: 'user123',
    store_id: 3,
    total: 95000,
    status: 'shipped',
    items_count: 2,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    store_name: 'Mall Store',
    customer_name: 'John Doe'
  }
];

// Mock order items data
const mockOrderItems: OrderItem[] = [
  {
    id: 1,
    order_id: 1,
    product_id: 101,
    quantity: 2,
    price: 75000,
    created_at: new Date().toISOString(),
    product_name: 'Product A'
  },
  {
    id: 2,
    order_id: 1,
    product_id: 102,
    quantity: 1,
    price: 75000,
    created_at: new Date().toISOString(),
    product_name: 'Product B'
  },
  {
    id: 3,
    order_id: 2,
    product_id: 103,
    quantity: 3,
    price: 25000,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    product_name: 'Product C'
  },
  {
    id: 4,
    order_id: 2,
    product_id: 104,
    quantity: 1,
    price: 35000,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    product_name: 'Product D'
  }
];

// Helper function to get the next available ID
const getNextOrderId = (): number => {
  return Math.max(...mockOrders.map(o => o.id)) + 1;
};

const getNextOrderItemId = (): number => {
  return Math.max(...mockOrderItems.map(o => o.id)) + 1;
};

// Fetch all orders
export async function fetchOrders(): Promise<Order[]> {
  try {
    return [...mockOrders];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Fetch orders by store ID
export async function fetchOrdersByStore(storeId: number): Promise<Order[]> {
  try {
    return mockOrders.filter(order => order.store_id === storeId);
  } catch (error) {
    console.error(`Error fetching orders for store ${storeId}:`, error);
    throw error;
  }
}

// Fetch a single order by ID
export async function fetchOrderById(id: number): Promise<Order | null> {
  try {
    return mockOrders.find(order => order.id === id) || null;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
}

// Fetch order items
export async function fetchOrderItems(orderId: number): Promise<OrderItem[]> {
  try {
    return mockOrderItems.filter(item => item.order_id === orderId);
  } catch (error) {
    console.error(`Error fetching items for order ${orderId}:`, error);
    throw error;
  }
}

// Create a new order
export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'store_name' | 'customer_name'>,
  items: Omit<OrderItem, 'id' | 'created_at' | 'order_id' | 'product_name'>[]
): Promise<Order> {
  try {
    const newOrderId = getNextOrderId();
    
    // Create the new order
    const newOrder: Order = {
      id: newOrderId,
      ...order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      store_name: 'New Store', // In a real implementation, this would be looked up
      customer_name: 'New Customer' // In a real implementation, this would be looked up
    };
    
    // Add items for the order
    items.forEach(item => {
      const newItem: OrderItem = {
        id: getNextOrderItemId(),
        order_id: newOrderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        created_at: new Date().toISOString(),
        product_name: `Product ${item.product_id}` // In a real implementation, this would be looked up
      };
      
      mockOrderItems.push(newItem);
    });
    
    // Add order to mock data
    mockOrders.push(newOrder);
    
    console.log('Creating order:', newOrder);
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Update an order
export async function updateOrder(
  id: number, 
  updates: Partial<Order>
): Promise<Order> {
  try {
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      throw new Error(`Order with id ${id} not found`);
    }
    
    const order = mockOrders[orderIndex];
    const updatedOrder: Order = {
      ...order,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Update in mock data
    mockOrders[orderIndex] = updatedOrder;
    
    console.log('Updating order:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    throw error;
  }
}

// Delete an order
export async function deleteOrder(id: number): Promise<boolean> {
  try {
    const initialLength = mockOrders.length;
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      throw new Error(`Order with id ${id} not found`);
    }
    
    // Remove the order from mock data
    mockOrders.splice(orderIndex, 1);
    
    // Remove associated order items
    const itemsToRemove = mockOrderItems.filter(item => item.order_id === id);
    itemsToRemove.forEach(item => {
      const itemIndex = mockOrderItems.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        mockOrderItems.splice(itemIndex, 1);
      }
    });
    
    console.log('Deleting order with id:', id);
    return mockOrders.length < initialLength;
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(
  id: number, 
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<Order> {
  try {
    return updateOrder(id, { status });
  } catch (error) {
    console.error(`Error updating order status for id ${id}:`, error);
    throw error;
  }
}
