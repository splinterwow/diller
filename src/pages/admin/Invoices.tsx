
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Eye, Printer, FileText, Trash, Loader2 } from 'lucide-react';
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
import { Invoice } from '@/lib/supabase';
import { fetchInvoices, deleteInvoice } from '@/services/invoiceService';

const InvoicesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    loadInvoices();
  }, []);
  
  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: 'Xatolik',
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewInvoice = (invoice: Invoice) => {
    navigate(`/admin/invoices/${invoice.id}`);
  };
  
  const handlePrintInvoice = (invoice: Invoice) => {
    // Open a print-friendly version in a new window
    const printWindow = window.open(`/admin/invoices/${invoice.id}/print`, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };
  
  const handleDownloadInvoice = (invoice: Invoice) => {
    navigate(`/admin/invoices/${invoice.id}/download`);
  };
  
  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return;
    
    try {
      await deleteInvoice(selectedInvoice.id);
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Hisob-faktura o\'chirildi',
      });
      setIsDeleteDialogOpen(false);
      loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: 'Xatolik',
        description: 'Hisob-fakturani o\'chirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    }
  };
  
  const openDeleteDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'outline';
      case 'partial': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'paid': return 'To\'langan';
      case 'pending': return 'Kutilmoqda';
      case 'partial': return 'Qisman to\'langan';
      case 'overdue': return 'Muddati o\'tgan';
      case 'cancelled': return 'Bekor qilindi';
      default: return status;
    }
  };
  
  const filteredInvoices = invoices.filter(invoice => 
    (invoice.id?.toString() || '').includes(searchQuery) ||
    (invoice.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (invoice.order_reference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (invoice.created_at || '').includes(searchQuery) ||
    (invoice.due_date || '').includes(searchQuery)
  );
  
  return (
    <PageLayout 
      title="Hisob-fakturalar"
      description="Hisob-fakturalarni boshqarish"
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
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => navigate('/admin/invoices/new')}>
            <FileText className="mr-2 h-4 w-4" />
            Yangi hisob-faktura
          </Button>
        </div>
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
                  <TableHead>To'lov muddati</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <p className="py-6 text-muted-foreground">Hech qanday hisob-faktura topilmadi</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.order_reference || invoice.order_id}</TableCell>
                      <TableCell className="font-medium">{invoice.customer_name}</TableCell>
                      <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.total.toLocaleString()} so'm</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(invoice.status)}
                        >
                          {getStatusTranslation(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewInvoice(invoice)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handlePrintInvoice(invoice)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(invoice)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => openDeleteDialog(invoice)}>
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
            <DialogTitle>Hisob-fakturani o'chirish</DialogTitle>
            <DialogDescription>
              Rostdan ham bu hisob-fakturani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Bekor qilish</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteInvoice}>O'chirish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default InvoicesPage;
