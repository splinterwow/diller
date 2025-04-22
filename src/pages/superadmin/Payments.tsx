
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Download, 
  FileText, 
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CheckCircle2,
  Users,
  CreditCard as CreditCardIcon,
  BanknoteIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import PageHeader from '@/components/PageHeader';
import DataTable, { ColumnDef } from '@/components/DataTable';
import StatsCard from '@/components/StatsCard';

type Payment = {
  id: string;
  invoice: string;
  company: string;
  subscription: string;
  amount: number;
  date: string;
  status: 'succeeded' | 'pending' | 'failed';
  method: 'card' | 'bank' | 'cash';
};

const payments: Payment[] = [
  {
    id: '1',
    invoice: 'INV-2025-001',
    company: 'SoftDrinks LLC',
    subscription: 'Pro',
    amount: 500000,
    date: '2025-04-01',
    status: 'succeeded',
    method: 'card',
  },
  {
    id: '2',
    invoice: 'INV-2025-002',
    company: 'GoodFood Inc',
    subscription: 'Start',
    amount: 200000,
    date: '2025-04-03',
    status: 'succeeded',
    method: 'bank',
  },
  {
    id: '3',
    invoice: 'INV-2025-003',
    company: 'TechDistribution',
    subscription: 'Enterprise',
    amount: 2000000,
    date: '2025-04-05',
    status: 'pending',
    method: 'bank',
  },
  {
    id: '4',
    invoice: 'INV-2025-004',
    company: 'ClothesWholesale',
    subscription: 'Pro',
    amount: 500000,
    date: '2025-04-08',
    status: 'failed',
    method: 'card',
  },
  {
    id: '5',
    invoice: 'INV-2025-005',
    company: 'Grocery Plus',
    subscription: 'Start',
    amount: 200000,
    date: '2025-04-10',
    status: 'succeeded',
    method: 'cash',
  },
  {
    id: '6',
    invoice: 'INV-2025-006',
    company: 'Electronics Hub',
    subscription: 'Pro',
    amount: 500000,
    date: '2025-04-11',
    status: 'succeeded',
    method: 'card',
  },
];

const PaymentsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Calculate totals for stats
  const totalRevenue = payments.reduce((acc, payment) => {
    return payment.status === 'succeeded' ? acc + payment.amount : acc;
  }, 0);

  const pendingRevenue = payments.reduce((acc, payment) => {
    return payment.status === 'pending' ? acc + payment.amount : acc;
  }, 0);

  const failedRevenue = payments.reduce((acc, payment) => {
    return payment.status === 'failed' ? acc + payment.amount : acc;
  }, 0);

  const successfulPayments = payments.filter(p => p.status === 'succeeded').length;
  const totalPayments = payments.length;
  const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

  // Columns for the payments table
  const columns: ColumnDef[] = [
    {
      title: t('invoice'),
      field: 'invoice',
      sortable: true,
    },
    {
      title: t('company'),
      field: 'company',
      sortable: true,
    },
    {
      title: t('subscription'),
      field: 'subscription',
      sortable: true,
    },
    {
      title: t('amount'),
      field: 'amount',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      title: t('date'),
      field: 'date',
      sortable: true,
    },
    {
      title: t('method'),
      field: 'method',
      render: (value) => {
        const icon = value === 'card' ? (
          <CreditCardIcon className="h-4 w-4 mr-1" />
        ) : value === 'bank' ? (
          <BanknoteIcon className="h-4 w-4 mr-1" />
        ) : (
          <CreditCardIcon className="h-4 w-4 mr-1" />
        );
        
        return (
          <div className="flex items-center">
            {icon}
            <span>{value}</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      title: t('status'),
      field: 'status',
      render: (value) => {
        let statusComponent;
        
        if (value === 'succeeded') {
          statusComponent = (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>{t('succeeded')}</span>
            </div>
          );
        } else if (value === 'pending') {
          statusComponent = (
            <div className="flex items-center text-yellow-600 dark:text-yellow-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>{t('pending')}</span>
            </div>
          );
        } else {
          statusComponent = (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <XCircle className="h-4 w-4 mr-1" />
              <span>{t('failed')}</span>
            </div>
          );
        }
        
        return statusComponent;
      },
      sortable: true,
    },
    {
      title: t('actions'),
      field: 'actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPayment(row);
              setIsViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              console.log('Download invoice', row);
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  const handleExportPdf = () => {
    console.log('Export PDF');
  };

  const handleExportExcel = () => {
    console.log('Export Excel');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('payments')} 
        description={t('payments_description')}
      >
        <Button onClick={handleExportPdf}>
          <Download className="mr-2 h-4 w-4" />
          {t('export_report')}
        </Button>
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('total_revenue')}
          value={formatCurrency(totalRevenue)}
          icon={<CreditCard size={24} />}
          trend={{ value: 14, isPositive: true }}
        />
        <StatsCard
          title={t('pending_revenue')}
          value={formatCurrency(pendingRevenue)}
          icon={<Clock size={24} />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title={t('failed_revenue')}
          value={formatCurrency(failedRevenue)}
          icon={<XCircle size={24} />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard
          title={t('success_rate')}
          value={`${successRate.toFixed(1)}%`}
          icon={<CheckCircle2 size={24} />}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('all_payments')}</TabsTrigger>
          <TabsTrigger value="succeeded">{t('succeeded')}</TabsTrigger>
          <TabsTrigger value="pending">{t('pending')}</TabsTrigger>
          <TabsTrigger value="failed">{t('failed')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <DataTable
            columns={columns}
            data={payments}
            onRowClick={handleViewPayment}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('all_payments')}
            searchable
          />
        </TabsContent>
        
        <TabsContent value="succeeded" className="space-y-4">
          <DataTable
            columns={columns}
            data={payments.filter(p => p.status === 'succeeded')}
            onRowClick={handleViewPayment}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('succeeded_payments')}
            searchable
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <DataTable
            columns={columns}
            data={payments.filter(p => p.status === 'pending')}
            onRowClick={handleViewPayment}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('pending_payments')}
            searchable
          />
        </TabsContent>
        
        <TabsContent value="failed" className="space-y-4">
          <DataTable
            columns={columns}
            data={payments.filter(p => p.status === 'failed')}
            onRowClick={handleViewPayment}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('failed_payments')}
            searchable
          />
        </TabsContent>
      </Tabs>

      {/* Payment Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t('payment_details')}</DialogTitle>
            <DialogDescription>
              {t('payment_details_description')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-medium">{t('invoice')}</span>
                <span>{selectedPayment.invoice}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('company')}</span>
                <span>{selectedPayment.company}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('subscription')}</span>
                <span>{selectedPayment.subscription}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('amount')}</span>
                <span className="font-bold">{formatCurrency(selectedPayment.amount)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('date')}</span>
                <span>{selectedPayment.date}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">{t('method')}</span>
                <span>{t(selectedPayment.method)}</span>
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">{t('status')}</span>
                {selectedPayment.status === 'succeeded' && (
                  <span className="text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {t('succeeded')}
                  </span>
                )}
                
                {selectedPayment.status === 'pending' && (
                  <span className="text-yellow-600 dark:text-yellow-400 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {t('pending')}
                  </span>
                )}
                
                {selectedPayment.status === 'failed' && (
                  <span className="text-red-600 dark:text-red-400 flex items-center">
                    <XCircle className="h-4 w-4 mr-1" />
                    {t('failed')}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 mt-4">
            {selectedPayment && selectedPayment.status === 'pending' && (
              <Button 
                onClick={() => {
                  console.log('Mark as successful', selectedPayment);
                  setIsViewDialogOpen(false);
                }}
                className="flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('mark_as_succeeded')}
              </Button>
            )}
            
            {selectedPayment && selectedPayment.status === 'failed' && (
              <Button 
                onClick={() => {
                  console.log('Retry payment', selectedPayment);
                  setIsViewDialogOpen(false);
                }}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('retry_payment')}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Download invoice', selectedPayment);
              }}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('download_invoice')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
