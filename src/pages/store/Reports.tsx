
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const StoreReports = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="reports"
      description="view_store_reports_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('store_reports_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default StoreReports;
