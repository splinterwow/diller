
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import DataTable, { ColumnDef } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, RotateCcw, Archive } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock data for trash items
interface TrashItem {
  id: string;
  name: string;
  type: 'product' | 'order' | 'invoice' | 'dealer' | 'store';
  deletedAt: string;
  deletedBy: string;
}

const mockTrashData: TrashItem[] = [
  {
    id: '001',
    name: 'iPhone 13 Pro',
    type: 'product',
    deletedAt: '2023-05-10T14:30:00Z',
    deletedBy: 'Abdulla Qodirov',
  },
  {
    id: '002',
    name: 'Buyurtma #12345',
    type: 'order',
    deletedAt: '2023-05-12T09:15:00Z',
    deletedBy: 'Nodira Azizova',
  },
  {
    id: '003',
    name: 'Hisob-faktura #INV-789',
    type: 'invoice',
    deletedAt: '2023-05-14T16:45:00Z',
    deletedBy: 'Sardor Mahmudov',
  },
  {
    id: '004',
    name: 'Anvar Elektroniks',
    type: 'dealer',
    deletedAt: '2023-05-15T11:20:00Z',
    deletedBy: 'Murod Hakimov',
  },
  {
    id: '005',
    name: 'Markaziy Do\'kon',
    type: 'store',
    deletedAt: '2023-05-16T13:10:00Z',
    deletedBy: 'Lola Karimova',
  },
  {
    id: '006',
    name: 'Samsung Galaxy S22',
    type: 'product',
    deletedAt: '2023-05-17T10:30:00Z',
    deletedBy: 'Jasur Toshmatov',
  },
  {
    id: '007',
    name: 'Buyurtma #67890',
    type: 'order',
    deletedAt: '2023-05-18T14:25:00Z',
    deletedBy: 'Nilufar Raimova',
  },
];

const TrashPage: React.FC = () => {
  const { t } = useLanguage();
  const [trashItems, setTrashItems] = useState<TrashItem[]>(mockTrashData);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [isPermanentlyDeleting, setIsPermanentlyDeleting] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TrashItem | null>(null);
  const [isPurging, setIsPurging] = useState(false);

  // Handle restoring item
  const handleRestore = (item: TrashItem) => {
    setIsRestoring(item.id);
    
    // Simulate API call
    setTimeout(() => {
      setTrashItems(trashItems.filter(i => i.id !== item.id));
      setIsRestoring(null);
      
      // Show success message
      toast({
        title: "Muvaffaqiyatli tiklandi",
        description: `"${item.name}" muvaffaqiyatli tiklandi.`,
      });
    }, 1000);
  };

  // Handle permanent deletion
  const handlePermanentDelete = (item: TrashItem) => {
    setSelectedItem(item);
  };

  const confirmPermanentDelete = () => {
    if (!selectedItem) return;
    
    setIsPermanentlyDeleting(selectedItem.id);
    
    // Simulate API call
    setTimeout(() => {
      setTrashItems(trashItems.filter(i => i.id !== selectedItem.id));
      setIsPermanentlyDeleting(null);
      setSelectedItem(null);
      
      // Show success message
      toast({
        title: "Butunlay o'chirildi",
        description: `"${selectedItem.name}" butunlay o'chirildi.`,
        variant: "destructive"
      });
    }, 1000);
  };

  // Handle purge all
  const handlePurgeAll = () => {
    setIsPurging(true);
    
    // Simulate API call
    setTimeout(() => {
      setTrashItems([]);
      setIsPurging(false);
      
      // Show success message
      toast({
        title: "Axlat bo'shatildi",
        description: "Barcha elementlar butunlay o'chirildi.",
        variant: "destructive"
      });
    }, 1500);
  };

  // Format date to locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Define table columns
  const columns: ColumnDef[] = [
    {
      title: 'Nomi',
      field: 'name',
      sortable: true,
    },
    {
      title: 'Turi',
      field: 'type',
      sortable: true,
      render: (value: string, row: TrashItem) => {
        let color = '';
        let label = '';
        
        switch(value) {
          case 'product':
            color = 'bg-blue-100 text-blue-800';
            label = 'Mahsulot';
            break;
          case 'order':
            color = 'bg-green-100 text-green-800';
            label = 'Buyurtma';
            break;
          case 'invoice':
            color = 'bg-purple-100 text-purple-800';
            label = 'Hisob-faktura';
            break;
          case 'dealer':
            color = 'bg-orange-100 text-orange-800';
            label = 'Diller';
            break;
          case 'store':
            color = 'bg-pink-100 text-pink-800';
            label = 'Do\'kon';
            break;
          default:
            color = 'bg-gray-100 text-gray-800';
            label = value;
        }
        
        return <Badge className={color}>{label}</Badge>;
      }
    },
    {
      title: "O'chirilgan sana",
      field: 'deletedAt',
      sortable: true,
      render: (value: string) => formatDate(value),
    },
    {
      title: "O'chirgan foydalanuvchi",
      field: 'deletedBy',
      sortable: true,
    },
    {
      title: 'Harakatlar',
      field: 'actions',
      render: (_, row: TrashItem) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleRestore(row)}
            disabled={isRestoring === row.id}
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            {isRestoring === row.id ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-1" />
            )}
            Tiklash
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePermanentDelete(row)}
                disabled={isPermanentlyDeleting === row.id}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {isPermanentlyDeleting === row.id ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Archive className="h-4 w-4 mr-1" />
                )}
                Butunlay o'chirish
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Butunlay o'chirishni tasdiqlang</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu harakatni ortga qaytarib bo'lmaydi. Bu {row.type === 'product' ? 'mahsulot' : 
                                                          row.type === 'order' ? 'buyurtma' : 
                                                          row.type === 'invoice' ? 'hisob-faktura' : 
                                                          row.type === 'dealer' ? 'diller' : 'do\'kon'} 
                  serverdan butunlay o'chiriladi va uni qayta tiklab bo'lmaydi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                <AlertDialogAction onClick={confirmPermanentDelete} className="bg-red-600 hover:bg-red-700">
                  {isPermanentlyDeleting === row.id ? "O'chirilmoqda..." : "Butunlay o'chirish"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <PageLayout 
      title="Axlat"
      description="O'chirilgan elementlarni boshqarish"
    >
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">
              Bu yerda o'chirilgan elementlar 30 kun davomida saqlanadi. Siz ularni tiklashingiz yoki butunlay o'chirib tashlashingiz mumkin.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={trashItems.length === 0 || isPurging}>
                  {isPurging ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Bo'shatilmoqda...
                    </>
                  ) : (
                    'Axlatni bo\'shatish'
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Axlatni bo'shatishni tasdiqlang</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu harakatni ortga qaytarib bo'lmaydi. Bu barcha o'chirilgan elementlarni serverdan butunlay o'chiradi va ularni qayta tiklab bo'lmaydi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePurgeAll} className="bg-red-600 hover:bg-red-700">
                    {isPurging ? "Bo'shatilmoqda..." : "Axlatni bo'shatish"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <DataTable 
            columns={columns} 
            data={trashItems}
            searchable={true}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TrashPage;
