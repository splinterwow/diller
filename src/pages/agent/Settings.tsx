
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const AgentSettings = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout 
      title="settings"
      description="configure_agent_settings_description"
    >
      <Card>
        <CardContent className="pt-6">
          <p>{t('agent_settings_content')}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AgentSettings;
