
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const DealerAgents = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="agents"
      description="manage_dealer_agents_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('dealer_agents_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default DealerAgents;
