
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Download, Upload, Loader2 } from 'lucide-react';
import { fetchProducts } from '@/services/productService';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/lib/supabase';

const WarehousePage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch products using react-query
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error fetching products',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  });
  
  // Filter products based on search query
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(product.id).toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) return 'out_of_stock';
    if (product.stock <= 5) return 'low_stock';
    return 'in_stock';
  };
  
  return (
    <PageLayout 
      title="Ombor"
      description="Ombor ma'lumotlarini boshqarish"
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
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yangi mahsulot
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium">Ma'lumotlarni yuklashda xatolik yuz berdi</h3>
                <p className="mt-2 text-muted-foreground">Iltimos, keyinroq qayta urinib ko'ring</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead>Miqdori</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <p className="py-6 text-muted-foreground">Hech qanday mahsulot topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category || 'Kategoriyasiz'}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.price.toLocaleString()} so'm</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              stockStatus === 'in_stock' ? 'success' : 
                              stockStatus === 'out_of_stock' ? 'destructive' : 'warning'
                            }
                          >
                            {stockStatus === 'in_stock' ? 'Mavjud' : 
                            stockStatus === 'out_of_stock' ? 'Mavjud emas' : 'Kam qoldi'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default WarehousePage;
