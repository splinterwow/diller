
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const DealerProducts = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="products"
      description="manage_dealer_products_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('dealer_products_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default DealerProducts;
