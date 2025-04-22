
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, CheckCircle, XCircle, Trash, Loader2 } from 'lucide-react';
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
import { Return } from '@/lib/supabase';
import { fetchReturns, deleteReturn, updateReturnStatus } from '@/services/returnService';
import { fetchStoresByDealer } from '@/services/storeService';
import { fetchOrders } from '@/services/orderService';

const DealerReturns = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadReturns();
    }
  }, [user]);
  
  const loadReturns = async () => {
    setIsLoading(true);
    try {
      // First get dealer's stores
      const stores = await fetchStoresByDealer(user!.id);
      const storeIds = stores.map(store => store.id);
      
      // Then get all orders for these stores
      const allOrders = await fetchOrders();
      const dealerOrderIds = allOrders
        .filter(order => storeIds.includes(order.store_id))
        .map(order => order.id);
      
      // Then get all returns
      const allReturns = await fetchReturns();
      
      // Filter returns to only include those from dealer's orders
      const filteredReturns = allReturns.filter(returnItem => 
        dealerOrderIds.includes(returnItem.order_id)
      );
      
      setReturns(filteredReturns);
    } catch (error) {
      console.error('Error loading returns:', error);
      toast({
        title: 'Xatolik',
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewReturn = (returnItem: Return) => {
    navigate(`/dealer/returns/${returnItem.id}`);
  };
  
  const handleDeleteReturn = async () => {
    if (!selectedReturn) return;
    
    try {
      await deleteReturn(selectedReturn.id);
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Qaytarish o\'chirildi',
      });
      setIsDeleteDialogOpen(false);
      loadReturns();
    } catch (error) {
      console.error('Error deleting return:', error);
      toast({
        title: 'Xatolik',
        description: 'Qaytarishni o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    }
  };
  
  const openDeleteDialog = (returnItem: Return) => {
    setSelectedReturn(returnItem);
    setIsDeleteDialogOpen(true);
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'processing': return 'secondary';
      default: return 'outline';
    }
  };
  
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'approved': return 'Tasdiqlangan';
      case 'rejected': return 'Rad etilgan';
      case 'processing': return 'Jarayonda';
      case 'pending': return 'Kutilmoqda';
      default: return status;
    }
  };
  
  const filteredReturns = returns.filter(item => 
    (item.id?.toString() || '').includes(searchQuery) ||
    (item.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.order_reference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.reason || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.created_at || '').includes(searchQuery)
  );
  
  return (
    <PageLayout 
      title="Qaytarishlar"
      description="Do'konlaringiz mahsulot qaytarishlarini boshqarish"
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
        <Button onClick={() => navigate('/dealer/returns/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi qaytarish
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
                  <TableHead>Buyurtma</TableHead>
                  <TableHead>Mijoz</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Mahsulotlar</TableHead>
                  <TableHead>Sabab</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <p className="py-6 text-muted-foreground">Hech qanday qaytarish topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell>{returnItem.id}</TableCell>
                      <TableCell>{returnItem.order_reference || returnItem.order_id}</TableCell>
                      <TableCell className="font-medium">{returnItem.customer_name}</TableCell>
                      <TableCell>{new Date(returnItem.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{returnItem.items_count}</TableCell>
                      <TableCell>{returnItem.reason}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(returnItem.status)}
                        >
                          {getStatusTranslation(returnItem.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewReturn(returnItem)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => openDeleteDialog(returnItem)}
                          >
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
            <DialogTitle>Qaytarishni o'chirish</DialogTitle>
            <DialogDescription>
              Rostdan ham bu qaytarishni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Bekor qilish</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteReturn}>O'chirish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default DealerReturns;
