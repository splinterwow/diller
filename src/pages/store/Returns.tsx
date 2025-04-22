
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const StoreReturns = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="returns"
      description="manage_store_returns_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('store_returns_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default StoreReturns;
