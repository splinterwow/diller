
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const WarehouseReturns = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="returns"
      description="manage_warehouse_returns_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('warehouse_returns_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default WarehouseReturns;
