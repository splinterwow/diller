
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AgentDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="dashboard"
      description="agent_dashboard_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('agent_dashboard_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AgentDashboard;
