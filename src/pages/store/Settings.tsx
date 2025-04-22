
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const StoreSettings = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="settings"
      description="configure_store_settings_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('store_settings_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default StoreSettings;
