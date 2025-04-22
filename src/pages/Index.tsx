
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Truck, Package, Users, Store, BarChart3, ShieldCheck } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // If authenticated, redirect to the appropriate dashboard
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  // If not authenticated, show landing page
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">CDDiller</h1>
        </div>
        <div>
          <Button onClick={() => navigate('/login')} className="shadow-md">
            {t('login')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
          {t('distribution_management_platform')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8 animate-fade-in">
          {t('platform_description')}
        </p>
        <Button size="lg" onClick={() => navigate('/login')} className="shadow-lg animate-fade-in">
          {t('get_started')}
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('key_features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t('distribution_management')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {t('distribution_management_description')}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t('inventory_tracking')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {t('inventory_tracking_description')}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t('store_management')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {t('store_management_description')}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t('dealer_management')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {t('dealer_management_description')}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t('advanced_reporting')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {t('advanced_reporting_description')}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t('secure_transactions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                {t('secure_transactions_description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">{t('ready_to_streamline')}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          {t('cta_description')}
        </p>
        <Button size="lg" onClick={() => navigate('/login')} className="shadow-lg">
          {t('get_started_now')}
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">CDDiller</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('footer_description')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 CDDiller. {t('all_rights_reserved')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
