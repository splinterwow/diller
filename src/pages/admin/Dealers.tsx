
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash, Eye, Loader2 } from 'lucide-react';
import { fetchDealers, updateDealerStatus, deleteDealer } from '@/services/dealerService';
import { toast } from '@/components/ui/use-toast';
import { Dealer } from '@/lib/supabase';

const DealersPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dealers, setDealers] = useState<Dealer[]>([]);
  
  // Fetch dealers using react-query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dealers'],
    queryFn: fetchDealers,
    meta: {
      onSettled: (data: Dealer[] | undefined, error: Error | null) => {
        if (error) {
          toast({
            title: 'Error fetching dealers',
            description: error.message,
            variant: 'destructive',
          });
        } else if (data) {
          setDealers(data);
        }
      }
    }
  });
  
  // Handle dealer status change
  const handleStatusChange = async (id: string, status: 'active' | 'inactive' | 'pending') => {
    try {
      const success = await updateDealerStatus(id, status);
      if (success) {
        toast({
          title: 'Status updated',
          description: `Dealer status has been updated to ${status}`,
        });
        
        // Update local state
        setDealers(prev => 
          prev.map(dealer => 
            dealer.id === id ? { ...dealer, status } : dealer
          )
        );
      }
    } catch (error) {
      console.error('Error updating dealer status:', error);
      toast({
        title: 'Error updating status',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle dealer deletion
  const handleDeleteDealer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      try {
        await deleteDealer(id);
        toast({
          title: 'Dealer deleted',
          description: 'The dealer has been deleted successfully',
        });
        
        // Update local state
        setDealers(prev => prev.filter(dealer => dealer.id !== id));
      } catch (error) {
        console.error('Error deleting dealer:', error);
        toast({
          title: 'Error deleting dealer',
          description: 'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // If there's an error or the data is still loading, show that accordingly
  if (isError) {
    return (
      <PageLayout 
        title="Dillerlar"
        description="Dillerlar ro'yxatini boshqarish"
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
  
  // Filter dealers based on search query
  const filteredDealers = dealers?.filter(dealer => 
    dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dealer.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dealer.phone.includes(searchQuery)
  ) || [];
  
  return (
    <PageLayout 
      title="Dillerlar"
      description="Dillerlar ro'yxatini boshqarish"
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
        <Button onClick={() => navigate('/admin/add-dealer')}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi diller
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
                  <TableHead>Ism Familiya</TableHead>
                  <TableHead>Viloyat</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Do'konlar</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDealers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <p className="py-6 text-muted-foreground">Hech qanday diller topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDealers.map((dealer) => (
                    <TableRow key={dealer.id}>
                      <TableCell>{dealer.id.substring(0, 8)}</TableCell>
                      <TableCell className="font-medium">{dealer.name}</TableCell>
                      <TableCell>{dealer.region}</TableCell>
                      <TableCell>{dealer.phone}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            dealer.status === 'active' ? 'success' : 
                            dealer.status === 'inactive' ? 'destructive' : 'outline'
                          }
                        >
                          {dealer.status === 'active' ? 'Faol' : 
                           dealer.status === 'inactive' ? 'Faol emas' : 'Kutilmoqda'}
                        </Badge>
                      </TableCell>
                      <TableCell>{dealer.stores_count}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/dealers/${dealer.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/dealers/edit/${dealer.id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteDealer(dealer.id)}
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
    </PageLayout>
  );
};

export default DealersPage;
