
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Eye, Loader2 } from 'lucide-react';
import { fetchStores } from '@/services/storeService';
import { toast } from '@/components/ui/use-toast';

const StoresPage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch stores using react-query - updated to use meta.onError
  const { data: stores, isLoading, isError } = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error fetching stores',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
  
  // If there's an error or the data is still loading, show that accordingly
  if (isError) {
    return (
      <PageLayout 
        title="Do'konlar"
        description="Do'konlar ro'yxatini boshqarish"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium">Ma'lumotlarni yuklashda xatolik yuz berdi</h3>
            <p className="mt-2 text-muted-foreground">Iltimos, keyinroq qayta urinib ko'ring</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Filter stores based on search query - updated to use dealer_name
  const filteredStores = stores?.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (store.dealer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  ) || [];
  
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
        <Button>
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
                  <TableHead>Diller</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Buyurtmalar</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <p className="py-6 text-muted-foreground">Hech qanday do'kon topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>{store.id}</TableCell>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>{store.dealer_name}</TableCell>
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
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
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

export default StoresPage;
