
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
import { Return } from '@/lib/supabase';
import { fetchReturns, deleteReturn, updateReturnStatus } from '@/services/returnService';

const ReturnsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'approved' | 'rejected' | null>(null);
  
  useEffect(() => {
    loadReturns();
  }, []);
  
  const loadReturns = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReturns();
      setReturns(data);
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
    navigate(`/admin/returns/${returnItem.id}`);
  };
  
  const handleApproveReturn = (returnItem: Return) => {
    setSelectedReturn(returnItem);
    setNewStatus('approved');
    setIsStatusDialogOpen(true);
  };
  
  const handleRejectReturn = (returnItem: Return) => {
    setSelectedReturn(returnItem);
    setNewStatus('rejected');
    setIsStatusDialogOpen(true);
  };
  
  const handleUpdateStatus = async () => {
    if (!selectedReturn || !newStatus) return;
    
    try {
      await updateReturnStatus(selectedReturn.id, newStatus);
      toast({
        title: 'Muvaffaqiyatli',
        description: `Qaytarish statusi yangilandi: ${newStatus === 'approved' ? 'Tasdiqlandi' : 'Rad etildi'}`,
      });
      setIsStatusDialogOpen(false);
      loadReturns();
    } catch (error) {
      console.error('Error updating return status:', error);
      toast({
        title: 'Xatolik',
        description: 'Qaytarish statusini yangilashda xatolik yuz berdi',
        variant: 'destructive',
      });
    }
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
      description="Mahsulot qaytarishlarini boshqarish"
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
        <Button onClick={() => navigate('/admin/returns/new')}>
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
                            className="text-green-500"
                            onClick={() => handleApproveReturn(returnItem)}
                            disabled={returnItem.status === 'approved'}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleRejectReturn(returnItem)}
                            disabled={returnItem.status === 'rejected'}
                          >
                            <XCircle className="h-4 w-4" />
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
      
      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'approved' ? 'Qaytarishni tasdiqlash' : 'Qaytarishni rad etish'}
            </DialogTitle>
            <DialogDescription>
              {newStatus === 'approved' 
                ? 'Bu qaytarishni tasdiqlashni xohlaysizmi? Bu tovarlar omborga qaytariladi.'
                : 'Bu qaytarishni rad etishni xohlaysizmi? Mijoz bilan bog\'lanib, ularga sabalarni tushuntiring.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Bekor qilish</Button>
            </DialogClose>
            <Button 
              variant={newStatus === 'approved' ? 'default' : 'destructive'} 
              onClick={handleUpdateStatus}
            >
              {newStatus === 'approved' ? 'Tasdiqlash' : 'Rad etish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ReturnsPage;
