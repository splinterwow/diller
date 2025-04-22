
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const WarehouseSettings = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="settings"
      description="configure_warehouse_settings_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('warehouse_settings_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default WarehouseSettings;
