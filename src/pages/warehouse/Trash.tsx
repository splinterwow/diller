
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const WarehouseTrash = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="trash"
      description="manage_warehouse_trash_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('warehouse_trash_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default WarehouseTrash;
