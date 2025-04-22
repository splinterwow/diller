
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart } from '@/components/ui/charts';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  
  // Sample data
  const revenueData = [
    { name: 'Jan', total: 1500 },
    { name: 'Feb', total: 1700 },
    { name: 'Mar', total: 2300 },
    { name: 'Apr', total: 2800 },
    { name: 'May', total: 3200 },
    { name: 'Jun', total: 3500 },
  ];
  
  const productData = [
    { name: 'Cola', total: 580 },
    { name: 'Fanta', total: 420 },
    { name: 'Sprite', total: 380 },
    { name: 'Water', total: 320 },
    { name: 'Juice', total: 220 },
  ];
  
  // Calculate total values (fixed the arithmetic operation)
  const totalSales = revenueData.reduce((sum, item) => sum + Number(item.total), 0);
  const totalProducts = 1245;
  const totalDealers = 24;
  const totalStores = 142;
  
  return (
    <PageLayout 
      title="dashboard"
      description="welcome_to_admin_dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('total_sales')}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              +18.1% {t('from_last_month')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('total_products')}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +4.3% {t('from_last_month')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('active_dealers')}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDealers}</div>
            <p className="text-xs text-muted-foreground">
              +2 {t('new_this_month')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('active_stores')}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStores}</div>
            <p className="text-xs text-muted-foreground">
              +12 {t('new_this_month')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
          <TabsTrigger value="reports">{t('reports')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('revenue_over_time')}</CardTitle>
                <CardDescription>
                  {t('monthly_revenue_for_current_year')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <AreaChart data={revenueData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('top_selling_products')}</CardTitle>
                <CardDescription>
                  {t('best_performing_products_this_month')}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart data={productData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('performance_analytics')}</CardTitle>
              <CardDescription>
                {t('detailed_performance_metrics')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('analytics_content_placeholder')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('sales_reports')}</CardTitle>
              <CardDescription>
                {t('downloadable_reports')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('reports_content_placeholder')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default AdminDashboard;
