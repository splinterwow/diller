
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  AlertCircle
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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import PageHeader from '@/components/PageHeader';
import StatsCard from '@/components/StatsCard';

// Mock data for the charts
const revenueData = [
  { name: 'Jan', revenue: 5000000 },
  { name: 'Feb', revenue: 6200000 },
  { name: 'Mar', revenue: 7800000 },
  { name: 'Apr', revenue: 6500000 },
  { name: 'May', revenue: 8900000 },
  { name: 'Jun', revenue: 9200000 },
  { name: 'Jul', revenue: 8700000 },
  { name: 'Aug', revenue: 9800000 },
  { name: 'Sep', revenue: 10500000 },
  { name: 'Oct', revenue: 11200000 },
  { name: 'Nov', revenue: 10800000 },
  { name: 'Dec', revenue: 12500000 },
];

const subscriptionData = [
  { name: 'Start', value: 35 },
  { name: 'Pro', value: 45 },
  { name: 'Enterprise', value: 20 },
];

const userGrowthData = [
  { name: 'Jan', users: 120 },
  { name: 'Feb', users: 145 },
  { name: 'Mar', users: 162 },
  { name: 'Apr', users: 178 },
  { name: 'May', users: 195 },
  { name: 'Jun', users: 210 },
  { name: 'Jul', users: 230 },
  { name: 'Aug', users: 245 },
  { name: 'Sep', users: 260 },
  { name: 'Oct', users: 285 },
  { name: 'Nov', users: 300 },
  { name: 'Dec', users: 320 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Alerts data
const alertsData = [
  {
    id: 1,
    title: 'Subscription Expiring',
    description: 'Company ABC\'s subscription expires in 3 days',
    type: 'warning',
    date: '2025-04-10',
  },
  {
    id: 2,
    title: 'Payment Failed',
    description: 'Payment from XYZ Ltd. failed. Amount: 750,000 UZS',
    type: 'error',
    date: '2025-04-11',
  },
  {
    id: 3,
    title: 'New Registration',
    description: 'New company registered: FreshFoods Inc.',
    type: 'info',
    date: '2025-04-09',
  },
  {
    id: 4,
    title: 'System Update',
    description: 'Platform update scheduled for April 15, 2025',
    type: 'info',
    date: '2025-04-08',
  },
];

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeUsers, setActiveUsers] = useState(0);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveUsers(285);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('dashboard')} 
        description={t('superadmin_dashboard_description')}
      >
        <Button onClick={() => navigate('/superadmin/reports')}>{t('view_reports')}</Button>
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('total_users')}
          value={activeUsers}
          icon={<Users size={24} />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title={t('active_subscriptions')}
          value={172}
          icon={<CreditCard size={24} />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title={t('monthly_revenue')}
          value={formatCurrency(94500000)}
          icon={<DollarSign size={24} />}
          trend={{ value: 14, isPositive: true }}
        />
        <StatsCard
          title={t('conversion_rate')}
          value="68%"
          icon={<TrendingUp size={24} />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">{t('revenue')}</TabsTrigger>
          <TabsTrigger value="subscriptions">{t('subscriptions')}</TabsTrigger>
          <TabsTrigger value="users">{t('user_growth')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('yearly_revenue')}</CardTitle>
              <CardDescription>
                {t('yearly_revenue_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => {
                        return value / 1000000 + 'M';
                      }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), t('revenue')]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {t('total_yearly_revenue')}: {formatCurrency(97600000)}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('subscription_distribution')}</CardTitle>
              <CardDescription>
                {t('subscription_distribution_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {subscriptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {t('total_subscriptions')}: 172
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('user_growth')}</CardTitle>
              <CardDescription>
                {t('user_growth_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userGrowthData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {t('user_growth_rate')}: 9.2% {t('monthly')}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Recent Activity & Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recent_activity')}</CardTitle>
            <CardDescription>
              {t('recent_activity_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {t('new_user_signed_up')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 {t('hours_ago')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('view_all_activity')}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>{t('alerts')}</CardTitle>
            <CardDescription>
              {t('alerts_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertsData.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4">
                  <div className={`rounded-full p-2 ${
                    alert.type === 'error' 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                      : alert.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.date}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {t('view_all_alerts')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
