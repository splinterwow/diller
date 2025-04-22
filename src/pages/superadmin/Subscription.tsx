
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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
import { Switch } from '@/components/ui/switch';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import PageHeader from '@/components/PageHeader';
import DataTable, { ColumnDef } from '@/components/DataTable';

type Subscription = {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  dealersLimit: number;
  storesLimit: number;
  productsLimit: number;
  warehousesLimit: number;
  features: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
};

const subscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Start',
    price: 200000,
    period: 'monthly',
    dealersLimit: 10,
    storesLimit: 50,
    productsLimit: 1000,
    warehousesLimit: 1,
    features: ['Basic reporting', 'Email support', 'API access'],
    status: 'active',
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    name: 'Pro',
    price: 500000,
    period: 'monthly',
    dealersLimit: 25,
    storesLimit: 100,
    productsLimit: 5000,
    warehousesLimit: 3,
    features: ['Advanced reporting', 'Priority support', 'API access', 'Custom branding'],
    status: 'active',
    createdAt: '2025-01-20',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 2000000,
    period: 'monthly',
    dealersLimit: -1, // unlimited
    storesLimit: -1, // unlimited
    productsLimit: -1, // unlimited
    warehousesLimit: -1, // unlimited
    features: ['All features', '24/7 support', 'API access', 'Custom branding', 'Dedicated account manager'],
    status: 'active',
    createdAt: '2025-02-01',
  },
  {
    id: '4',
    name: 'Seasonal',
    price: 350000,
    period: 'monthly',
    dealersLimit: 15,
    storesLimit: 75,
    productsLimit: 2000,
    warehousesLimit: 2,
    features: ['Basic reporting', 'Email support', 'API access', 'Seasonal discounts'],
    status: 'draft',
    createdAt: '2025-03-10',
  },
];

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();

  // Subscription configuration
  const [dealersCount, setDealersCount] = useState<number>(10);
  const [storesCount, setStoresCount] = useState<number>(50);
  const [productsCount, setProductsCount] = useState<number>(1000);
  const [warehousesCount, setWarehousesCount] = useState<number>(1);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [additionalFeatures, setAdditionalFeatures] = useState<{
    api: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
  }>({
    api: false,
    customBranding: false,
    prioritySupport: false,
  });

  // Calculate price based on configuration
  const calculatePrice = (): number => {
    // Base prices
    const dealerPrice = 50000; // per dealer
    const storePrice = 10000; // per store
    const productPrice = 100; // per product
    const warehousePrice = 100000; // per warehouse

    // Additional features prices
    const apiPrice = 100000;
    const customBrandingPrice = 200000;
    const prioritySupportPrice = 300000;

    // Calculate base price
    let price = 
      dealersCount * dealerPrice +
      storesCount * storePrice +
      (productsCount / 10) * productPrice + // charge per 10 products
      warehousesCount * warehousePrice;

    // Add additional features
    if (additionalFeatures.api) price += apiPrice;
    if (additionalFeatures.customBranding) price += customBrandingPrice;
    if (additionalFeatures.prioritySupport) price += prioritySupportPrice;

    // Apply yearly discount
    if (billingPeriod === 'yearly') {
      price = price * 12 * 0.8; // 20% discount for yearly billing
    }

    return price;
  };

  // Format limits for display
  const formatLimit = (limit: number): string => {
    return limit === -1 ? t('unlimited') : limit.toString();
  };

  // Columns for the subscriptions table
  const columns: ColumnDef[] = [
    {
      title: t('name'),
      field: 'name',
      sortable: true,
    },
    {
      title: t('price'),
      field: 'price',
      render: (value) => formatCurrency(value),
      sortable: true,
    },
    {
      title: t('period'),
      field: 'period',
      render: (value) => value === 'monthly' ? t('monthly') : t('yearly'),
      sortable: true,
    },
    {
      title: t('dealers_limit'),
      field: 'dealersLimit',
      render: (value) => formatLimit(value),
      sortable: true,
    },
    {
      title: t('stores_limit'),
      field: 'storesLimit',
      render: (value) => formatLimit(value),
      sortable: true,
    },
    {
      title: t('status'),
      field: 'status',
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : value === 'draft'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {value}
        </span>
      ),
      sortable: true,
    },
  ];

  // Functions to handle subscription actions
  const handleAddSubscription = () => {
    console.log('Add subscription');
  };

  const handleEditSubscription = (subscription: Subscription) => {
    console.log('Edit subscription:', subscription);
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    console.log('Delete subscription:', subscription);
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
        title={t('subscription')} 
        description={t('subscription_description')}
      >
        <Button onClick={handleAddSubscription}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('add_subscription')}
        </Button>
      </PageHeader>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">{t('subscription_plans')}</TabsTrigger>
          <TabsTrigger value="configurator">{t('price_configurator')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-4">
          <DataTable
            columns={columns}
            data={subscriptions}
            onAdd={handleAddSubscription}
            onEdit={handleEditSubscription}
            onDelete={handleDeleteSubscription}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            title={t('subscription_plans')}
            searchable
          />
        </TabsContent>
        
        <TabsContent value="configurator" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('configure_subscription')}</CardTitle>
                <CardDescription>
                  {t('configure_subscription_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dealers Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dealers">{t('dealers_count')}</Label>
                    <span className="text-sm font-medium">{dealersCount === 100 ? t('unlimited') : dealersCount}</span>
                  </div>
                  <Slider
                    id="dealers"
                    min={1}
                    max={100}
                    step={1}
                    value={[dealersCount]}
                    onValueChange={(value) => setDealersCount(value[0])}
                    className="w-full"
                  />
                </div>
                
                {/* Stores Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stores">{t('stores_count')}</Label>
                    <span className="text-sm font-medium">{storesCount === 500 ? t('unlimited') : storesCount}</span>
                  </div>
                  <Slider
                    id="stores"
                    min={1}
                    max={500}
                    step={5}
                    value={[storesCount]}
                    onValueChange={(value) => setStoresCount(value[0])}
                    className="w-full"
                  />
                </div>
                
                {/* Products Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="products">{t('products_count')}</Label>
                    <span className="text-sm font-medium">{productsCount === 10000 ? t('unlimited') : productsCount}</span>
                  </div>
                  <Slider
                    id="products"
                    min={100}
                    max={10000}
                    step={100}
                    value={[productsCount]}
                    onValueChange={(value) => setProductsCount(value[0])}
                    className="w-full"
                  />
                </div>
                
                {/* Warehouses Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="warehouses">{t('warehouses_count')}</Label>
                    <span className="text-sm font-medium">{warehousesCount === 10 ? t('unlimited') : warehousesCount}</span>
                  </div>
                  <Slider
                    id="warehouses"
                    min={1}
                    max={10}
                    step={1}
                    value={[warehousesCount]}
                    onValueChange={(value) => setWarehousesCount(value[0])}
                    className="w-full"
                  />
                </div>
                
                {/* Billing Period */}
                <div className="space-y-2">
                  <Label htmlFor="billing-period">{t('billing_period')}</Label>
                  <Select
                    value={billingPeriod}
                    onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
                  >
                    <SelectTrigger id="billing-period">
                      <SelectValue placeholder={t('select_billing_period')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">{t('monthly')}</SelectItem>
                      <SelectItem value="yearly">{t('yearly')} (20% {t('discount')})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Additional Features */}
                <div className="space-y-4">
                  <Label>{t('additional_features')}</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="api">{t('api_access')}</Label>
                      <p className="text-xs text-muted-foreground">{formatCurrency(100000)}</p>
                    </div>
                    <Switch
                      id="api"
                      checked={additionalFeatures.api}
                      onCheckedChange={(checked) => 
                        setAdditionalFeatures({...additionalFeatures, api: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="custom-branding">{t('custom_branding')}</Label>
                      <p className="text-xs text-muted-foreground">{formatCurrency(200000)}</p>
                    </div>
                    <Switch
                      id="custom-branding"
                      checked={additionalFeatures.customBranding}
                      onCheckedChange={(checked) => 
                        setAdditionalFeatures({...additionalFeatures, customBranding: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="priority-support">{t('priority_support')}</Label>
                      <p className="text-xs text-muted-foreground">{formatCurrency(300000)}</p>
                    </div>
                    <Switch
                      id="priority-support"
                      checked={additionalFeatures.prioritySupport}
                      onCheckedChange={(checked) => 
                        setAdditionalFeatures({...additionalFeatures, prioritySupport: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Pricing Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t('pricing_summary')}</CardTitle>
                <CardDescription>
                  {t('pricing_summary_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('dealers')} ({dealersCount})</span>
                    <span className="text-sm font-medium">{formatCurrency(dealersCount * 50000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('stores')} ({storesCount})</span>
                    <span className="text-sm font-medium">{formatCurrency(storesCount * 10000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('products')} ({productsCount})</span>
                    <span className="text-sm font-medium">{formatCurrency((productsCount / 10) * 100)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('warehouses')} ({warehousesCount})</span>
                    <span className="text-sm font-medium">{formatCurrency(warehousesCount * 100000)}</span>
                  </div>
                  
                  {additionalFeatures.api && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('api_access')}</span>
                      <span className="text-sm font-medium">{formatCurrency(100000)}</span>
                    </div>
                  )}
                  
                  {additionalFeatures.customBranding && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('custom_branding')}</span>
                      <span className="text-sm font-medium">{formatCurrency(200000)}</span>
                    </div>
                  )}
                  
                  {additionalFeatures.prioritySupport && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('priority_support')}</span>
                      <span className="text-sm font-medium">{formatCurrency(300000)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('subtotal')}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(calculatePrice() / (billingPeriod === 'yearly' ? 0.8 : 1))}
                      </span>
                    </div>
                    
                    {billingPeriod === 'yearly' && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('yearly_discount')} (20%)
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          - {formatCurrency(calculatePrice() / 0.8 * 0.2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{t('total')} ({billingPeriod === 'monthly' ? t('monthly') : t('yearly')})</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(calculatePrice())}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {t('create_subscription_plan')}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Popular Plan Templates */}
          <h2 className="text-xl font-semibold mt-8 mb-4">{t('popular_templates')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Start Plan */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('start_plan')}</CardTitle>
                <CardDescription>{t('start_plan_description')}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatCurrency(200000)}</span>
                  <span className="text-muted-foreground"> / {t('month')}</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">10 {t('dealers')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">50 {t('stores')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">1,000 {t('products')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">1 {t('warehouse')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('basic_reporting')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('email_support')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => {
                  setDealersCount(10);
                  setStoresCount(50);
                  setProductsCount(1000);
                  setWarehousesCount(1);
                  setBillingPeriod('monthly');
                  setAdditionalFeatures({
                    api: false,
                    customBranding: false,
                    prioritySupport: false,
                  });
                }}>
                  {t('use_template')}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pro Plan */}
            <Card className="border-primary">
              <CardHeader className="pb-2">
                <div className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground mb-2">
                  {t('popular')}
                </div>
                <CardTitle>{t('pro_plan')}</CardTitle>
                <CardDescription>{t('pro_plan_description')}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatCurrency(500000)}</span>
                  <span className="text-muted-foreground"> / {t('month')}</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">25 {t('dealers')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">100 {t('stores')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">5,000 {t('products')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">3 {t('warehouses')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('advanced_reporting')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('priority_support')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => {
                  setDealersCount(25);
                  setStoresCount(100);
                  setProductsCount(5000);
                  setWarehousesCount(3);
                  setBillingPeriod('monthly');
                  setAdditionalFeatures({
                    api: true,
                    customBranding: true,
                    prioritySupport: true,
                  });
                }}>
                  {t('use_template')}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Enterprise Plan */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('enterprise_plan')}</CardTitle>
                <CardDescription>{t('enterprise_plan_description')}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatCurrency(2000000)}</span>
                  <span className="text-muted-foreground"> / {t('month')}</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('unlimited')} {t('dealers')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('unlimited')} {t('stores')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('unlimited')} {t('products')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('unlimited')} {t('warehouses')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('all_features')}</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">{t('dedicated_manager')}</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => {
                  setDealersCount(100); // Using max as unlimited
                  setStoresCount(500); // Using max as unlimited
                  setProductsCount(10000); // Using max as unlimited
                  setWarehousesCount(10); // Using max as unlimited
                  setBillingPeriod('monthly');
                  setAdditionalFeatures({
                    api: true,
                    customBranding: true,
                    prioritySupport: true,
                  });
                }}>
                  {t('use_template')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionPage;
