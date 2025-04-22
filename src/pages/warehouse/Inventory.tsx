
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const InventoryPage = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="inventory"
      description="manage_your_inventory_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('inventory_page_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default InventoryPage;
