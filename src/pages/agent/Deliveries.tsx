
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AgentDeliveries = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="deliveries"
      description="manage_agent_deliveries_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('agent_deliveries_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AgentDeliveries;
