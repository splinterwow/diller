
import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart, PieChart } from '@/components/ui/charts';
import PageLayout from '@/components/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const SuperAdminReports = () => {
  const { t } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 3, 1),
  });

  // Fixed the type issue here by using a function that accepts DateRange
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
  };

  // Sample data for charts
  const subscriptionData = [
    { name: 'Jan', total: 12 },
    { name: 'Feb', total: 16 },
    { name: 'Mar', total: 18 },
    { name: 'Apr', total: 22 },
    { name: 'May', total: 28 },
    { name: 'Jun', total: 32 },
  ];

  const revenueData = [
    { name: 'Jan', total: 1800 },
    { name: 'Feb', total: 2200 },
    { name: 'Mar', total: 2600 },
    { name: 'Apr', total: 3200 },
    { name: 'May', total: 3800 },
    { name: 'Jun', total: 4200 },
  ];

  const planData = [
    { name: 'Start', value: 40 },
    { name: 'Pro', value: 35 },
    { name: 'Enterprise', value: 25 },
  ];

  return (
    <PageLayout
      title="reports"
      description="view_platform_performance_reports"
    >
      <div className="flex items-center justify-between mb-6">
        <DateRangePicker
          date={date}
          onChange={handleDateChange}
          className="w-full max-w-sm"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="subscriptions">{t('subscriptions')}</TabsTrigger>
          <TabsTrigger value="revenue">{t('revenue')}</TabsTrigger>
          <TabsTrigger value="users">{t('users')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('total_revenue')}</CardTitle>
                <CardDescription>{t('for_selected_period')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$18,800</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% {t('from_previous_period')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('new_subscribers')}</CardTitle>
                <CardDescription>{t('for_selected_period')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+128</div>
                <p className="text-xs text-muted-foreground">
                  +4.3% {t('from_previous_period')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t('active_users')}</CardTitle>
                <CardDescription>{t('for_selected_period')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,642</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% {t('from_previous_period')}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('revenue_over_time')}</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChart data={revenueData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('subscription_plans')}</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart data={planData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('subscription_growth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={subscriptionData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('revenue_growth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart data={revenueData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('user_activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={subscriptionData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default SuperAdminReports;
