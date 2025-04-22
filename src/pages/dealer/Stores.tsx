
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash, Eye, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStoresByDealer, deleteStore, updateStoreStatus } from '@/services/storeService';
import { Store } from '@/lib/supabase';

const DealerStores = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadStores();
  }, [user]);
  
  const loadStores = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchStoresByDealer(user.id);
      setStores(data);
    } catch (error) {
      console.error('Error loading stores:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stores. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteStore = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await deleteStore(id);
        toast({
          title: 'Success',
          description: 'Store deleted successfully',
        });
        loadStores();
      } catch (error) {
        console.error('Error deleting store:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete store',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleUpdateStatus = async (id: number, status: 'active' | 'inactive' | 'pending') => {
    try {
      await updateStoreStatus(id, status);
      toast({
        title: 'Success',
        description: `Store status updated to ${status}`,
      });
      loadStores();
    } catch (error) {
      console.error('Error updating store status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update store status',
        variant: 'destructive',
      });
    }
  };
  
  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <PageLayout 
      title="Do'konlar"
      description="Do'konlar ro'yxatini boshqarish"
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
        <Button onClick={() => navigate('/dealer/add-store')}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi do'kon
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
                  <TableHead>Nomi</TableHead>
                  <TableHead>Manzil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Buyurtmalar</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <p className="py-6 text-muted-foreground">Hech qanday do'kon topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>{store.id}</TableCell>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            store.status === 'active' ? 'success' : 
                            store.status === 'inactive' ? 'destructive' : 'outline'
                          }
                        >
                          {store.status === 'active' ? 'Faol' : 
                           store.status === 'inactive' ? 'Faol emas' : 'Kutilmoqda'}
                        </Badge>
                      </TableCell>
                      <TableCell>{store.orders_count}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/dealer/stores/${store.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/dealer/stores/edit/${store.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteStore(store.id)}>
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
    </PageLayout>
  );
};

export default DealerStores;
