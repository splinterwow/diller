
import { useState } from 'react';
import {
  Package,
  Plus,
  FileText,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Tag,
  UploadCloud,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import PageHeader from '@/components/PageHeader';
import DataTable, { ColumnDef } from '@/components/DataTable';
import { format } from 'date-fns';

// Mock data
const productsData = [
  {
    id: '1',
    name: 'Cola 1L',
    category: 'Beverages',
    price: 8000,
    quantity: 2500,
    unit: 'bottle',
    barcode: '8901234567890',
    status: 'active',
    expiryDate: '2025-12-31',
    createdAt: '2025-01-15',
    image: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Water 500ml',
    category: 'Beverages',
    price: 3000,
    quantity: 5000,
    unit: 'bottle',
    barcode: '8901234567891',
    status: 'active',
    expiryDate: '2026-06-30',
    createdAt: '2025-01-16',
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Orange Juice 1L',
    category: 'Beverages',
    price: 12000,
    quantity: 1800,
    unit: 'bottle',
    barcode: '8901234567892',
    status: 'active',
    expiryDate: '2025-08-15',
    createdAt: '2025-01-17',
    image: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Lemon Soda 330ml',
    category: 'Beverages',
    price: 6000,
    quantity: 2200,
    unit: 'can',
    barcode: '8901234567893',
    status: 'low_stock',
    expiryDate: '2025-10-20',
    createdAt: '2025-01-18',
    image: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Energy Drink 250ml',
    category: 'Beverages',
    price: 9000,
    quantity: 1500,
    unit: 'can',
    barcode: '8901234567894',
    status: 'active',
    expiryDate: '2025-09-30',
    createdAt: '2025-01-19',
    image: '/placeholder.svg',
  },
  {
    id: '6',
    name: 'Chocolate Bar 100g',
    category: 'Confectionery',
    price: 7000,
    quantity: 500,
    unit: 'piece',
    barcode: '8901234567895',
    status: 'active',
    expiryDate: '2025-07-15',
    createdAt: '2025-02-01',
    image: '/placeholder.svg',
  },
  {
    id: '7',
    name: 'Potato Chips 150g',
    category: 'Snacks',
    price: 9000,
    quantity: 800,
    unit: 'packet',
    barcode: '8901234567896',
    status: 'active',
    expiryDate: '2025-11-10',
    createdAt: '2025-02-05',
    image: '/placeholder.svg',
  },
  {
    id: '8',
    name: 'Whole Milk 1L',
    category: 'Dairy',
    price: 10000,
    quantity: 0,
    unit: 'bottle',
    barcode: '8901234567897',
    status: 'out_of_stock',
    expiryDate: '2025-04-30',
    createdAt: '2025-02-10',
    image: '/placeholder.svg',
  },
];

// Categories
const categories = [
  { id: '1', name: 'Beverages' },
  { id: '2', name: 'Confectionery' },
  { id: '3', name: 'Snacks' },
  { id: '4', name: 'Dairy' },
  { id: '5', name: 'Bakery' },
];

// Units
const units = [
  { id: '1', name: 'bottle' },
  { id: '2', name: 'can' },
  { id: '3', name: 'packet' },
  { id: '4', name: 'piece' },
  { id: '5', name: 'box' },
  { id: '6', name: 'kg' },
  { id: '7', name: 'liter' },
];

const ProductsPage = () => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Columns for the products data table
  const columns: ColumnDef[] = [
    {
      title: t('name'),
      field: 'name',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
            <img src={row.image} alt={value} className="h-8 w-8 object-contain" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-muted-foreground">{row.barcode}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      title: t('category'),
      field: 'category',
      sortable: true,
    },
    {
      title: t('price'),
      field: 'price',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      title: t('quantity'),
      field: 'quantity',
      render: (value, row) => (
        <div className="flex items-center">
          <span>{value} {row.unit}</span>
        </div>
      ),
      sortable: true,
    },
    {
      title: t('status'),
      field: 'status',
      render: (value) => {
        let bgColor = '';
        let textColor = '';
        let label = '';

        switch (value) {
          case 'active':
            bgColor = 'bg-green-100 dark:bg-green-900/20';
            textColor = 'text-green-800 dark:text-green-400';
            label = t('active');
            break;
          case 'low_stock':
            bgColor = 'bg-yellow-100 dark:bg-yellow-900/20';
            textColor = 'text-yellow-800 dark:text-yellow-400';
            label = t('low_stock');
            break;
          case 'out_of_stock':
            bgColor = 'bg-red-100 dark:bg-red-900/20';
            textColor = 'text-red-800 dark:text-red-400';
            label = t('out_of_stock');
            break;
        }

        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
            {label}
          </span>
        );
      },
      sortable: true,
    },
    {
      title: t('expiry_date'),
      field: 'expiryDate',
      sortable: true,
    },
  ];

  const handleAddProduct = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    toast({
      title: t('product_deleted'),
      description: t('product_deleted_description'),
    });
    setIsDeleteDialogOpen(false);
  };

  const saveProduct = () => {
    toast({
      title: selectedProduct ? t('product_updated') : t('product_added'),
      description: selectedProduct ? t('product_updated_description') : t('product_added_description'),
    });
    setIsAddDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleExportPdf = () => {
    toast({
      title: t('export_started'),
      description: t('export_pdf_description'),
    });
  };

  const handleExportExcel = () => {
    toast({
      title: t('export_started'),
      description: t('export_excel_description'),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('products')} 
        description={t('products_description')}
      >
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_product')}
        </Button>
      </PageHeader>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('all_products')}</TabsTrigger>
          <TabsTrigger value="active">{t('active')}</TabsTrigger>
          <TabsTrigger value="low_stock">{t('low_stock')}</TabsTrigger>
          <TabsTrigger value="out_of_stock">{t('out_of_stock')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <DataTable
            columns={columns}
            data={productsData}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onRowClick={handleViewProduct}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('all_products')}
            searchable
          />
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <DataTable
            columns={columns}
            data={productsData.filter(p => p.status === 'active')}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onRowClick={handleViewProduct}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('active_products')}
            searchable
          />
        </TabsContent>
        
        <TabsContent value="low_stock" className="space-y-4">
          <DataTable
            columns={columns}
            data={productsData.filter(p => p.status === 'low_stock')}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onRowClick={handleViewProduct}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('low_stock_products')}
            searchable
          />
        </TabsContent>
        
        <TabsContent value="out_of_stock" className="space-y-4">
          <DataTable
            columns={columns}
            data={productsData.filter(p => p.status === 'out_of_stock')}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onRowClick={handleViewProduct}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('out_of_stock_products')}
            searchable
          />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? t('edit_product') : t('add_product')}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? t('edit_product_description') : t('add_product_description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Product Image */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-32 w-32 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedProduct?.image || '/placeholder.svg'} 
                  alt="Product" 
                  className="h-full w-full object-cover"
                />
                <Button variant="ghost" size="sm" className="absolute bottom-1 right-1 h-8 w-8 p-0 rounded-full">
                  <UploadCloud className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input 
                  id="name" 
                  defaultValue={selectedProduct?.name || ''} 
                  placeholder={t('enter_product_name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">{t('category')}</Label>
                <Select defaultValue={selectedProduct?.category || ''}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('select_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">{t('price')}</Label>
                <Input 
                  id="price" 
                  type="number" 
                  defaultValue={selectedProduct?.price || ''} 
                  placeholder={t('enter_price')}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t('quantity')}</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    defaultValue={selectedProduct?.quantity || ''} 
                    placeholder={t('enter_quantity')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">{t('unit')}</Label>
                  <Select defaultValue={selectedProduct?.unit || ''}>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder={t('select_unit')} />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="barcode">{t('barcode')}</Label>
                <Input 
                  id="barcode" 
                  defaultValue={selectedProduct?.barcode || ''} 
                  placeholder={t('enter_barcode')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry-date">{t('expiry_date')}</Label>
                <Input 
                  id="expiry-date" 
                  type="date" 
                  defaultValue={selectedProduct?.expiryDate || ''} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea 
                id="description" 
                rows={3} 
                placeholder={t('enter_description')}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="status" defaultChecked={selectedProduct?.status !== 'out_of_stock'} />
              <Label htmlFor="status">{t('product_active')}</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={saveProduct}>
              {selectedProduct ? t('update_product') : t('add_product')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('product_details')}</DialogTitle>
            <DialogDescription>
              {t('product_details_description')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="h-40 w-40 rounded-md bg-muted flex items-center justify-center mx-auto sm:mx-0">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="h-32 w-32 object-contain"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedProduct.category}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{t('expires')}: {selectedProduct.expiryDate}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedProduct.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : selectedProduct.status === 'low_stock'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {selectedProduct.status === 'active' ? t('active') : 
                       selectedProduct.status === 'low_stock' ? t('low_stock') : 
                       t('out_of_stock')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('price')}</p>
                  <p className="font-medium">{formatCurrency(selectedProduct.price)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('quantity')}</p>
                  <p className="font-medium">{selectedProduct.quantity} {selectedProduct.unit}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('barcode')}</p>
                  <p className="font-medium">{selectedProduct.barcode}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('created_at')}</p>
                  <p className="font-medium">{selectedProduct.createdAt}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('description')}</p>
                <p className="text-sm">
                  {selectedProduct.description || t('no_description')}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsViewDialogOpen(false);
                handleEditProduct(selectedProduct);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('edit')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setIsViewDialogOpen(false);
                handleDeleteProduct(selectedProduct);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('confirm_delete')}</DialogTitle>
            <DialogDescription>
              {t('confirm_delete_description')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="py-4">
              <p className="text-center text-muted-foreground mb-4">
                {t('delete_product_warning')}
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                  <p className="text-sm">{formatCurrency(selectedProduct.price)}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              <X className="mr-2 h-4 w-4" />
              {t('cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteProduct}
            >
              <Check className="mr-2 h-4 w-4" />
              {t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
