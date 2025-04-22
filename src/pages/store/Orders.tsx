
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const StoreOrders = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="orders"
      description="manage_store_orders_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('store_orders_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default StoreOrders;
