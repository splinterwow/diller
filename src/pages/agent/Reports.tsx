
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AgentReports = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="reports"
      description="view_agent_reports_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('agent_reports_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AgentReports;
