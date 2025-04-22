
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const DealerSettings = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="settings"
      description="configure_dealer_settings_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('dealer_settings_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default DealerSettings;
