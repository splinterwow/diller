
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const WarehouseReports = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="reports"
      description="view_warehouse_reports_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('warehouse_reports_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default WarehouseReports;
