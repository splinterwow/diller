
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Package, FileText, Trash, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/lib/supabase';
import { fetchOrders, deleteOrder, updateOrderStatus } from '@/services/orderService';
import { fetchStoresByDealer } from '@/services/storeService';

const DealerOrders = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);
  
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // First get dealer's stores
      const stores = await fetchStoresByDealer(user!.id);
      
      // Then get all orders
      const allOrders = await fetchOrders();
      
      // Filter orders to only include those from dealer's stores
      const storeIds = stores.map(store => store.id);
      const filteredOrders = allOrders.filter(order => 
        storeIds.includes(order.store_id)
      );
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Xatolik',
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewOrder = (order: Order) => {
    navigate(`/dealer/orders/${order.id}`);
  };
  
  const handleTrackDelivery = (order: Order) => {
    navigate(`/dealer/orders/${order.id}/delivery`);
  };
  
  const handleViewInvoice = (order: Order) => {
    navigate(`/dealer/orders/${order.id}/invoice`);
  };
  
  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      await deleteOrder(selectedOrder.id);
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Buyurtma o\'chirildi',
      });
      setIsDeleteDialogOpen(false);
      loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Xatolik',
        description: 'Buyurtmani o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    }
  };
  
  const openDeleteDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'processing': return 'outline';
      case 'shipped': return 'outline';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'delivered': return 'Yetkazildi';
      case 'processing': return 'Jarayonda';
      case 'shipped': return 'Jo\'natildi';
      case 'pending': return 'Kutilmoqda';
      case 'cancelled': return 'Bekor qilindi';
      default: return status;
    }
  };
  
  const filteredOrders = orders.filter(order => 
    (order.id?.toString() || '').includes(searchQuery) ||
    (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.created_at || '').includes(searchQuery)
  );
  
  return (
    <PageLayout 
      title="Buyurtmalar"
      description="Do'konlaringiz buyurtmalarini boshqarish"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Qidirish..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/dealer/orders/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi buyurtma
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Do'kon</TableHead>
                  <TableHead>Mijoz</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Mahsulotlar</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <p className="py-6 text-muted-foreground">Hech qanday buyurtma topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.store_name}</TableCell>
                      <TableCell className="font-medium">{order.customer_name}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{order.items_count}</TableCell>
                      <TableCell>{order.total.toLocaleString()} so'm</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(order.status)}
                        >
                          {getStatusTranslation(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleTrackDelivery(order)}>
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleViewInvoice(order)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => openDeleteDialog(order)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buyurtmani o'chirish</DialogTitle>
            <DialogDescription>
              Rostdan ham bu buyurtmani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Bekor qilish</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteOrder}>O'chirish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DealerOrders;
